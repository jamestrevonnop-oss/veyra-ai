from pathlib import Path

import torch


def save_checkpoint(
    path,
    model,
    optimizer,
    epoch,
    train_loss,
    validation_loss,
    config
):
    path = Path(path)

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    torch.save(
        {
            "epoch": epoch,
            "model_state": model.state_dict(),
            "optimizer_state": optimizer.state_dict(),
            "train_loss": train_loss,
            "validation_loss": validation_loss,
            "config": vars(config)
        },
        path
    )

    print(f"Checkpoint saved: {path}")


def load_checkpoint(
    path,
    model,
    optimizer=None
):
    checkpoint = torch.load(
        path,
        map_location="cpu",
        weights_only=False
    )

    model.load_state_dict(
        checkpoint["model_state"]
    )

    if optimizer is not None:
        optimizer.load_state_dict(
            checkpoint["optimizer_state"]
        )

    return checkpoint
