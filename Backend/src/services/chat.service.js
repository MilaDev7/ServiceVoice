import { assertLanguage } from "./languages.js";

export function createChatService({ rag, llm }) {
  return {
    async answer({ message, language }) {
      if (typeof message !== "string" || !message.trim()) { const error = new Error("Message is required"); error.statusCode = 400; throw error; }
      if (message.length > 10000) { const error = new Error("Message is too long"); error.statusCode = 413; throw error; }
      assertLanguage(language);
      const context = await rag.retrieve({ query: message, language });
      if (context.status === "unknown" || context.status === "insufficient-context") return { status: "insufficient-context", answer: "I could not find enough verified information for that question.", sources: [] };
      if (context.status === "ambiguous") return { status: "ambiguous", answer: "Please specify which service you mean.", services: context.services, sources: [] };
      if (context.status === "insufficient-context") return { status: "insufficient-context", answer: "I do not have enough verified information to answer that.", sources: context.sources };
      const result = await llm.generate({ question: message, language, context });
      return { status: "grounded", answer: result.text, services: context.services, requirements: context.requirements, sources: context.sources };
    },
  };
}
