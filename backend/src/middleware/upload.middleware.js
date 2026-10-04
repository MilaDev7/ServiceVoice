import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

const uploadDirectory = path.resolve("uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

const allowedMimeTypes = new Set([
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/webm"
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".audio";

    callback(
      null,
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${extension}`
    );
  }
});

export const uploadAudio = multer({
  storage,

  limits: {
    fileSize:
      env.MAX_AUDIO_SIZE_MB * 1024 * 1024
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new Error(
          "Unsupported audio format. Use WAV, MP3, M4A, or WebM."
        )
      );
    }

    callback(null, true);
  }
});