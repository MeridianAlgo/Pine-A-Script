import json
import os
import sys

def main():
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

    model_id = os.environ.get("PINE_REVIEWER_MODEL", "chathuranga-jayanath/codet5-small-v2")
    max_new = int(os.environ.get("PINE_REVIEWER_MAX_NEW_TOKENS", "192"))

    errors = []
    warnings = []
    notes = []

    if "undefined" in code:
        warnings.append("Generated code contains the string 'undefined' (may indicate missing values).")

    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        import torch

        tok = AutoTokenizer.from_pretrained(model_id)
        try:
            model = AutoModelForSeq2SeqLM.from_pretrained(model_id, use_safetensors=True)
        except TypeError:
            model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
        except Exception:
            model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

        device = "cpu"
        if torch.cuda.is_available() and os.environ.get("PINE_REVIEWER_USE_CUDA", "0") == "1":
            device = "cuda"
            model.to(device)

        prompt = (
            "summarize: Provide a short code review for this JavaScript module generated from PineScript. "
            "List likely runtime errors, suspicious undefined identifiers, and a brief verdict.\n\n"
            "code:\n" + code[:12000]
        )

        inputs = tok(prompt, return_tensors="pt", truncation=True, max_length=2048)
        if device != "cpu":
            inputs = {k: v.to(device) for k, v in inputs.items()}

        out = model.generate(
            **inputs,
            max_new_tokens=max_new,
            do_sample=False,
            num_beams=2,
        )
        text = tok.decode(out[0], skip_special_tokens=True).strip()

        if len(text) >= 120:
            grams = set(text[i : i + 3] for i in range(0, min(len(text) - 2, 600)))
            if len(grams) <= 8:
                text = "(model output was highly repetitive/unusable; try a different PINE_REVIEWER_MODEL)"

        if len(text) > 800:
            text = text[:800] + " ..."

        notes.append(f"Model({model_id}) review: {text if text else '(empty)'}")

    except Exception as e:
        notes.append(f"Model review unavailable: {e}")

    sys.stdout.write(json.dumps({"ok": len(errors) == 0, "errors": errors, "warnings": warnings, "notes": notes}))


if __name__ == "__main__":
    main()
