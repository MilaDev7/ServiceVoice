import { Router } from "express";
import { asyncHandler } from "../middleware/async.handler.js";
import { validate } from "../middleware/validate.js";
import { voiceSchema } from "../validations/schemas.js";

export function createVoiceRoutes(controller) {
  const router = Router();

  router.post(
    "/",
    validate(voiceSchema),
    asyncHandler(controller.process),
  );

  return router;
}
