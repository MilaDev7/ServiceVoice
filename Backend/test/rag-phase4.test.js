import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRagService } from "../src/services/rag.service.js";

function createKnowledgeRepository(results) {
  return {
    async searchKeyword() {
      return results.keyword || [];
    },
    async searchSemantic() {
      return results.semantic || [];
    },
    async findByService() {
      return results.explicit || [];
    },
  };
}

const serviceRepository = {
  async findService() {
    return {
      id: "service-marriage",
      slug: "marriage-certificate",
      nameEn: "Marriage certificate",
      descriptionEn: "Register a marriage.",
    };
  },
};

function result(overrides = {}) {
  return {
    knowledgeId: "knowledge-1",
    serviceId: "service-marriage",
    service: {
      slug: "marriage-certificate",
      name: "Marriage certificate",
    },
    language: "en",
    type: "REQUIREMENT",
    content: "A National ID is required.",
    keywordScore: 0.8,
    source: {
      id: "source-1",
      title: "Civil Registration Regulation",
      reference: "CR-2024-01",
    },
    ...overrides,
  };
}

test("Phase 4: semantic and keyword results are combined", async () => {
  const repository = createKnowledgeRepository({
    keyword: [result({ keywordScore: 0.5 })],
    semantic: [result({ semanticScore: 0.9 })],
  });
  const rag = createRagService({
    serviceRepository,
    knowledgeRepository: repository,
    embeddingService: {
      isConfigured: true,
      async embedQuery() {
        return [0.1, 0.2];
      },
    },
  });

  const response = await rag.retrieve({
    query: "documents for getting married",
    language: "en",
  });

  assert.equal(response.status, "grounded");
  assert.equal(response.retrievedKnowledge.length, 1);
  assert.ok(response.retrievedKnowledge[0].score > 0.7);
});

test("Phase 4: low relevance returns insufficient-context", async () => {
  const repository = createKnowledgeRepository({
    keyword: [result({ keywordScore: 0.001 })],
  });
  const rag = createRagService({
    serviceRepository,
    knowledgeRepository: repository,
  });

  const response = await rag.retrieve({
    query: "unrelated question",
    language: "en",
  });

  assert.equal(response.status, "insufficient-context");
  assert.deepEqual(response.retrievedKnowledge, []);
});

test("Phase 4: similarly ranked services return ambiguous", async () => {
  const repository = createKnowledgeRepository({
    keyword: [
      result({ knowledgeId: "marriage-1", keywordScore: 0.8 }),
      result({
        knowledgeId: "birth-1",
        serviceId: "service-birth",
        service: { slug: "birth-certificate", name: "Birth certificate" },
        keywordScore: 0.76,
      }),
    ],
  });
  const rag = createRagService({
    serviceRepository,
    knowledgeRepository: repository,
  });

  const response = await rag.retrieve({
    query: "certificate",
    language: "en",
  });

  assert.equal(response.status, "ambiguous");
  assert.equal(response.services.length, 2);
});

test("Phase 4: context removes duplicate knowledge and preserves sources", async () => {
  const repository = createKnowledgeRepository({
    keyword: [
      result({ keywordScore: 0.9 }),
      result({ keywordScore: 0.8 }),
    ],
  });
  const rag = createRagService({
    serviceRepository,
    knowledgeRepository: repository,
  });

  const response = await rag.retrieve({
    query: "national id",
    language: "en",
  });

  assert.equal(response.context.records.length, 1);
  assert.equal(response.sources[0].reference, "CR-2024-01");
});

test("Phase 4: production RAG has no hard-coded alias array", async () => {
  const source = await fs.readFile(
    new URL("../src/services/rag.service.js", import.meta.url),
    "utf8",
  );

  assert.equal(source.includes("const aliases"), false);
  assert.equal(source.includes("broadTerms"), false);
});
