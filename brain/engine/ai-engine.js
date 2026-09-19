import { createConversation } from "../context/messages.js";
import { getModel } from "../../models/registry/index.js";
import { VeyraBrain } from "./brain.js";

export class AIEngine {
  constructor({ provider }) {
    const resolvedProvider = provider || "local";

    if (resolvedProvider === "mock") {
      this.model = getModel("mock");
    } else {
      this.model = getModel("local");
    }

    this.brain = new VeyraBrain(this.model);
  }

  async generate(messages, conversationId = "default") {
    const conversation = createConversation(messages);
    return this.brain.think(conversation, conversationId);
  }

  async *stream(messages, conversationId = "default") {
    const conversation = createConversation(messages);

    const result = await this.brain.think(conversation, conversationId);

    for (const word of result.content.split(" ")) {
      yield word + " ";
    }
  }
}
