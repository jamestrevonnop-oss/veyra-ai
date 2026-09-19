import json
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

import torch

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))

if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from model.tokenizer.basic_tokenizer import BasicTokenizer
from model.transformer.veyra_model import VeyraConfig, VeyraModel


HOST = "127.0.0.1"
PORT = int(os.environ.get("VEYRA_MODEL_PORT", "8000"))

CHECKPOINT = os.path.join(
    ROOT,
    "model",
    "checkpoints",
    "best.pt"
)

TOKENIZER_PATH = os.path.join(
    ROOT,
    "model",
    "checkpoints",
    "tokenizer.json"
)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("=================================")
print("       VEYRA MODEL SERVICE       ")
print("=================================")
print(f"Checkpoint: {CHECKPOINT}")
print(f"Tokenizer:  {TOKENIZER_PATH}")
print(f"Device:     {device}")


tokenizer = BasicTokenizer.load(TOKENIZER_PATH)

checkpoint = torch.load(
    CHECKPOINT,
    map_location=device,
    weights_only=False
)

saved_config = checkpoint.get("config", {})

model_config = VeyraConfig(
    vocab_size=int(saved_config.get("vocab_size", tokenizer.vocab_size)),
    max_seq_len=int(saved_config.get("max_seq_len", 64)),
    d_model=int(saved_config.get("d_model", 256)),
    n_heads=int(saved_config.get("n_heads", 8)),
    n_layers=int(saved_config.get("n_layers", 6)),
    d_ff=int(saved_config.get("d_ff", 1024)),
    dropout=float(saved_config.get("dropout", 0.1)),
)

model = VeyraModel(model_config)

model.load_state_dict(
    checkpoint["model_state"],
    strict=True
)

model.to(device)
model.eval()

print(f"Vocabulary: {tokenizer.vocab_size}")
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
print("Model loaded.")
print("")


def build_prompt(messages):
    """
    Turn the conversation into a simple instruction format.

    Keeping the full conversation here is important:
    Veyra should receive context rather than only the final user message.
    """

    parts = []

    for message in messages:
        role = str(message.get("role", "user")).lower()
        content = str(message.get("content", "")).strip()

        if not content:
            continue

        if role == "system":
            parts.append(f"System: {content}")
        elif role == "assistant":
            parts.append(f"Veyra: {content}")
        else:
            parts.append(f"User: {content}")

    parts.append("Veyra:")

    return "\n".join(parts)


def generate_response(
    messages,
    max_new_tokens=80,
    temperature=0.75,
    top_k=20
):
    prompt = build_prompt(messages)

    input_ids = tokenizer.encode(
        prompt,
        add_special_tokens=True
    )

    input_tensor = torch.tensor(
        [input_ids],
        dtype=torch.long,
        device=device
    )

    with torch.no_grad():
        output_ids = model.generate(
            input_tensor,
            max_new_tokens=min(int(max_new_tokens), 120),
            temperature=max(float(temperature), 0.05),
            top_k=max(int(top_k), 1)
        )

    generated_ids = output_ids[0].tolist()

    new_ids = generated_ids[len(input_ids):]

    text = tokenizer.decode(new_ids).strip()

    # Stop obvious role leakage from the tiny model.
    stop_markers = [
        "\nUser:",
        "\nSystem:",
        "\nVeyra:",
    ]

    for marker in stop_markers:
        if marker in text:
            text = text.split(marker, 1)[0].strip()

    return text


class Handler(BaseHTTPRequestHandler):

    def send_json(self, status, data):
        body = json.dumps(data).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )

        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )

        self.send_header(
            "Access-Control-Allow-Methods",
            "POST,OPTIONS"
        )

        self.send_header(
            "Content-Length",
            str(len(body))
        )

        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)

        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )

        self.send_header(
            "Access-Control-Allow-Methods",
            "POST,OPTIONS"
        )

        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_json(
                200,
                {
                    "status": "healthy",
                    "service": "veyra-model",
                    "device": str(device),
                    "model": "veyra-dev"
                }
            )
            return

        self.send_json(
            404,
            {
                "error": "Not found"
            }
        )

    def do_POST(self):
        if self.path != "/generate":
            self.send_json(
                404,
                {
                    "error": "Not found"
                }
            )
            return

        try:
            content_length = int(
                self.headers.get("Content-Length", "0")
            )

            if content_length > 2 * 1024 * 1024:
                self.send_json(
                    413,
                    {
                        "error": "Request too large"
                    }
                )
                return

            raw_body = self.rfile.read(content_length)

            body = json.loads(
                raw_body.decode("utf-8")
            )

            messages = body.get("messages")

            if not isinstance(messages, list):
                self.send_json(
                    400,
                    {
                        "error": "messages must be an array"
                    }
                )
                return

            response = generate_response(
                messages=messages,
                max_new_tokens=body.get(
                    "max_new_tokens",
                    80
                ),
                temperature=body.get(
                    "temperature",
                    0.75
                ),
                top_k=body.get(
                    "top_k",
                    20
                )
            )

            if not response:
                response = (
                    "I don't have enough information to "
                    "give a useful answer yet."
                )

            self.send_json(
                200,
                {
                    "model": "veyra-dev",
                    "content": response
                }
            )

        except Exception as error:
            print(
                "Generation error:",
                repr(error)
            )

            self.send_json(
                500,
                {
                    "error": str(error)
                }
            )

    def log_message(self, format, *args):
        print(
            f"[MODEL] {self.address_string()} "
            f"{format % args}"
        )


server = HTTPServer(
    (HOST, PORT),
    Handler
)

print(
    f"Veyra model server running on "
    f"http://{HOST}:{PORT}"
)

server.serve_forever()
