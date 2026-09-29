import { Router } from "express";
import { asyncHandler } from "../middleware/async.handler.js";
import { validate } from "../middleware/validate.js";
import { chatSchema } from "../validations/schemas.js";

export function createChatRoutes(controller) {
  const router = Router();

  router.post(
    "/",
    validate(chatSchema),
    asyncHandler(controller.answer),
  );

  return router;
}
