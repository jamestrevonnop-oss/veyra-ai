from pathlib import Path

import torch

from model.config.config import (
    ModelConfig,
    TrainingConfig
)

from model.tokenizer.basic_tokenizer import (
    BasicTokenizer
)

from model.transformer.veyra_model import (
    VeyraModel
)

from model.training.trainer import (
    Trainer
)


DATA_PATH = Path(
    "data/raw/training.txt"
)

TOKENIZER_PATH = Path(
    "model/checkpoints/tokenizer.json"
)


def load_text():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Training data not found: {DATA_PATH}"
        )

    text = DATA_PATH.read_text(
        encoding="utf-8"
    )

    if len(text.strip()) < 100:
        raise ValueError(
            "Training data is too small."
        )

    return text


def main():
    torch.manual_seed(42)

    text = load_text()

    tokenizer = BasicTokenizer([text])

    TOKENIZER_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    tokenizer.save(
        TOKENIZER_PATH
    )

    model_config = ModelConfig(
        vocab_size=tokenizer.vocab_size,
        max_seq_len=64,
        d_model=256,
        n_heads=8,
        n_layers=6,
        d_ff=1024,
        dropout=0.1
    )

    training_config = TrainingConfig(
        epochs=10,
        batch_size=8,
        learning_rate=3e-4,
        weight_decay=0.01,
        validation_split=0.1,
        checkpoint_every=1,
        seed=42
    )

    model = VeyraModel(
        model_config
    )

    parameter_count = sum(
        parameter.numel()
        for parameter in model.parameters()
    )

    print()
    print("===== VEYRA TRAINING =====")
    print(f"Vocabulary: {tokenizer.vocab_size}")
    print(f"Parameters: {parameter_count:,}")
    print(f"Sequence length: {model_config.max_seq_len}")
    print(f"Layers: {model_config.n_layers}")
    print(f"Embedding size: {model_config.d_model}")
    print()

    trainer = Trainer(
        model=model,
        tokenizer=tokenizer,
        text=text,
        training_config=training_config,
        model_config=model_config
    )

    trainer.train()

    print()
    print("Training complete.")
    print(
        f"Tokenizer: {TOKENIZER_PATH}"
    )
    print(
        "Best model: "
        "model/checkpoints/best.pt"
    )


if __name__ == "__main__":
    main()
