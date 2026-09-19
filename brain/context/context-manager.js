export class ContextManager {
  constructor(maxMessages = 20) {
    this.maxMessages = maxMessages;
  }

  build(messages = []) {
    if (!Array.isArray(messages)) {
      throw new Error("Messages must be an array");
    }

    const cleaned = messages
      .filter(message => message && typeof message.content === "string")
      .map(message => ({
        role: message.role || "user",
        content: message.content.trim()
      }))
      .filter(message => message.content.length > 0);

    return cleaned.slice(-this.maxMessages);
  }

  lastUserMessage(messages) {
    return [...messages]
      .reverse()
      .find(message => message.role === "user") || null;
  }
}
