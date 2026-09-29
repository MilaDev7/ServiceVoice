import Joi from "joi";

const language = Joi.string().valid("en", "am", "om", "ti").default("en");

export const serviceListSchema = Joi.object({
  q: Joi.string().trim().max(200).allow("").default(""),
  language,
});

export const serviceParamsSchema = Joi.object({
  slug: Joi.string().trim().min(1).max(120).required(),
});

export const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).max(10000).required(),
  language: language.required(),
});

export const voiceSchema = Joi.object({
  audioBase64: Joi.string().base64().allow("").required(),
  mimeType: Joi.string().trim().required(),
  transcript: Joi.string().allow(""),
  language: language.required(),
  outputVoice: Joi.boolean().default(false),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().trim().min(1).required(),
});
