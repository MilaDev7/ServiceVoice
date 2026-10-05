import express from "express";

import {
  chat
} from "../controllers/chat.controller.js";

import {
  optionalAuth
} from "../middleware/auth.middleware.js";

const router =
  express.Router();

router.post(
  "/",
  optionalAuth,
  chat
);

export default router;