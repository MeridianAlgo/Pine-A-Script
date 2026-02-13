import json
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

# Optional local reviewer server for Pine-to-JS conversions.
# Exposes POST /review with JSON body: {"code": "..."}
# Returns: {"ok": bool, "errors": [], "warnings": [], "notes": []}

MODEL_ID = os.environ.get("PINE_REVIEWER_MODEL", "Salesforce/codet5-small")
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
    # Keep it short: small models are not chat models.
    # We ask for a small checklist-style output.
    return (
        "You are a strict code reviewer. Review the following JavaScript code produced from PineScript. "
        "Return: (1) any likely runtime errors, (2) suspicious undefined identifiers, (3) a short overall verdict.\n\n"
        "CODE:\n" + code[:12000]
    )


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
            notes.append(f"Model({MODEL_ID}) review: {review_text.strip()}")
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
