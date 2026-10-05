import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

import { env } from "../config/env.js";

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

/*

| Language configuration

*/

const LANGUAGE_NAMES = {
  en: "English",
  ti: "Tigrinya"
};

/*

| Detect MIME type

*/

function getMimeType(filePath) {
  const extension =
    filePath
      .split(".")
      .pop()
      ?.toLowerCase();

  const mimeTypes = {
    webm: "audio/webm",
    mp3: "audio/mp3",
    wav: "audio/wav",
    m4a: "audio/m4a",
    mp4: "audio/mp4",
    ogg: "audio/ogg",
    opus: "audio/opus",
    flac: "audio/flac",
    aac: "audio/aac"
  };

  return (
    mimeTypes[extension] ||
    "audio/webm"
  );
}

/*

| Speech to text

*/

export async function transcribeWithGemini(
  filePath,
  language
) {
  if (!["en", "ti"].includes(language)) {
    throw new Error(
      `Gemini transcription does not handle language: ${language}`
    );
  }

  const audioBuffer =
    await fs.readFile(filePath);

  const base64Audio =
    audioBuffer.toString("base64");

  const mimeType =
    getMimeType(filePath);

  const languageName =
    LANGUAGE_NAMES[language];

  const prompt = `
You are a professional speech transcription system.

Transcribe the attached audio exactly as spoken.

Target language:
${languageName}

Rules:

1. Transcribe only the user's speech.
2. Do not translate the speech.
3. Do not summarize the speech.
4. Do not add explanations.
5. Do not correct the user's meaning.
6. Preserve the original language.
7. Return only the transcription.
8. Do not add quotation marks.
9. Do not add markdown.
10. Do not add labels such as "Transcript:".

The expected spoken language is ${languageName}.
`;

  const response =
    await gemini.models.generateContent({
      model: env.GEMINI_AUDIO_MODEL,

      contents: [
        {
          role: "user",

          parts: [
            {
              text: prompt
            },

            {
              inlineData: {
                mimeType,
                data: base64Audio
              }
            }
          ]
        }
      ]
    });

  const text =
    response.text?.trim();

  if (!text) {
    throw new Error(
      "Gemini speech-to-text returned no text."
    );
  }

  return {
    text,
    confidence: null
  };
}

/*

| Text to speech

*/

export async function generateSpeechWithGemini(
  text,
  language
) {
  if (!["en", "ti"].includes(language)) {
    throw new Error(
      `Gemini TTS does not handle language: ${language}`
    );
  }

  if (!text?.trim()) {
    throw new Error(
      "Cannot generate speech from empty text."
    );
  }

  const languageName =
    LANGUAGE_NAMES[language];

  const prompt = `
Read the following ServiceVoice response naturally.

Language:
${languageName}

Important:

- Speak only the supplied text.
- Do not translate it.
- Do not add words.
- Do not summarize it.
- Do not explain it.
- Do not say that you are an AI.
- Use a clear and natural ${languageName} pronunciation.
- Keep the wording exactly as supplied.

TEXT:

${text}
`;

  const response =
    await gemini.models.generateContent({
      model: env.GEMINI_TTS_MODEL,

      contents: [
        {
          role: "user",

          parts: [
            {
              text: prompt
            }
          ]
        }
      ],

      config: {
        responseModalities: ["AUDIO"],

        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName:
                env.GEMINI_TTS_VOICE
            }
          }
        }
      }
    });

  const parts =
    response.candidates?.[0]?.content?.parts || [];

  const audioPart =
    parts.find(
      (part) =>
        part.inlineData?.data
    );

  if (!audioPart) {
    throw new Error(
      "Gemini text-to-speech returned no audio."
    );
  }

  const audioBuffer =
    Buffer.from(
      audioPart.inlineData.data,
      "base64"
    );

  return {
    buffer: audioBuffer,
    contentType:
      audioPart.inlineData.mimeType ||
      "audio/wav"
  };
}