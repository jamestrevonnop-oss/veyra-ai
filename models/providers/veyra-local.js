import { ModelAdapter } from "../adapters/model-adapter.js";

export class VeyraLocalModel extends ModelAdapter {
  constructor() {
    super("veyra-local");

    this.url =
      process.env.VEYRA_MODEL_URL ||
      "http://127.0.0.1:8000";
  }

  async generate(messages) {
    const response = await fetch(
      `${this.url}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages,
          max_new_tokens: 100,
          temperature: 0.7,
          top_k: 20
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        `Veyra model error ${response.status}: ${text}`
      );
    }

    const data = await response.json();

    return {
      id: `veyra-${Date.now()}`,
      model: "veyra-dev",
      content: data.content || ""
    };
  }

  async *stream(messages) {
    const result = await this.generate(messages);

    const words = result.content.split(/\s+/);

    for (const word of words) {
      yield `${word} `;
    }
  }
}
