import torch
from torch.utils.data import Dataset


class LanguageModelDataset(Dataset):
    def __init__(
        self,
        token_ids,
        block_size
    ):
        self.token_ids = token_ids
        self.block_size = block_size

        self.length = (
            len(token_ids) - block_size
        )

        if self.length <= 0:
            raise ValueError(
                "Dataset is too small for the selected block size."
            )

    def __len__(self):
        return self.length

    def __getitem__(self, index):
        start = index

        inputs = self.token_ids[
            start:start + self.block_size
        ]

        targets = self.token_ids[
            start + 1:start + self.block_size + 1
        ]

        return (
            torch.tensor(
                inputs,
                dtype=torch.long
            ),
            torch.tensor(
                targets,
                dtype=torch.long
            )
        )


def split_tokens(
    token_ids,
    validation_split=0.1
):
    split_index = int(
        len(token_ids) * (1 - validation_split)
    )

    train_tokens = token_ids[:split_index]
    validation_tokens = token_ids[split_index:]

    return train_tokens, validation_tokens
