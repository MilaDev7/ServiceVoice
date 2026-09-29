import { Router } from "express";
import { createAuthRoutes } from "./auth.routes.js";
import { createChatRoutes } from "./chat.routes.js";
import { createServiceRoutes } from "./service.routes.js";
import { createVoiceRoutes } from "./voice.routes.js";
import { authentication } from "../middleware/authentication.js";
import { asyncHandler } from "../middleware/async.handler.js";

export function createApiRouter({
  serviceController,
  chatController,
  authController,
  voiceController,
}) {
  const router = Router();

  router.use("/services", createServiceRoutes(serviceController));
  router.use("/chat", createChatRoutes(chatController));
  router.use("/voice", createVoiceRoutes(voiceController));
  router.use("/auth", createAuthRoutes(authController));
  router.get("/me", authentication, asyncHandler(authController.me));

  return router;
}
