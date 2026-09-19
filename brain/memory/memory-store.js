export class MemoryStore {
  constructor(maxItems = 100, defaultConversationId = "default") {
    this.maxItems = maxItems;
    this.defaultConversationId = defaultConversationId;
    this.items = [];
  }

  normalizeConversationId(conversationId) {
    if (conversationId === undefined || conversationId === null || conversationId === "") {
      return this.defaultConversationId;
    }

    return String(conversationId);
  }

  add(role, content, metadata = {}, conversationId = this.defaultConversationId) {
    if (!content || typeof content !== "string") {
      return null;
    }

    const item = {
      id: `mem_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      role,
      content: content.trim(),
      metadata,
      conversationId: this.normalizeConversationId(conversationId),
      timestamp: Date.now()
    };

    this.items.push(item);

    if (this.items.length > this.maxItems) {
      this.items = this.items.slice(-this.maxItems);
    }

    return item;
  }

  getConversation(conversationId = this.defaultConversationId) {
    const target = this.normalizeConversationId(conversationId);

    return this.items.filter(item => item.conversationId === target);
  }

  recent(limit = 10, conversationId = this.defaultConversationId) {
    return this.getConversation(conversationId).slice(-limit);
  }

  search(query, limit = 5, conversationId = this.defaultConversationId) {
    if (!query || typeof query !== "string") {
      return [];
    }

    const target = this.normalizeConversationId(conversationId);
    const words = query
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.replace(/[^\p{L}\p{N}]/gu, ""))
      .filter(word => word.length > 2);

    if (!words.length) {
      return [];
    }

    return this.items
      .filter(item => item.conversationId === target)
      .map(item => {
        const content = item.content.toLowerCase();

        let score = 0;

        for (const word of words) {
          if (content.includes(word)) {
            score += 1;
          }
        }

        return {
          ...item,
          score
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  findUserFacts(conversationId = this.defaultConversationId) {
    return this.getConversation(conversationId).filter(
      item =>
        item.role === "user" &&
        item.metadata?.type === "fact"
    );
  }

  clear(conversationId) {
    if (conversationId === undefined) {
      this.items = [];
      return;
    }

    const target = this.normalizeConversationId(conversationId);
    this.items = this.items.filter(item => item.conversationId !== target);
  }

  get size() {
    return this.items.length;
  }
}
