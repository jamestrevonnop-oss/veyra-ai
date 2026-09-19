import math
from pathlib import Path

import torch
from torch.utils.data import DataLoader

from model.data.dataset import (
    LanguageModelDataset,
    split_tokens
)

from model.training.checkpoints import (
    save_checkpoint
)


class Trainer:
    def __init__(
        self,
        model,
        tokenizer,
        text,
        training_config,
        model_config,
        checkpoint_dir="model/checkpoints"
    ):
        self.model = model
        self.tokenizer = tokenizer
        self.training_config = training_config
        self.model_config = model_config

        self.device = torch.device(
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        self.model.to(self.device)

        token_ids = tokenizer.encode(
            text,
            add_special_tokens=False
        )

        train_tokens, validation_tokens = split_tokens(
            token_ids,
            training_config.validation_split
        )

        self.train_dataset = LanguageModelDataset(
            train_tokens,
            model_config.max_seq_len
        )

        self.validation_dataset = LanguageModelDataset(
            validation_tokens,
            model_config.max_seq_len
        )

        self.train_loader = DataLoader(
            self.train_dataset,
            batch_size=training_config.batch_size,
            shuffle=True
        )

        self.validation_loader = DataLoader(
            self.validation_dataset,
            batch_size=training_config.batch_size,
            shuffle=False
        )

        self.optimizer = torch.optim.AdamW(
            self.model.parameters(),
            lr=training_config.learning_rate,
            weight_decay=training_config.weight_decay
        )

        self.checkpoint_dir = Path(
            checkpoint_dir
        )

        self.checkpoint_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    def train_epoch(self):
        self.model.train()

        total_loss = 0.0
        batches = 0

        for inputs, targets in self.train_loader:
            inputs = inputs.to(self.device)
            targets = targets.to(self.device)

            self.optimizer.zero_grad()

            _, loss = self.model(
                inputs,
                targets
            )

            loss.backward()

            torch.nn.utils.clip_grad_norm_(
                self.model.parameters(),
                1.0
            )

            self.optimizer.step()

            total_loss += loss.item()
            batches += 1

        return total_loss / max(batches, 1)

    @torch.no_grad()
    def evaluate(self):
        self.model.eval()

        total_loss = 0.0
        batches = 0

        for inputs, targets in self.validation_loader:
            inputs = inputs.to(self.device)
            targets = targets.to(self.device)

            _, loss = self.model(
                inputs,
                targets
            )

            total_loss += loss.item()
            batches += 1

        return total_loss / max(batches, 1)

    def train(self):
        print(f"Device: {self.device}")

        best_validation_loss = math.inf

        for epoch in range(
            1,
            self.training_config.epochs + 1
        ):
            train_loss = self.train_epoch()

            validation_loss = self.evaluate()

            perplexity = math.exp(
                min(validation_loss, 20)
            )

            print(
                f"Epoch "
                f"{epoch:03d}/"
                f"{self.training_config.epochs:03d} "
                f"| train_loss={train_loss:.4f} "
                f"| val_loss={validation_loss:.4f} "
                f"| perplexity={perplexity:.2f}"
            )

            if validation_loss < best_validation_loss:
                best_validation_loss = validation_loss

                save_checkpoint(
                    self.checkpoint_dir / "best.pt",
                    self.model,
                    self.optimizer,
                    epoch,
                    train_loss,
                    validation_loss,
                    self.model_config
                )

            if (
                epoch %
                self.training_config.checkpoint_every
                == 0
            ):
                save_checkpoint(
                    self.checkpoint_dir /
                    f"epoch-{epoch:03d}.pt",
                    self.model,
                    self.optimizer,
                    epoch,
                    train_loss,
                    validation_loss,
                    self.model_config
                )
