import { prisma } from "../config/prisma.js";

import {
  hashPassword,
  comparePassword
} from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  hashToken
} from "../utils/token.js";

import { env } from "../config/env.js";

export async function registerUser({
  name,
  email,
  password
}) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail
      }
    });

  if (existingUser) {
    const error = new Error(
      "An account with this email already exists."
    );

    error.statusCode = 409;

    throw error;
  }

  const passwordHash =
    await hashPassword(password);

  const user =
    await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
      }
    });

  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    generateRefreshToken(user);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
}

export async function loginUser({
  email,
  password
}) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail
      }
    });

  if (!user) {
    const error = new Error(
      "Invalid email or password."
    );

    error.statusCode = 401;

    throw error;
  }

  if (!user.isActive) {
    const error = new Error(
      "This account is inactive."
    );

    error.statusCode = 403;

    throw error;
  }

  const passwordValid =
    await comparePassword(
      password,
      user.passwordHash
    );

  if (!passwordValid) {
    const error = new Error(
      "Invalid email or password."
    );

    error.statusCode = 401;

    throw error;
  }

  return {
    user: sanitizeUser(user),

    accessToken:
      generateAccessToken(user),

    refreshToken:
      generateRefreshToken(user)
  };
}

export async function refreshUserToken(
  refreshToken
) {
  const {
    verifyRefreshToken
  } = await import("../utils/token.js");

  let payload;

  try {
    payload =
      verifyRefreshToken(
        refreshToken
      );
  } catch {
    const error = new Error(
      "Invalid or expired refresh token."
    );

    error.statusCode = 401;

    throw error;
  }

  if (payload.type !== "refresh") {
    const error = new Error(
      "Invalid refresh token."
    );

    error.statusCode = 401;

    throw error;
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    });

  if (!user || !user.isActive) {
    const error = new Error(
      "User account is unavailable."
    );

    error.statusCode = 401;

    throw error;
  }

  return {
    accessToken:
      generateAccessToken(user),

    refreshToken:
      generateRefreshToken(user)
  };
}

export async function createPasswordResetRequest(
  email
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail
      }
    });

  /*
   * Do not reveal whether an email
   * exists in the system.
   */
  if (!user) {
    return;
  }

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id
    }
  });

  const rawToken =
    generatePasswordResetToken();

  const tokenHash =
    hashToken(rawToken);

  const expiresAt =
    new Date(
      Date.now() +
        env.PASSWORD_RESET_EXPIRES_MINUTES *
          60 *
          1000
    );

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  /*
   * For development/testing.
   *
   * In production this token should be
   * sent through your email provider.
   */
  return rawToken;
}

export async function resetUserPassword({
  token,
  password
}) {
  const tokenHash =
    hashToken(token);

  const resetRecord =
    await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash
      }
    });

  if (!resetRecord) {
    const error = new Error(
      "Invalid or expired password reset token."
    );

    error.statusCode = 400;

    throw error;
  }

  if (resetRecord.usedAt) {
    const error = new Error(
      "This password reset token has already been used."
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    resetRecord.expiresAt.getTime() <
    Date.now()
  ) {
    const error = new Error(
      "Invalid or expired password reset token."
    );

    error.statusCode = 400;

    throw error;
  }

  const passwordHash =
    await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: resetRecord.userId
      },
      data: {
        passwordHash
      }
    }),

    prisma.passwordResetToken.update({
      where: {
        id: resetRecord.id
      },
      data: {
        usedAt: new Date()
      }
    })
  ]);
}

export async function getUserById(
  userId
) {
  return prisma.user.findUnique({
    where: {
      id: userId
    }
  });
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}