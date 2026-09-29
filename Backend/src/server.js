import dotenv from "dotenv";
import app from "./app.js";
import env from "./config/env.js";
import prisma from "./config/prisma.js";

dotenv.config();

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database disconnected");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});