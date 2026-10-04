import { Router } from "express";
import { voiceChat } from "../controllers/voice.controller.js";
import { uploadAudio } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  uploadAudio.single("audio"),
  voiceChat
);

export default router;