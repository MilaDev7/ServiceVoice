import express from "express";
import cors from "cors";
import env from "./config/env.js";
import prisma from "./config/prisma.js";
import { createPrismaRepository } from "./repositories/prisma.repository.js";
import { createProviderSet } from "./services/providers/index.js";
import { createEmbeddingService } from "./services/embedding.service.js";
import { createApiRouter } from "./routes/api.routes.js";
import { createRagService } from "./services/rag.service.js";
import { createChatService } from "./services/chat.service.js";
import { createAuthService } from "./services/auth.service.js";
import { createVoiceService } from "./services/voice.service.js";
import { createAuthController } from "./controllers/auth.controller.js";
import { createChatController } from "./controllers/chat.controller.js";
import { createServiceController } from "./controllers/service.controller.js";
import { createVoiceController } from "./controllers/voice.controller.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.handler.js";

const app = express();

app.disable("x-powered-by");

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ServiceVoice API is running",
    environment: env.nodeEnv,
  });
});

const repository = createPrismaRepository(prisma, {
  vectorDimensions: env.embeddingDimensions,
});
const providers = createProviderSet();
const embeddingService = createEmbeddingService({
  apiKey: env.embeddingApiKey,
  apiUrl: env.embeddingApiUrl,
  model: env.embeddingModel,
  dimensions: env.embeddingDimensions,
});
const ragService = createRagService({
  serviceRepository: repository,
  knowledgeRepository: repository,
  embeddingService,
});
const chatService = createChatService({
  rag: ragService,
  llm: providers.llm,
});
const authService = createAuthService(repository);
const voiceService = createVoiceService({
  stt: providers.stt,
  chat: chatService,
  tts: providers.tts,
});

const apiRouter = createApiRouter({
  serviceController: createServiceController(repository),
  chatController: createChatController(chatService),
  authController: createAuthController(authService),
  voiceController: createVoiceController(voiceService),
});

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;