import json
import os
import sys
import re

def main():
    def log(msg: str):
        print(msg, file=sys.stderr, flush=True)

    raw = sys.stdin.read()
    try:
        req = json.loads(raw) if raw.strip() else {}
    except Exception:
        sys.stdout.write(json.dumps({"ok": False, "errors": ["Invalid JSON on stdin"], "warnings": [], "notes": []}))
        return

    code = req.get("code", "")
    if not isinstance(code, str) or not code.strip():
        sys.stdout.write(json.dumps({"ok": False, "errors": ["Missing 'code'"], "warnings": [], "notes": []}))
        return

    model_id = os.environ.get("PINE_REVIEWER_MODEL", "Qwen/Qwen2.5-Coder-0.5B-Instruct")
    max_new = int(os.environ.get("PINE_REVIEWER_MAX_NEW_TOKENS", "256"))
    # Default to a small non-zero temperature so the model doesn't immediately emit EOS on some prompts.
    temperature = float(os.environ.get("PINE_REVIEWER_TEMPERATURE", "0.2"))

    errors = []
    warnings = []
    notes = []

    if "undefined" in code:
        warnings.append("Generated code contains the string 'undefined' (may indicate missing values).")

    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        import torch

        log(f"[ai-review] Loading tokenizer: {model_id}")
        tok = AutoTokenizer.from_pretrained(model_id)

        log(f"[ai-review] Loading model: {model_id} (first run may take a while)")
        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            device_map="auto" if os.environ.get("PINE_REVIEWER_USE_CUDA", "0") == "1" else None,
            torch_dtype=torch.float16 if os.environ.get("PINE_REVIEWER_USE_CUDA", "0") == "1" else None,
        )

        device = "cpu"
        if torch.cuda.is_available() and os.environ.get("PINE_REVIEWER_USE_CUDA", "0") == "1":
            device = "cuda"
            model.to(device)

        prompt_text = (
            "You are a strict code reviewer for JavaScript generated from PineScript. "
            "Give concise bullets. Prefer phrasing like 'possible issue' or 'check that...'. "
            "Do not invent identifiers that are not in the code.\n\n"
            "Return 3 sections:\n"
            "- Possible runtime issues\n"
            "- Possible missing mappings/runtime builtins\n"
            "- Suggestions\n\n"
            "CODE START\n"
            + code[:12000]
            + "\nCODE END\n"
        )

        if hasattr(tok, "apply_chat_template"):
            messages = [
                {"role": "system", "content": "You are a code reviewer."},
                {"role": "user", "content": prompt_text},
            ]
            prompt = tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        else:
            prompt = prompt_text + "\n\nAnswer:\n"

        inputs = tok(prompt, return_tensors="pt", truncation=True, max_length=2048)
        if device != "cpu":
            inputs = {k: v.to(device) for k, v in inputs.items()}

        log("[ai-review] Generating review...")
        out = model.generate(
            **inputs,
            max_new_tokens=max_new,
            min_new_tokens=int(os.environ.get("PINE_REVIEWER_MIN_NEW_TOKENS", "48")),
            do_sample=True,
            temperature=temperature,
            top_p=0.9,
            pad_token_id=tok.eos_token_id,
            eos_token_id=tok.eos_token_id,
        )

        # Decode only the newly generated tokens (exclude the prompt tokens)
        prompt_len = inputs["input_ids"].shape[1]
        gen_tokens = out[0][prompt_len:]
        text = tok.decode(gen_tokens, skip_special_tokens=True)
        text = (text or "").strip()
        if text.startswith(":"):
            text = text[1:].lstrip()

        # If the code does not mention pinescript at all, drop any model lines that do.
        if "pinescript" not in code.lower():
            text = "\n".join([ln for ln in text.splitlines() if "pinescript" not in ln.lower()]).strip()

        if not text:
            text = "(model returned empty output)"

        if len(text) >= 120:
            grams = set(text[i : i + 3] for i in range(0, min(len(text) - 2, 600)))
            if len(grams) <= 8:
                text = "(model output was highly repetitive/unusable; try a different PINE_REVIEWER_MODEL)"

        if len(text) > 800:
            text = text[:800] + " ..."

        notes.append(f"Model({model_id}) review: {text if text else '(empty)'}")
        log("[ai-review] Done")

    except Exception as e:
        notes.append(f"Model review unavailable: {e}")

    sys.stdout.write(json.dumps({"ok": len(errors) == 0, "errors": errors, "warnings": warnings, "notes": notes}))


if __name__ == "__main__":
    main()
