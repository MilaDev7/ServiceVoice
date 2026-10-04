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

const schema = Joi.object({
  language: Joi.string()
    .valid("am", "om", "en", "ti")
    .default("am"),

  conversationId: Joi.string()
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
    /*
     * -------------------------------------------------------
     * Validate uploaded audio
     * -------------------------------------------------------
     */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Audio file is required."
      });
    }

    uploadedFile = req.file;

    /*
     * -------------------------------------------------------
     * Validate request
     * -------------------------------------------------------
     */

    const {
      error,
      value
    } = schema.validate({
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

    console.log(
      "VOICE LANGUAGE:",
      language
    );

    /*
     * -------------------------------------------------------
     * Conversation
     * -------------------------------------------------------
     */

    const conversation =
      await getOrCreateConversation(
        conversationId,
        language
      );

    const history =
      await getConversationHistory(
        conversation.id
      );

    /*
     * -------------------------------------------------------
     * 1. Speech -> text
     *
     * AM/OM -> AddisAI
     * EN/TI -> Gemini
     * -------------------------------------------------------
     */

    const transcription =
      await transcribeAudio(
        uploadedFile.path,
        language
      );

    const question =
      transcription.text;

    console.log(
      "VOICE TRANSCRIPT:",
      question
    );

    /*
     * -------------------------------------------------------
     * 2. Retrieve database information
     * -------------------------------------------------------
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
     * -------------------------------------------------------
     * 3. Generate answer
     *
     * AM/OM -> AddisAI
     * EN/TI -> OpenAI
     * -------------------------------------------------------
     */

    const answer =
      await generateAnswer({
        question,

        language,

        context,

        history
      });

    /*
     * -------------------------------------------------------
     * 4. Save conversation
     * -------------------------------------------------------
     */

    await saveMessage({
      conversationId:
        conversation.id,

      role: "user",

      content: question
    });

    await saveMessage({
      conversationId:
        conversation.id,

      role: "assistant",

      content: answer
    });

    /*
     * -------------------------------------------------------
     * 5. Text -> speech
     *
     * AM/OM -> AddisAI
     * EN/TI -> Gemini
     * -------------------------------------------------------
     */

    const speech =
      await generateSpeech(
        answer,
        language
      );

    /*
     * -------------------------------------------------------
     * 6. Gemini returns Buffer
     *
     * We temporarily expose the audio through
     * a backend route.
     *
     * AddisAI already returns audioUrl.
     * -------------------------------------------------------
     */

    if (speech.buffer) {
      const audioId =
        crypto.randomUUID();

      /*
       * Store the generated audio
       * temporarily.
       *
       * Your production version should use
       * object storage such as Cloudinary or S3.
       */

      const audioDirectory =
        "./uploads/generated";

      await fs.mkdir(
        audioDirectory,
        {
          recursive: true
        }
      );

      const extension =
        speech.contentType ===
        "audio/wav"
          ? "wav"
          : "mp3";

      const audioPath =
        `${audioDirectory}/${audioId}.${extension}`;

      await fs.writeFile(
        audioPath,
        speech.buffer
      );

      const audioUrl =
        `${process.env.BACKEND_URL}/api/audio/${audioId}.${extension}`;

      return res.json({
        success: true,

        data: {
          conversationId:
            conversation.id,

          transcription: {
            text: question,

            confidence:
              transcription.confidence
          },

          answer,

          audio: {
            id: audioId,

            audioUrl,

            usage:
              speech.usage ?? null
          },

          service: service
            ? {
                id: service.id,

                name:
                  service.name,

                slug:
                  service.slug
              }
            : null
        }
      });
    }

    /*
     * -------------------------------------------------------
     * AddisAI audio URL
     * -------------------------------------------------------
     */

    return res.json({
      success: true,

      data: {
        conversationId:
          conversation.id,

        transcription: {
          text: question,

          confidence:
            transcription.confidence
        },

        answer,

        audio: {
          id: speech.id,

          audioUrl:
            speech.audioUrl,

          usage:
            speech.usage
        },

        service: service
          ? {
              id: service.id,

              name:
                service.name,

              slug:
                service.slug
            }
          : null
      }
    });
  } catch (error) {
    console.error(
      "VOICE CHAT ERROR:",
      error
    );

    next(error);
  } finally {
    /*
     * Delete uploaded microphone
     * recording.
     */

    if (uploadedFile?.path) {
      await fs
        .unlink(uploadedFile.path)
        .catch(() => {});
    }
  }
}