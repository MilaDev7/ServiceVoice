import { Router } from "express";
import { voiceChat } from "../controllers/voice.controller.js";
import { uploadAudio } from "../middleware/upload.middleware.js";
import { optionalAuth } from "../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/",
  optionalAuth,
  uploadAudio.single("audio"),
  voiceChat
);

export default router;