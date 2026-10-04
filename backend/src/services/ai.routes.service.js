import {
  generateAddisAnswer
} from "./addis-ai.service.js";

import {
  generateOpenAIAnswer
} from "./open-ai.service.js";

export async function generateAnswer({
  question,
  language,
  context,
  history = []
}) {
  if (!language) {
    throw new Error(
      "Language is required for AI generation."
    );
  }

  switch (language) {
    case "am":
    case "om":
      return generateAddisAnswer({
        question,
        language,
        context,
        history
      });

    case "en":
    case "ti":
      return generateOpenAIAnswer({
        question,
        language,
        context,
        history
      });

    default:
      throw new Error(
        `Unsupported language: ${language}`
      );
  }
}