import crypto from "node:crypto";
import env from "../../config/env.js";

export class LlmProvider {
  async generate() { throw new Error("LLM provider is not configured"); }
}

export class SttProvider {
  async transcribe() { throw new Error("STT provider is not configured"); }
}

export class TtsProvider {
  async synthesize() { throw new Error("TTS provider is not configured"); }
}

export function createProviderSet(overrides = {}) {
  const configuredLlm = env.LLM_API_URL && env.LLM_API_KEY ? createHttpProvider({ url: env.LLM_API_URL, apiKey: env.LLM_API_KEY, operation: "LLM" }) : null;
  const configuredStt = env.STT_API_URL && env.STT_API_KEY ? createHttpProvider({ url: env.STT_API_URL, apiKey: env.STT_API_KEY, operation: "STT" }) : null;
  const configuredTts = env.TTS_API_URL && env.TTS_API_KEY ? createHttpProvider({ url: env.TTS_API_URL, apiKey: env.TTS_API_KEY, operation: "TTS" }) : null;
  return {
    llm: overrides.llm || (configuredLlm ? { generate: configuredLlm.call } : {
      async generate({ question, language, context }) {
        const answer = context.requirements.length
          ? context.requirements.map((item) => item.name).join(", ")
          : "No verified requirements are available.";
        return { text: language === "en" ? `Based on the official record, the required documents are: ${answer}.` : answer, question };
      },
    }) ,
    stt: overrides.stt || (configuredStt ? { transcribe: configuredStt.call } : {
      async transcribe({ audio, language }) {
        if (!audio) throw Object.assign(new Error("Audio is required"), { statusCode: 400 });
        return { text: audio.transcript || "", language };
      },
    }),
    tts: overrides.tts || (configuredTts ? { synthesize: configuredTts.call } : {
      async synthesize({ text, language }) { return { audio: Buffer.from(`${language}:${text}`).toString("base64"), language }; },
    }),
  };
}

export function createHttpProvider({ url, apiKey, operation }) {
  return {
    async call(payload) {
      if (!url || !apiKey) throw Object.assign(new Error(`${operation} provider is not configured`), { statusCode: 503 });
      const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload) });
      if (!response.ok) throw Object.assign(new Error(`${operation} provider failed`), { statusCode: 502 });
      return response.json();
    },
  };
}

export function generateId() { return crypto.randomUUID(); }
