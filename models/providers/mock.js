import { ModelAdapter } from "../adapters/model-adapter.js";

export class MockModel extends ModelAdapter {
  constructor() {
    super("mock");
  }

  async generate(messages) {
    const lastMessage = messages.at(-1);

    return {
      id: `mock-${Date.now()}`,
      model: "veyra-dev",
      content: `Veyra received: ${lastMessage?.content || ""}`
    };
  }

  async *stream(messages) {
    const response = await this.generate(messages);

    for (const word of response.content.split(" ")) {
      yield word + " ";
    }
  }
}
