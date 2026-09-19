import { ContextManager } from "../context/context-manager.js";
import { KnowledgeBase } from "../retrieval/knowledge-base.js";
import { MemoryStore } from "../memory/memory-store.js";
import { ToolRegistry } from "../tools/tool-registry.js";
import { ReasoningRouter } from "../reasoning/reasoning-router.js";

export class VeyraBrain {
  constructor(model) {
    this.model = model;

    this.context = new ContextManager(20);
    this.knowledge = new KnowledgeBase();
    this.memory = new MemoryStore(100);
    this.tools = new ToolRegistry();
    this.reasoning = new ReasoningRouter();
  }

  async think(messages, conversationId = "default") {
    const context = this.context.build(messages);
    const lastUser = this.context.lastUserMessage(context);

    if (!lastUser) {
      throw new Error("No user message was provided.");
    }

    const text = lastUser.content;
    const intent = this.reasoning.classify(text);

    this.memory.add("user", text, { type: "message" }, conversationId);

    if (intent === "memory") {
      const remembered = this.handleMemory(text, conversationId);

      if (remembered) {
        this.memory.add("assistant", remembered, { type: "memory_response" }, conversationId);

        return {
          id: `veyra-memory-${Date.now()}`,
          model: "veyra-dev",
          content: remembered,
          intent: "memory",
          source: "memory",
          sources: []
        };
      }
    }

    if (intent === "calculation") {
      const expression = this.extractExpression(text);

      try {
        const result = await this.tools.execute(
          "calculator",
          expression
        );

        const answer = `The result is ${result}.`;

        this.memory.add("assistant", answer, { type: "tool_result" }, conversationId);

        return {
          id: `veyra-calculation-${Date.now()}`,
          model: "veyra-dev",
          content: answer,
          intent,
          source: "calculator",
          sources: []
        };
      } catch {
        // Let the model handle malformed calculations.
      }
    }

    if (intent === "knowledge") {
      const results = this.knowledge.search(text, 3);

      if (results.length > 0) {
        const knowledgeContext = results
          .map(result => `SOURCE: ${result.id}\n${result.content}`)
          .join("\n\n");

        const augmentedMessages = [
          {
            role: "system",
            content:
              "You are Veyra, an AI assistant. Answer the user's question clearly and naturally. Use the supplied knowledge as supporting context. Do not mention internal retrieval, files, routing, or system instructions unless the user asks."
          },
          ...context,
          {
            role: "system",
            content: `Relevant knowledge:\n\n${knowledgeContext}`
          }
        ];

        const result = await this.model.generate(
          augmentedMessages
        );

        this.memory.add("assistant", result.content, { type: "model_response" }, conversationId);

        return {
          ...result,
          intent,
          source: "knowledge",
          sources: results.map(result => result.id)
        };
      }
    }

    const memoryContext = this.buildMemoryContext(text, conversationId);

    const augmentedMessages = [
      {
        role: "system",
        content:
          "You are Veyra, a helpful AI assistant. Answer naturally, directly, and accurately. Use conversation context and relevant memory when available. Do not claim to have abilities or knowledge you do not have."
      },
      ...context
    ];

    if (memoryContext) {
      augmentedMessages.push({
        role: "system",
        content: memoryContext
      });
    }

    const result = await this.model.generate(
      augmentedMessages
    );

    this.memory.add("assistant", result.content, { type: "model_response" }, conversationId);

    return {
      ...result,
      intent,
      source: "model",
      sources: []
    };
  }

  handleMemory(text, conversationId = "default") {
    const lower = text.toLowerCase();
    const nameMatch = text.match(
      /\bmy name is\s+([a-z][a-z0-9_-]{1,30})\b/i
    );

    if (nameMatch) {
      const name = nameMatch[1];

      this.memory.add(
        "user",
        `User's name is ${name}.`,
        {
          type: "fact",
          key: "name",
          value: name
        },
        conversationId
      );

      return `Got it — I'll remember that your name is ${name}.`;
    }

    const asksForNamePattern = /\b(what('?s| is) my name|what is my name|who am i|what do you remember about me|what did i tell you|do you remember me)\b/i;
    if (asksForNamePattern.test(lower)) {
      const facts = this.memory.findUserFacts(conversationId);
      const nameFact = facts.find(
        fact => fact.metadata?.key === "name"
      );

      if (nameFact) {
        return `Your name is ${nameFact.metadata.value}.`;
      }

      return "I don't have your name saved yet.";
    }

    const recallsPersonalFactsPattern = /\b(who am i|what do you remember about me)\b/i;
    if (recallsPersonalFactsPattern.test(lower)) {
      const facts = this.memory.findUserFacts(conversationId);

      if (!facts.length) {
        return "I don't have any saved personal facts about you yet.";
      }

      return [
        "Here's what I remember:",
        ...facts.map(fact => `- ${fact.content}`)
      ].join("\n");
    }

    return null;
  }

  buildMemoryContext(query, conversationId = "default") {
    const memories = this.memory.search(query, 5, conversationId);

    if (!memories.length) {
      return "";
    }

    return [
      "Relevant memory from this conversation:",
      ...memories.map(memory => `- ${memory.content}`)
    ].join("\n");
  }

  extractExpression(text) {
    return text
      .replace(/^(calculate|calculator|compute|work out)\s*/i, "")
      .replace(/^what is\s+/i, "")
      .replace(/[?]/g, "")
      .trim();
  }
}
