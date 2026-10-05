import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";

import chatRoutes from "./routes/chat.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import authRoutes from "./routes/auth.routes.js";
import historyRoutes from "./routes/history.routes.js";


import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(
  helmet()
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

app.use(
  morgan(
    env.NODE_ENV === "production"
      ? "combined"
      : "dev"
  )
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", apiLimiter);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "ServiceVoice backend is running",
    environment: env.NODE_ENV
  });
});

app.use("/api/auth",authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/history",historyRoutes);

app.use("/api/voice/chat", voiceRoutes);

app.use(errorHandler);

export default app;