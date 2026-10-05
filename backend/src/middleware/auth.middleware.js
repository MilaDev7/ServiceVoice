import {
  verifyAccessToken
} from "../utils/token.js";

import {
  getUserById
} from "../services/auth.service.js";

export async function optionalAuth(
  req,
  res,
  next
) {
  try {
    req.user = null;

    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return next();
    }

    if (
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return next();
    }

    const token =
      authorization.substring(7);

    let payload;

    try {
      payload =
        verifyAccessToken(token);
    } catch {
      return next();
    }

    if (payload.type !== "access") {
      return next();
    }

    const user =
      await getUserById(payload.sub);

    if (!user || !user.isActive) {
      return next();
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    next(error);
  }
}