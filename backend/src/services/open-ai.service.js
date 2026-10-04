import OpenAI from "openai";
import fs from "fs";
import path from "path";

import { env } from "../config/env.js";
import {
  buildSystemInstruction
} from "../utils/ai-prompt.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

const LANGUAGE_NAMES = {
  en: "English",
  ti: "Tigrinya"
};

function getLanguageName(language) {
  const name =
    LANGUAGE_NAMES[language];

  if (!name) {
    throw new Error(
      `OpenAI does not handle language: ${language}`
    );
  }

  return name;
}

export async function generateOpenAIAnswer({
  question,
  language,
  context,
  history = []
}) {
  const languageName =
    getLanguageName(language);

  const instructions =
    buildSystemInstruction(language);

  const input = [
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

REQUIRED RESPONSE LANGUAGE:

${languageName}

Answer entirely in ${languageName}.

Use only the supplied database context for service-specific facts.

Translate database information when necessary.

Do not invent missing information.
`
    }
  ];

  console.log(
    `[AI] OpenAI selected for language: ${language}`
  );

  const response =
    await openai.responses.create({
      model: env.OPENAI_TEXT_MODEL,

      instructions,

      input,

      max_output_tokens: 700
    });

  const answer =
    response.output_text?.trim();

  if (!answer) {
    throw new Error(
      "OpenAI returned an empty response."
    );
  }

  return answer;
}

export async function transcribeWithOpenAI(
  filePath,
  language
) {
  if (!["en", "ti"].includes(language)) {
    throw new Error(
      `OpenAI STT does not handle language: ${language}`
    );
  }

  console.log(
    `[STT] OpenAI selected for language: ${language}`
  );

  const audioFile =
    fs.createReadStream(filePath);

  const transcription =
    await openai.audio.transcriptions.create({
      file: audioFile,

      model: env.OPENAI_STT_MODEL,

      language
    });

  const text =
    transcription.text?.trim();

  if (!text) {
    throw new Error(
      "OpenAI speech-to-text returned no text."
    );
  }

  return {
    text,

    confidence:
      transcription.confidence ??
      null
  };
}

export async function generateSpeechWithOpenAI(
  text,
  language
) {
  if (!["en", "ti"].includes(language)) {
    throw new Error(
      `OpenAI TTS does not handle language: ${language}`
    );
  }

  console.log(
    `[TTS] OpenAI selected for language: ${language}`
  );

  const speech =
    await openai.audio.speech.create({
      model: env.OPENAI_TTS_MODEL,

      voice: "alloy",

      input: text,

      response_format: "mp3"
    });

  const buffer =
    Buffer.from(
      await speech.arrayBuffer()
    );

  const audioDirectory =
    path.join(
      process.cwd(),
      "public",
      "audio"
    );

  await fs.promises.mkdir(
    audioDirectory,
    {
      recursive: true
    }
  );

  const fileName =
    `servicevoice-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.mp3`;

  const filePath =
    path.join(
      audioDirectory,
      fileName
    );

  await fs.promises.writeFile(
    filePath,
    buffer
  );

  return {
    id: fileName,

    audioUrl:
      `/audio/${fileName}`,

    contentType:
      "audio/mpeg"
  };
}