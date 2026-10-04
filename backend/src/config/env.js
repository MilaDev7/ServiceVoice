import "dotenv/config";
import Joi from "joi";

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),

  PORT: Joi.number()
    .port()
    .default(5000),

  DATABASE_URL: Joi.string()
    .required(),

  FRONTEND_URL: Joi.string()
    .required(),

  ADDIS_API_KEY: Joi.string()
    .required(),

  ADDIS_TTS_AM_VOICE: Joi.string()
    .default("am-hamen"),

  ADDIS_TTS_OM_VOICE: Joi.string()
    .allow("")
    .default(""),

  OPENAI_API_KEY: Joi.string()
    .required(),

  OPENAI_TEXT_MODEL: Joi.string()
    .default("gpt-5.6-luna"),

  OPENAI_STT_MODEL: Joi.string()
    .default("gpt-4o-mini-transcribe"),

  OPENAI_TTS_MODEL: Joi.string()
    .default("gpt-4o-mini-tts"),
  GEMINI_API_KEY: Joi.string()
    .required(),

  GEMINI_AUDIO_MODEL: Joi.string()
    .default("gemini-2.5-flash"),

  GEMINI_TTS_MODEL: Joi.string()
    .default("gemini-2.5-flash-preview-tts"),

  GEMINI_TTS_VOICE: Joi.string()
    .default("Kore"),


  MAX_AUDIO_SIZE_MB: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .default(10)
}).unknown();

const { error, value } =
  schema.validate(process.env);

if (error) {
  throw new Error(
    `Environment validation failed: ${error.message}`
  );
}

export const env = value;