import jwt from "jsonwebtoken";
import crypto from "crypto";

import { env } from "../config/env.js";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "access"
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        env.JWT_ACCESS_EXPIRES_IN
    }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh"
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        env.JWT_REFRESH_EXPIRES_IN
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );
}

export function generatePasswordResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}