export function createMessage(role, content) {
  if (!role) {
    throw new Error("Message role is required");
  }

  if (typeof content !== "string") {
    throw new Error("Message content must be a string");
  }

  return {
    role,
    content
  };
}

export function createConversation(messages = []) {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  return messages.map((message) =>
    createMessage(message.role, message.content)
  );
}
