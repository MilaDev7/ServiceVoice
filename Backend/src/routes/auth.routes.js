import { Router } from "express";
import { asyncHandler } from "../middleware/async.handler.js";
import { authentication } from "../middleware/authentication.js";
import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../validations/schemas.js";

export function createAuthRoutes(controller) {
  const router = Router();

  router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(controller.register),
  );

  router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(controller.login),
  );

  router.post(
    "/refresh",
    validate(refreshSchema),
    asyncHandler(controller.refresh),
  );

  router.get("/me", authentication, asyncHandler(controller.me));

  return router;
}
