import { verifyToken } from "../services/auth.service.js";

export function authentication(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
}
