# Veyra AI

Veyra is an independent AI project being built from scratch.

## Architecture

Veyra is split into several layers:

- `brain/` - intelligence orchestration
- `model/` - Veyra's neural model
- `api/` - developer API
- `data/` - training data
- `tests/` - automated tests

## Model

The first prototype is a small causal transformer.

It includes:

- tokenizer
- token embeddings
- positional embeddings
- causal self-attention
- feed-forward layers
- transformer blocks
- language-model head
- training loop
- checkpointing
- text generation

The model does not call an external AI provider.

## Status

Veyra Tiny v0.1 is an experimental model intended to validate the architecture before scaling it.
