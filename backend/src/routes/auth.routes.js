import express from "express";

import {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  me
} from "../controllers/auth.controller.js";

import {
  optionalAuth
} from "../middleware/auth.middleware.js";

import {
  requireAuth
} from "../middleware/requireAuth.middleware.js";

const router =
  express.Router();

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.post(
  "/refresh",
  refresh
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

router.get(
  "/me",
  optionalAuth,
  requireAuth,
  me
);

export default router;