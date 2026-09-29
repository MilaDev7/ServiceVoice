import test from "node:test";
import assert from "node:assert/strict";
import { createRepository } from "../src/services/repository.js";
import { createRagService } from "../src/services/rag.service.js";

const repository = createRepository();
const rag = createRagService({
  serviceRepository: repository,
  knowledgeRepository: repository,
});

test("RAG: exact service query retrieves grounded context", async () => {
  const result = await rag.retrieve({ query: "marriage certificate", language: "en" });
  assert.equal(result.status, "grounded");
  assert.equal(result.services[0].slug, "marriage-certificate");
});

test("RAG: natural language query resolves the service", async () => {
  const result = await rag.retrieve({ query: "What documents do I need to get married?", language: "en" });
  assert.equal(result.services[0].slug, "marriage-certificate");
});

test("RAG: multilingual queries resolve the same underlying service", async () => {
  for (const [query, language] of [["ለጋብቻ ምስክር ወረቀት ምን ሰነዶች ያስፈልጋሉ?", "am"], ["Ragaa gaa'elaa argachuuf sanadoonni maaliif barbaachisu?", "om"], ["ናይ መርዓ ምስክር ወረቐት ንምርካብ እንታይ ሰነዳት የድሊ?", "ti"]]) {
    const result = await rag.retrieve({ query, language });
    assert.equal(result.services[0].slug, "marriage-certificate");
  }
});

test("RAG: unknown service is controlled", async () => {
  const result = await rag.retrieve({ query: "passport renewal", language: "en" });
  assert.equal(result.status, "insufficient-context");
});

test("RAG: insufficient context is explicit", async () => {
  const emptyService = { id: "empty", slug: "empty", nameEn: "Empty", nameAm: "Empty", nameOm: "Empty", nameTi: "Empty", descriptionEn: "", requirements: [], source: { reference: "EMPTY" } };
  const emptyRepository = createRepository([emptyService]);
  const emptyRag = createRagService({
    serviceRepository: emptyRepository,
    knowledgeRepository: emptyRepository,
  });
  const result = await emptyRag.retrieve({ query: "empty", language: "en", serviceSlug: "empty" });
  assert.equal(result.status, "insufficient-context");
});

test("RAG: multiple possible services require clarification", async () => {
  const result = await rag.retrieve({ query: "certificate", language: "en" });
  assert.equal(result.status, "ambiguous");
  assert.equal(result.services.length, 2);
});
