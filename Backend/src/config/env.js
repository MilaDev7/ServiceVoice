import dotenv from "dotenv";

dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || "*",
  jwtSecret: process.env.JWT_SECRET || "servicevoice-test-secret",
  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900),
  refreshTokenTtlSeconds: Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 604800),
  embeddingApiKey: process.env.EMBEDDING_API_KEY || "",
  embeddingApiUrl: process.env.EMBEDDING_API_URL || "",
  embeddingModel: process.env.EMBEDDING_MODEL || "",
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS || 1536),
  ragTopK: Number(process.env.RAG_TOP_K || 10),
  ragMinScore: Number(process.env.RAG_MIN_SCORE || 0.05),
};