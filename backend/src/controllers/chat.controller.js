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
    message: Joi.string()
      .trim()
      .min(1)
      .max(4000)
      .required(),

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

export async function chat(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } =
      schema.validate(
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

    /*
     * If authenticated:
     *
     * req.user.id
     *
     * If guest:
     *
     * undefined
     */
    const userId =
      req.user?.id || null;

    console.log(
      "CHAT USER:",
      userId || "GUEST"
    );

    console.log(
      "CHAT LANGUAGE:",
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

    /*
     * Only authenticated users
     * reach this persistence section.
     */
    if (conversation.isPersistent) {
      await saveMessage({
        conversationId:
          conversation.id,
        role: "user",
        content: message,
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

    return res.json({
      success: true,

      data: {
        /*
         * Guests receive null.
         *
         * Authenticated users receive
         * their conversation ID.
         */
        conversationId:
          conversation.isPersistent
            ? conversation.id
            : null,

        persistent:
          conversation.isPersistent,

        answer,

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
  }
}