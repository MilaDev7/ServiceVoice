import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const PORT = env.PORT || 5000;
const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(
    `ServiceVoice backend running on http://${HOST}:${PORT}`
  );
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));