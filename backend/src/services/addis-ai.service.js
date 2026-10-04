import AddisAI from "addisai";

import { env } from "../config/env.js";
import {
  buildSystemInstruction
} from "../utils/ai-prompt.js";

const addis = new AddisAI({
  apiKey: env.ADDIS_API_KEY
});

export async function generateAddisAnswer({
  question,
  language,
  context,
  history = []
}) {
  if (!["am", "om"].includes(language)) {
    throw new Error(
      `Addis AI does not handle this response language: ${language}`
    );
  }

  const system =
    buildSystemInstruction(language);

  const messages = [
    ...history.map((message) => ({
      role:
        message.role === "assistant"
          ? "assistant"
          : "user",

      content: message.content
    })),

    {
      role: "user",

      content: `
DATABASE CONTEXT:

${context}

USER QUESTION:

${question}

FINAL RESPONSE LANGUAGE:

${language}

Answer the user's question using the database context.

Translate database information into the required language when necessary.

Do not invent missing information.
`
    }
  ];

  console.log(
    `[AI] Addis AI selected for language: ${language}`
  );

  const response =
    await addis.chat.completions.create({
      system,
      messages,
      temperature: 0.1,
      max_tokens: 700
    });

  const answer =
    response?.choices?.[0]
      ?.message?.content;

  if (!answer) {
    throw new Error(
      "Addis AI returned an empty response."
    );
  }

  return answer.trim();
}