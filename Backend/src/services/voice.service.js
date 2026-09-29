import { assertLanguage } from "./languages.js";

export function createVoiceService({ stt, chat, tts }) {
  return {
    async process({ audio, language, outputVoice = false }) {
      assertLanguage(language);
      if (!audio || !audio.buffer) { const error = new Error("Audio file is required"); error.statusCode = 400; throw error; }
      if (audio.buffer.length > 5 * 1024 * 1024) { const error = new Error("Audio file exceeds the 5 MB limit"); error.statusCode = 413; throw error; }
      if (!audio.mimeType?.startsWith("audio/")) { const error = new Error("Unsupported audio format"); error.statusCode = 415; throw error; }
      let transcript;
      try { transcript = await stt.transcribe({ audio, language }); } catch (error) { error.statusCode ||= 502; throw error; }
      if (!transcript.text?.trim()) { const error = new Error("Speech could not be transcribed"); error.statusCode = 422; throw error; }
      const answer = await chat.answer({ message: transcript.text, language });
      if (outputVoice && answer.answer) answer.audio = await tts.synthesize({ text: answer.answer, language });
      return { transcript: transcript.text, language, ...answer };
    },
  };
}
