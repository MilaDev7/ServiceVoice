import AddisAI, {
  fileFromPath
} from "addisai";

import { env } from "../config/env.js";

import {
  transcribeWithOpenAI
} from "./open-ai.service.js";

const addis = new AddisAI({
  apiKey: env.ADDIS_API_KEY
});

export async function transcribeAudio(
  filePath,
  language
) {
  if (language === "en" ||
      language === "ti") {
    return transcribeWithOpenAI(
      filePath,
      language
    );
  }

  if (language !== "am" &&
      language !== "om") {
    throw new Error(
      `Unsupported speech language: ${language}`
    );
  }

  console.log(
    `[STT] Addis AI selected for language: ${language}`
  );

  const result =
    await addis.speech.transcribe({
      audio:
        await fileFromPath(filePath),

      language
    });

  if (!result?.text) {
    throw new Error(
      "Addis speech-to-text returned no text."
    );
  }

  return {
    text:
      result.text.trim(),

    confidence:
      result.confidence ?? null
  };
}