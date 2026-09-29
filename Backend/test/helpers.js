import express from "express";
import { createApiRouter } from "../src/routes/api.routes.js";
import { createRepository } from "../src/services/repository.js";
import { createProviderSet } from "../src/services/providers/index.js";
import { createRagService } from "../src/services/rag.service.js";
import { createChatService } from "../src/services/chat.service.js";
import { createAuthService } from "../src/services/auth.service.js";
import { createVoiceService } from "../src/services/voice.service.js";
import { createAuthController } from "../src/controllers/auth.controller.js";
import { createChatController } from "../src/controllers/chat.controller.js";
import { createServiceController } from "../src/controllers/service.controller.js";
import { createVoiceController } from "../src/controllers/voice.controller.js";
import { createServer } from "node:http";

export function createTestApp({ seed, providers } = {}) {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const repository = createRepository(seed);
  const providerSet = createProviderSet(providers);
  const ragService = createRagService(repository);
  const chatService = createChatService({
    rag: ragService,
    llm: providerSet.llm,
  });
  const authService = createAuthService(repository);
  const voiceService = createVoiceService({
    stt: providerSet.stt,
    chat: chatService,
    tts: providerSet.tts,
  });

  app.use("/api", createApiRouter({
    serviceController: createServiceController(repository),
    chatController: createChatController(chatService),
    authController: createAuthController(authService),
    voiceController: createVoiceController(voiceService),
  }));
  app.use((error, req, res, next) => res.status(error.statusCode || 500).json({ success: false, error: error.message }));
  return app;
}

export async function request(app, method, path, body, headers = {}) {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { method, headers: { "content-type": "application/json", ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, body: await response.json() };
  } finally { await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
}
