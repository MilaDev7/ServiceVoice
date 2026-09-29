import test from "node:test";
import assert from "node:assert/strict";
import { createEmbeddingService } from "../src/services/embedding.service.js";
import { createKnowledgeIndexingService } from "../src/services/knowledge-indexing.service.js";

function response(payload, ok = true) {
  return {
    ok,
    async json() {
      return payload;
    },
  };
}

test("Embedding service validates the configured response dimension", async () => {
  const embeddingService = createEmbeddingService({
    apiKey: "test-key",
    apiUrl: "https://example.test/embeddings",
    model: "text-embedding-3-small",
    dimensions: 3,
    fetchImpl: async () => response({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    }),
  });

  assert.deepEqual(await embeddingService.embedQuery("question"), [0.1, 0.2, 0.3]);
});

test("Embedding service rejects a dimension mismatch", async () => {
  const embeddingService = createEmbeddingService({
    apiKey: "test-key",
    apiUrl: "https://example.test/embeddings",
    model: "text-embedding-3-small",
    dimensions: 3,
    fetchImpl: async () => response({
      data: [{ embedding: [0.1, 0.2] }],
    }),
  });

  await assert.rejects(
    embeddingService.embedQuery("question"),
    (error) => error.code === "INVALID_EMBEDDING_RESPONSE",
  );
});

test("Knowledge indexing marks failures instead of hiding embedding errors", async () => {
  const calls = [];
  const indexing = createKnowledgeIndexingService({
    embeddingService: {
      async embedDocuments() {
        throw new Error("provider unavailable");
      },
    },
    knowledgeRepository: {
      async markIndexingFailed(id) {
        calls.push(id);
      },
    },
  });

  await assert.rejects(
    indexing.indexKnowledge({ id: "knowledge-1", content: "content" }),
    /provider unavailable/,
  );
  assert.deepEqual(calls, ["knowledge-1"]);
});
