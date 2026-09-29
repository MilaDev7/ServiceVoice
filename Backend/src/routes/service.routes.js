import { Router } from "express";
import { asyncHandler } from "../middleware/async.handler.js";
import { validate } from "../middleware/validate.js";
import {
  serviceListSchema,
  serviceParamsSchema,
} from "../validations/schemas.js";

export function createServiceRoutes(controller) {
  const router = Router();

  router.get(
    "/",
    validate(serviceListSchema, "query"),
    asyncHandler(controller.list),
  );

  router.get(
    "/:slug",
    validate(serviceParamsSchema, "params"),
    asyncHandler(controller.getBySlug),
  );

  return router;
}
