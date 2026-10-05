import fs from "fs/promises";
import Joi from "joi";

import {
  transcribeAudio
} from "../services/speech.service.js";

import {
  generateSpeech
} from "../services/tts.service.js";

import {
  retrieveServiceContext
} from "../services/retrieval.service.js";

import {
  generateAnswer
} from "../services/ai.routes.service.js";

import {
  getOrCreateConversation,
  getConversationHistory,
  saveMessage
} from "../services/conversation.service.js";

const schema =
  Joi.object({
    language: Joi.string()
      .valid(
        "am",
        "om",
        "en",
        "ti"
      )
      .required(),

    conversationId:
      Joi.string()
        .uuid()
        .optional()
  });

export async function voiceChat(
  req,
  res,
  next
) {
  let uploadedFile = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Audio file is required."
      });
    }

    uploadedFile = req.file;

    const {
      error,
      value
    } =
      schema.validate({
        language:
          req.body.language,

        conversationId:
          req.body.conversationId
      });

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    const {
      language,
      conversationId
    } = value;

    const userId =
      req.user?.id || null;

    console.log(
      "VOICE USER:",
      userId || "GUEST"
    );

    console.log(
      "VOICE LANGUAGE:",
      language
    );

    const conversation =
      await getOrCreateConversation({
        conversationId,
        language,
        userId
      });

    const history =
      conversation.isPersistent
        ? await getConversationHistory(
            conversation.id,
            userId
          )
        : [];

    /*
     * Voice -> text
     */
    const transcription =
      await transcribeAudio(
        uploadedFile.path,
        language
      );

    const question =
      transcription.text;

    /*
     * Database retrieval
     */
    const {
      service,
      context
    } =
      await retrieveServiceContext(
        question,
        language
      );

    /*
     * AI
     *
     * The AI selection remains:
     *
     * am/om -> Addis AI
     * en/ti -> OpenAI
     */
    const answer =
      await generateAnswer({
        question,
        language,
        context,
        history
      });

    /*
     * Save ONLY for authenticated users.
     */
    if (conversation.isPersistent) {
      await saveMessage({
        conversationId:
          conversation.id,
        role: "user",
        content: question,
        userId
      });

      await saveMessage({
        conversationId:
          conversation.id,
        role: "assistant",
        content: answer,
        userId
      });
    }

    /*
     * Text -> speech
     */
    const speech =
      await generateSpeech(
        answer,
        language
      );

    return res.json({
      success: true,

      data: {
        conversationId:
          conversation.isPersistent
            ? conversation.id
            : null,

        persistent:
          conversation.isPersistent,

        transcription: {
          text: question,
          confidence:
            transcription.confidence
        },

        answer,

        audio: speech,

        service: service
          ? {
              id: service.id,
              name: service.name,
              slug: service.slug
            }
          : null
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (uploadedFile?.path) {
      await fs
        .unlink(
          uploadedFile.path
        )
        .catch(() => {});
    }
  }
}