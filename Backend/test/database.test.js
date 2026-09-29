import test from "node:test";
import assert from "node:assert/strict";
import { createRepository } from "../src/services/repository.js";

const repository = createRepository();

test("database: valid service has authoritative fields", async () => {
  const service = await repository.findService("marriage-certificate");
  assert.equal(service.slug, "marriage-certificate");
  assert.equal(service.category, "CIVIL_STATUS");
  assert.ok(service.source.reference);
});

test("database: service requirements are present and named", async () => {
  const service = await repository.findService("marriage-certificate");
  assert.deepEqual(service.requirements.map((item) => item.nameEn), ["National ID", "Two witnesses"]);
});

test("database: all required language translations are represented", async () => {
  const service = await repository.findService("marriage-certificate");
  for (const language of ["en", "am", "om", "ti"]) assert.ok(service.translations[language]);
  for (const requirement of service.requirements) for (const field of ["nameEn", "nameAm", "nameOm", "nameTi"]) assert.ok(requirement[field]);
});

test("database: source relationship is attached to the service", async () => {
  const service = await repository.findService("marriage-certificate");
  assert.equal(service.source.type, "REGULATION");
  assert.equal(service.source.title, "Civil Registration Regulation");
});
