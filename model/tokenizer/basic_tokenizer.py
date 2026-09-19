import re


class BasicTokenizer:
    """
    Very small tokenizer for the first Veyra prototype.

    This is intentionally simple.
    A more advanced subword tokenizer will replace this later.
    """

    SPECIAL_TOKENS = [
        "<pad>",
        "<unk>",
        "<bos>",
        "<eos>",
    ]

    def __init__(self, texts=None):
        self.token_to_id = {
            token: index
            for index, token in enumerate(self.SPECIAL_TOKENS)
        }

        self.id_to_token = {
            index: token
            for index, token in enumerate(self.SPECIAL_TOKENS)
        }

        if texts:
            self.build_vocabulary(texts)

    def split(self, text):
        return re.findall(r"\w+|[^\w\s]", text.lower(), re.UNICODE)

    def build_vocabulary(self, texts):
        tokens = set()

        for text in texts:
            tokens.update(self.split(text))

        for token in sorted(tokens):
            self.add_token(token)

    def add_token(self, token):
        if token not in self.token_to_id:
            index = len(self.token_to_id)
            self.token_to_id[token] = index
            self.id_to_token[index] = token

    def encode(self, text, add_special_tokens=True):
        tokens = self.split(text)

        ids = []

        if add_special_tokens:
            ids.append(self.token_to_id["<bos>"])

        for token in tokens:
            ids.append(
                self.token_to_id.get(
                    token,
                    self.token_to_id["<unk>"]
                )
            )

        if add_special_tokens:
            ids.append(self.token_to_id["<eos>"])

        return ids

    def decode(self, ids):
        tokens = []

        for token_id in ids:
            token = self.id_to_token.get(
                int(token_id),
                "<unk>"
            )

            if token in self.SPECIAL_TOKENS:
                continue

            tokens.append(token)

        text = " ".join(tokens)

        text = re.sub(r"\s+([,.!?;:])", r"\1", text)

        return text

    @property
    def vocab_size(self):
        return len(self.token_to_id)

    def save(self, path):
        import json

        with open(path, "w", encoding="utf-8") as file:
            json.dump(
                {
                    "token_to_id": self.token_to_id,
                    "id_to_token": self.id_to_token
                },
                file,
                indent=2
            )

    @classmethod
    def load(cls, path):
        import json

        tokenizer = cls()

        with open(path, "r", encoding="utf-8") as file:
            data = json.load(file)

        tokenizer.token_to_id = {
            key: int(value)
            for key, value in data["token_to_id"].items()
        }

        tokenizer.id_to_token = {
            int(key): value
            for key, value in data["id_to_token"].items()
        }

        return tokenizer
