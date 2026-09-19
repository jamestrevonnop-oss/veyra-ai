import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeRoot = path.join(__dirname, "../../data/knowledge");

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreDocument(queryTokens, document) {
  const documentTokens = tokenize(document.content);
  const counts = new Map();

  for (const token of documentTokens) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  let score = 0;

  for (const token of queryTokens) {
    if (counts.has(token)) {
      score += 1 + Math.min(counts.get(token), 5) * 0.15;
    }
  }

  return score;
}

export class KnowledgeBase {
  constructor() {
    this.documents = [];
    this.load();
  }

  load() {
    this.documents = [];

    if (!fs.existsSync(knowledgeRoot)) {
      return;
    }

    const files = fs
      .readdirSync(knowledgeRoot)
      .filter(file => file.endsWith(".md") || file.endsWith(".txt"));

    for (const file of files) {
      const fullPath = path.join(knowledgeRoot, file);
      const content = fs.readFileSync(fullPath, "utf8");

      this.documents.push({
        id: file,
        title: file.replace(/\.(md|txt)$/i, ""),
        content
      });
    }
  }

  search(query, limit = 3) {
    const queryTokens = tokenize(query);

    if (!queryTokens.length) {
      return [];
    }

    return this.documents
      .map(document => ({
        ...document,
        score: scoreDocument(queryTokens, document)
      }))
      .filter(document => document.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
