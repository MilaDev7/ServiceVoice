import AddisAI from "addisai";
import crypto from "crypto";

import { env } from "../config/env.js";

import {
  generateSpeechWithOpenAI
} from "./open-ai.service.js";

const addis = new AddisAI({
  apiKey: env.ADDIS_API_KEY
});

export async function generateSpeech(
  text,
  language
) {
  if (
    language === "en" ||
    language === "ti"
  ) {
    return generateSpeechWithOpenAI(
      text,
      language
    );
  }

  if (
    language !== "am" &&
    language !== "om"
  ) {
    throw new Error(
      `Unsupported TTS language: ${language}`
    );
  }

  const voiceId =
    language === "om"
      ? env.ADDIS_TTS_OM_VOICE
      : env.ADDIS_TTS_AM_VOICE;

  if (!voiceId) {
    throw new Error(
      `No Addis TTS voice configured for ${language}`
    );
  }

  console.log(
    `[TTS] Addis AI selected for language: ${language}`
  );

  const clip =
    await addis.voice.generate({
      text,

      voiceId,

      language,

      outputFormat:
        "mp3_44100",

      clientRequestId:
        crypto.randomUUID()
    });

  if (!clip?.audioUrl) {
    throw new Error(
      "Addis text-to-speech returned no audio URL."
    );
  }

  return {
    id: clip.id,

    audioUrl:
      clip.audioUrl,

    usage:
      clip.usage ?? null
  };
}