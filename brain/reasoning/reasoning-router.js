export class ReasoningRouter {
  classify(message) {
    const text = String(message || "").trim();
    const lower = text.toLowerCase();

    if (!text) {
      return "general";
    }

    const memoryPatterns = [
      /\bmy name is\s+[a-z][a-z0-9_-]{1,30}\b/i,
      /\bi am\s+[a-z][a-z0-9_-]{1,30}\b/i,
      /\bi'm\s+[a-z][a-z0-9_-]{1,30}\b/i,
      /\b(remember|memorize|keep in mind|don't forget|do not forget)\b/i,
      /\b(what('?s| is) my name|what is my name|who am i|what do you remember about me|what did i tell you|do you remember me)\b/i
    ];

    if (memoryPatterns.some(pattern => pattern.test(text))) {
      return "memory";
    }

    if (
      /^\s*[\d\s()+\-*/%.]+\s*$/.test(text) ||
      /\b(calculate|calculator|compute|work out)\b/i.test(lower) ||
      /^\s*what is\s+[\d\s()+\-*/%.]+\??\s*$/i.test(text)
    ) {
      return "calculation";
    }

    if (
      /\b(plan|planning|roadmap|schedule|steps to|checklist|timeline|itinerary)\b/i.test(lower) ||
      /\bhow should i plan\b/i.test(lower)
    ) {
      return "planning";
    }

    if (
      /\b(summarize|summary|brief|tl;dr|recap|condense)\b/i.test(lower) ||
      /\b(in three bullet points|in short|quick summary)\b/i.test(lower)
    ) {
      return "summarization";
    }

    if (
      /\b(code|coding|program|programming|javascript|typescript|python|html|css|node\.?js|react|bug|debug|error|function|api|class|method)\b/i.test(lower)
    ) {
      return "coding";
    }

    if (
      /\b(explain|define|what is|who is|how does|how do|why does|why do|tell me about|describe|meaning of|difference between|compare)\b/i.test(lower) ||
      /\b(physics|chemistry|biology|math|mathematics|history|geography|science|space|computer science|quantum)\b/i.test(lower)
    ) {
      return "knowledge";
    }

    if (
      /\b(retrieve|search the docs|look up|find information|knowledge base|source)\b/i.test(lower)
    ) {
      return "retrieval";
    }

    if (
      /\b(tool|use a calculator|use the calculator|run a computation|lookup)\b/i.test(lower)
    ) {
      return "tool";
    }

    if (
      /\b(what did i ask|what have we discussed|memory|remembering|context)\b/i.test(lower)
    ) {
      return "memory";
    }

    if (
      /\b(explanation|why|how|what is the difference|compare|break it down)\b/i.test(lower)
    ) {
      return "explanation";
    }

    return "general";
  }
}
