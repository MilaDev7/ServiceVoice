import test from "node:test";
import assert from "node:assert/strict";
import { createKnowledgeRepository } from "../src/repositories/knowledge.repository.js";
import { createServiceRepository } from "../src/repositories/service.repository.js";
import { createSourceRepository } from "../src/repositories/source.repository.js";

function createPrismaDouble() {
  const service = {
    id: "service-marriage",
    slug: "marriage-certificate",
    nameEn: "Marriage certificate",
    nameAm: "የጋብቻ ምስክር ወረቀት",
    nameOm: "Ragaa gaa'elaa",
    nameTi: "ናይ መርዓ ምስክር ወረቐት",
    descriptionEn: "Register and obtain a marriage certificate.",
    descriptionAm: null,
    descriptionOm: null,
    descriptionTi: null,
    category: "CIVIL_STATUS",
    isActive: true,
  };

  const knowledge = [
    {
      id: "knowledge-id-en",
      serviceId: service.id,
      sourceId: "source-1",
      language: "en",
      type: "REQUIREMENT",
      content: "A National ID is required.",
      normalizedContent: null,
      publicationStatus: "PUBLISHED",
      indexingStatus: "PENDING",
      isActive: true,
      publishedAt: new Date(),
      source: {
        id: "source-1",
        title: "Civil Registration Regulation",
        reference: "CR-2024-01",
        url: null,
        type: "OFFICIAL_REGULATION",
        authority: "Civil Registration Office",
        publicationDate: null,
        verificationNote: null,
        isVerified: true,
      },
    },
    {
      id: "knowledge-id-inactive",
      serviceId: service.id,
      sourceId: null,
      language: "en",
      type: "REQUIREMENT",
      content: "Inactive content",
      normalizedContent: null,
      publicationStatus: "ARCHIVED",
      indexingStatus: "FAILED",
      isActive: false,
      publishedAt: null,
      source: null,
    },
  ];

  return {
    service: {
      findFirst: async ({ where }) => where.slug === service.slug ? service : null,
      findMany: async () => [service],
    },
    knowledgeUnit: {
      findMany: async ({ where }) => knowledge.filter((item) => (
        item.serviceId === where.serviceId
        && item.isActive === where.isActive
        && item.publicationStatus === where.publicationStatus
        && (!where.language || item.language === where.language)
      )),
      findUnique: async ({ where }) => knowledge.find((item) => item.id === where.id) || null,
    },
    source: {
      findUnique: async ({ where }) => {
        if (where.id) return where.id === "source-1" ? knowledge[0].source : null;
        return where.reference === "CR-2024-01" ? knowledge[0].source : null;
      },
      findMany: async () => [knowledge[0].source],
    },
  };
}

test("service repository finds an active service", async () => {
  const prisma = createPrismaDouble();
  const knowledgeRepository = createKnowledgeRepository(prisma);
  const repository = createServiceRepository(prisma, knowledgeRepository);
  const service = await repository.findService("marriage-certificate", { language: "en" });

  assert.equal(service.slug, "marriage-certificate");
  assert.equal(service.requirements.length, 1);
  assert.equal(service.requirements[0].nameEn, "A National ID is required.");
});

test("service repository returns null for an unknown service", async () => {
  const prisma = createPrismaDouble();
  const repository = createServiceRepository(
    prisma,
    createKnowledgeRepository(prisma),
  );

  assert.equal(await repository.findService("unknown-service"), null);
});

test("service repository searches through Prisma and does not expose a service array", async () => {
  const prisma = createPrismaDouble();
  const repository = createServiceRepository(
    prisma,
    createKnowledgeRepository(prisma),
  );
  const services = await repository.findServices("marriage");

  assert.equal(services.length, 1);
  assert.equal("services" in repository, false);
});

test("knowledge repository filters inactive and unpublished knowledge in the database query", async () => {
  const prisma = createPrismaDouble();
  const repository = createKnowledgeRepository(prisma);
  const knowledge = await repository.findByService({
    serviceId: "service-marriage",
    language: "en",
  });

  assert.equal(knowledge.length, 1);
  assert.equal(knowledge[0].content, "A National ID is required.");
});

test("source repository returns null when a source does not exist", async () => {
  const repository = createSourceRepository(createPrismaDouble());
  assert.equal(await repository.findById("missing-source"), null);
});

test("repository errors are propagated for the middleware layer", async () => {
  const databaseError = new Error("database unavailable");
  const prisma = {
    knowledgeUnit: {
      findMany: async () => {
        throw databaseError;
      },
    },
  };
  const repository = createKnowledgeRepository(prisma);

  await assert.rejects(
    repository.findActive(),
    (error) => error === databaseError,
  );
});
