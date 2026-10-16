import express from "express";
import {
  submitFeedback,
  getDashboard,
  listFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/dashboard", getDashboard);
router.get("/list", listFeedback);   // ← NEW

export default router;