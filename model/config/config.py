from dataclasses import dataclass


@dataclass
class ModelConfig:
    vocab_size: int

    max_seq_len: int = 128

    d_model: int = 256
    n_heads: int = 8
    n_layers: int = 6
    d_ff: int = 1024

    dropout: float = 0.1


@dataclass
class TrainingConfig:
    epochs: int = 10

    batch_size: int = 8

    learning_rate: float = 3e-4

    weight_decay: float = 0.01

    validation_split: float = 0.1

    checkpoint_every: int = 1

    seed: int = 42
