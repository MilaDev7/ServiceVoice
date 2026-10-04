import Joi from "joi";

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
    message:
      Joi.string()
        .trim()
        .min(1)
        .max(4000)
        .required(),

    language:
      Joi.string()
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

export async function chat(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } = schema.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({
        success: false,

        message:
          error.details[0].message
      });
    }

    const {
      message,
      language,
      conversationId
    } = value;

    console.log(
      `[CHAT] language=${language}`
    );

    const conversation =
      await getOrCreateConversation(
        conversationId,
        language
      );

    const history =
      await getConversationHistory(
        conversation.id
      );

    const {
      service,
      context
    } =
      await retrieveServiceContext(
        message,
        language
      );

    const answer =
      await generateAnswer({
        question: message,

        language,

        context,

        history
      });

    await saveMessage({
      conversationId:
        conversation.id,

      role: "user",

      content: message
    });

    await saveMessage({
      conversationId:
        conversation.id,

      role: "assistant",

      content: answer
    });

    return res.json({
      success: true,

      data: {
        conversationId:
          conversation.id,

        language,

        answer,

        service:
          service
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
  }
}