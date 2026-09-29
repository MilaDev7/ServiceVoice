import crypto from "node:crypto";
import bcrypt from "bcrypt";
import env from "../config/env.js";

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(value) {
  return crypto
    .createHmac("sha256", env.jwtSecret)
    .update(value)
    .digest("base64url");
}

export function createToken(payload, ttl = env.accessTokenTtlSeconds) {
  const body = encode({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttl,
  });

  return `${body}.${sign(body)}`;
}

export function verifyToken(token) {
  const [body, signature] = String(token || "").split(".");
  const expected = sign(body);
  const invalidSignature = !body
    || !signature
    || signature.length !== expected.length
    || !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );

  if (invalidSignature) {
    const error = new Error("Invalid access token");
    error.statusCode = 401;
    throw error;
  }

  const payload = JSON.parse(Buffer.from(body, "base64url"));

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    const error = new Error("Access token expired");
    error.statusCode = 401;
    throw error;
  }

  return payload;
}

export function createAuthService(repository) {
  return {
    async register({ email, password }) {
      if (!email || !password || password.length < 8) {
        const error = new Error(
          "Email and a password of at least 8 characters are required",
        );
        error.statusCode = 400;
        throw error;
      }

      const user = await repository.createUser({ email: email.toLowerCase(), password });
      return issueTokens(repository, user);
    },

    async login({ email, password }) {
      const user = await repository.findUser(String(email || "").toLowerCase());

      if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
      }

      return issueTokens(repository, { id: user.id, email: user.email });
    },

    async refresh(token) {
      const record = await repository.consumeRefreshToken(token);

      if (!record || record.expiresAt <= Date.now()) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
      }

      return issueTokens(repository, { id: record.userId });
    },
  };
}

async function issueTokens(repository, user) {
  const accessToken = createToken({ sub: user.id, email: user.email });
  const refreshToken = crypto.randomBytes(32).toString("hex");

  await repository.saveRefreshToken(
    refreshToken,
    user.id,
    Date.now() + env.refreshTokenTtlSeconds * 1000,
  );

  return { accessToken, refreshToken, user };
}
