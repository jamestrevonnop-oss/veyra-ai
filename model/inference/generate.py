from pathlib import Path

import torch

from model.tokenizer.basic_tokenizer import BasicTokenizer
from model.transformer.veyra_model import (
    VeyraConfig,
    VeyraModel
)


TOKENIZER_PATH = Path(
    "model/checkpoints/tokenizer.json"
)

MODEL_PATH = Path(
    "model/checkpoints/best.pt"
)


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model checkpoint not found: {MODEL_PATH}"
        )

    if not TOKENIZER_PATH.exists():
        raise FileNotFoundError(
            f"Tokenizer not found: {TOKENIZER_PATH}"
        )

    checkpoint = torch.load(
        MODEL_PATH,
        map_location="cpu",
        weights_only=False
    )

    config = VeyraConfig(
        **checkpoint["config"]
    )

    tokenizer = BasicTokenizer.load(
        TOKENIZER_PATH
    )

    # Make absolutely sure the model and tokenizer agree.
    if tokenizer.vocab_size != config.vocab_size:
        raise RuntimeError(
            "Tokenizer/model vocabulary mismatch: "
            f"tokenizer={tokenizer.vocab_size}, "
            f"model={config.vocab_size}. "
            "Retrain the model so both use the same tokenizer."
        )

    model = VeyraModel(config)

    model.load_state_dict(
        checkpoint["model_state"]
    )

    model.eval()

    return model, tokenizer


def generate(
    prompt,
    max_new_tokens=50,
    temperature=0.8,
    top_k=10
):
    model, tokenizer = load_model()

    encoded = tokenizer.encode(
        prompt,
        add_special_tokens=True
    )

    # Safety check before entering the embedding layer.
    invalid_tokens = [
        token_id
        for token_id in encoded
        if token_id < 0 or token_id >= model.config.vocab_size
    ]

    if invalid_tokens:
        raise RuntimeError(
            "Tokenizer produced invalid token IDs: "
            f"{invalid_tokens}"
        )

    input_ids = torch.tensor(
        [encoded],
        dtype=torch.long
    )

    output = model.generate(
        input_ids,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        top_k=top_k
    )

    return tokenizer.decode(
        output[0].tolist()
    )


if __name__ == "__main__":
    print("===== VEYRA GENERATION =====")
    print(generate(
        "Veyra",
        max_new_tokens=50,
        temperature=0.8,
        top_k=10
    ))
