import math
from pathlib import Path

import torch
from torch.utils.data import DataLoader

from model.config.config import ModelConfig
from model.data.dataset import (
    LanguageModelDataset,
    split_tokens
)
from model.tokenizer.basic_tokenizer import (
    BasicTokenizer
)
from model.transformer.veyra_model import (
    VeyraModel
)


TOKENIZER_PATH = Path(
    "model/checkpoints/tokenizer.json"
)

MODEL_PATH = Path(
    "model/checkpoints/best.pt"
)

DATA_PATH = Path(
    "data/raw/training.txt"
)


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Checkpoint not found: {MODEL_PATH}"
        )

    checkpoint = torch.load(
        MODEL_PATH,
        map_location="cpu",
        weights_only=False
    )

    config = ModelConfig(
        **checkpoint["config"]
    )

    tokenizer = BasicTokenizer.load(
        TOKENIZER_PATH
    )

    if tokenizer.vocab_size != config.vocab_size:
        raise RuntimeError(
            "Tokenizer/model vocabulary mismatch: "
            f"tokenizer={tokenizer.vocab_size}, "
            f"model={config.vocab_size}"
        )

    model = VeyraModel(config)

    model.load_state_dict(
        checkpoint["model_state"]
    )

    model.eval()

    text = DATA_PATH.read_text(
        encoding="utf-8"
    )

    tokens = tokenizer.encode(
        text,
        add_special_tokens=False
    )

    _, validation_tokens = split_tokens(
        tokens,
        validation_split=0.1
    )

    dataset = LanguageModelDataset(
        validation_tokens,
        config.max_seq_len
    )

    loader = DataLoader(
        dataset,
        batch_size=8,
        shuffle=False
    )

    total_loss = 0.0
    batches = 0

    with torch.no_grad():
        for inputs, targets in loader:
            _, loss = model(
                inputs,
                targets
            )

            total_loss += loss.item()
            batches += 1

    loss = total_loss / max(batches, 1)

    print()
    print("===== VEYRA VALIDATION =====")
    print(f"Checkpoint epoch: {checkpoint['epoch']}")
    print(f"Validation loss: {loss:.4f}")
    print(
        f"Perplexity: "
        f"{math.exp(min(loss, 20)):.2f}"
    )
    print()


if __name__ == "__main__":
    main()
