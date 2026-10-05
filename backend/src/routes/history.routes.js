import express from "express";

import {
  getChatHistory
} from "../controllers/history.controller.js";

import {
  optionalAuth
} from "../middleware/auth.middleware.js";

import {
  requireAuth
} from "../middleware/requireAuth.middleware.js";

const router =
  express.Router();

router.get(
  "/",
  optionalAuth,
  requireAuth,
  getChatHistory
);

export default router;