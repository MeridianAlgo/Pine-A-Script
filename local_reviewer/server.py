import json
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

# Optional local reviewer server for Pine-to-JS conversions.
# Exposes POST /review with JSON body: {"code": "..."}
# Returns: {"ok": bool, "errors": [], "warnings": [], "notes": []}

# Prefer a safetensors-backed small CodeT5 variant by default to avoid torch.load restrictions.
# You can override via PINE_REVIEWER_MODEL.
MODEL_ID = os.environ.get("PINE_REVIEWER_MODEL", "chathuranga-jayanath/codet5-small-v2")
HOST = os.environ.get("PINE_REVIEWER_HOST", "127.0.0.1")
PORT = int(os.environ.get("PINE_REVIEWER_PORT", "8765"))
MAX_NEW_TOKENS = int(os.environ.get("PINE_REVIEWER_MAX_NEW_TOKENS", "192"))

_generator = None


def get_generator():
    global _generator
    if _generator is not None:
        return _generator

    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        import torch
    except Exception as e:
        raise RuntimeError(
            "Missing dependencies. Install with: pip install -r local_reviewer/requirements.txt"
        ) from e

    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    try:
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID, use_safetensors=True)
    except TypeError:
        # Older transformers might not accept use_safetensors.
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID)
    except Exception:
        # As a fallback, try the default loader.
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID)

    device = "cpu"
    if torch.cuda.is_available() and os.environ.get("PINE_REVIEWER_USE_CUDA", "0") == "1":
        device = "cuda"
        model.to(device)

    def generate(prompt: str) -> str:
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
        if device != "cpu":
            inputs = {k: v.to(device) for k, v in inputs.items()}
        out = model.generate(
            **inputs,
            max_new_tokens=MAX_NEW_TOKENS,
            do_sample=False,
            num_beams=2,
        )
        return tokenizer.decode(out[0], skip_special_tokens=True)

    _generator = generate
    return _generator


def build_prompt(code: str) -> str:
    # CodeT5-style models often work better with an explicit task prefix.
    # Keep it short: this is a small model.
    return (
        "summarize: Provide a short code review for this JavaScript module generated from PineScript. "
        "List likely runtime errors, suspicious undefined identifiers, and a brief verdict.\n\n"
        "code:\n" + code[:12000]
    )


def sanitize_model_text(text: str) -> str:
    t = (text or "").strip()
    if not t:
        return "(empty)"

    # Detect degenerate outputs without spaces (e.g. 'deletedelete...').
    # Heuristic: very low diversity of 3-grams or extremely repetitive prefix.
    if len(t) >= 120:
        grams = set(t[i : i + 3] for i in range(0, min(len(t) - 2, 600)))
        if len(grams) <= 8:
            return "(model output was highly repetitive/unusable; try a different PINE_REVIEWER_MODEL)"

        # Repeated prefix check
        prefix = t[:12]
        if prefix and t.count(prefix) >= 8:
            return "(model output was highly repetitive/unusable; try a different PINE_REVIEWER_MODEL)"

    # Detect extreme repetition like "delete delete delete ..."
    words = t.split()
    if len(words) >= 40:
        first = words[0]
        same_prefix = 0
        for w in words[:80]:
            if w == first:
                same_prefix += 1
            else:
                break
        if same_prefix >= 30:
            return "(model output was highly repetitive/unusable; try a different PINE_REVIEWER_MODEL)"

    # Cap note length so logs stay readable.
    if len(t) > 800:
        t = t[:800] + " ..."
    return t


def heuristic_checks(code: str):
    errors = []
    warnings = []

    if "TODO" in code:
        warnings.append("Generated code contains TODO markers.")

    if "undefined" in code:
        warnings.append("Generated code contains the string 'undefined' (may indicate missing values).")

    if "eval(" in code:
        warnings.append("Generated code contains eval().")

    return errors, warnings


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path != "/review":
            self._send(404, {"ok": False, "errors": ["Not found"], "warnings": [], "notes": []})
            return

        length = int(self.headers.get("content-length", "0"))
        raw = self.rfile.read(length) if length > 0 else b"{}"

        try:
            body = json.loads(raw.decode("utf-8"))
        except Exception:
            self._send(400, {"ok": False, "errors": ["Invalid JSON"], "warnings": [], "notes": []})
            return

        code = body.get("code", "")
        if not isinstance(code, str) or not code.strip():
            self._send(400, {"ok": False, "errors": ["Missing 'code'"], "warnings": [], "notes": []})
            return

        errors, warnings = heuristic_checks(code)
        notes = []

        # Model-based note (best-effort)
        try:
            gen = get_generator()
            prompt = build_prompt(code)
            review_text = gen(prompt)
            notes.append(f"Model({MODEL_ID}) review: {sanitize_model_text(review_text)}")
        except Exception as e:
            notes.append(f"Model review unavailable: {e}")

        ok = len(errors) == 0
        self._send(200, {"ok": ok, "errors": errors, "warnings": warnings, "notes": notes})


def main():
    print(f"Starting local reviewer on http://{HOST}:{PORT}/review")
    print(f"Model: {MODEL_ID}")
    server = HTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Failed to start server: {e}", file=sys.stderr)
        sys.exit(1)
