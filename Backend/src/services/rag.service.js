import env from "../config/env.js";
import { assertLanguage } from "./languages.js";
import { createContextBuilder } from "./context-builder.service.js";

export function createRagService(options = {}) {
  const serviceRepository = options.serviceRepository || options;
  const knowledgeRepository = options.knowledgeRepository || options;
  const embeddingService = options.embeddingService;
  const contextBuilder = options.contextBuilder || createContextBuilder();
  const serviceData = serviceRepository || knowledgeRepository;

  return {
    async retrieve({ query, language, serviceSlug }) {
      assertLanguage(language);

      const retrieved = serviceSlug
        ? await retrieveForService({
            serviceRepository: serviceData,
            knowledgeRepository,
            serviceSlug,
            language,
          })
        : await retrieveHybrid({
            query,
            language,
            knowledgeRepository,
            embeddingService,
          });

      const ranked = rankResults(retrieved);
      const relevant = ranked.filter((result) => result.score >= env.ragMinScore);

      if (!relevant.length) {
        return insufficientContext();
      }

      const candidates = getServiceCandidates(relevant);
      if (candidates.length > 1 && isAmbiguous(candidates)) {
        return {
          status: "ambiguous",
          services: candidates.map((candidate) => candidate.service),
          requirements: [],
          sources: collectSources(relevant),
          retrievedKnowledge: relevant,
        };
      }

      const service = candidates[0]?.service || relevant[0].service;
      const selectedResults = candidates.length > 1
        ? relevant.filter((result) => result.serviceId === relevant[0].serviceId)
        : relevant;
      const context = contextBuilder.build(selectedResults);

      return {
        status: "grounded",
        services: [service],
        requirements: selectedResults
          .filter((result) => result.type === "REQUIREMENT")
          .map((result) => ({
            name: result.content,
            language: result.language,
          })),
        sources: collectSources(selectedResults),
        retrievedKnowledge: selectedResults,
        context,
      };
    },
  };
}

async function retrieveForService({
  serviceRepository,
  knowledgeRepository,
  serviceSlug,
  language,
}) {
  const service = await serviceRepository.findService(serviceSlug, { language });
  if (!service) {
    return [];
  }

  const knowledge = await knowledgeRepository.findByService({
    serviceId: service.id,
    language,
  });

  return knowledge.map((record) => ({
    knowledgeId: record.id,
    serviceId: record.serviceId,
    service: serviceSummary(service, language),
    language: record.language,
    type: record.type,
    content: record.content,
    keywordScore: 1,
    semanticScore: 1,
    source: record.source,
  }));
}

async function retrieveHybrid({
  query,
  language,
  knowledgeRepository,
  embeddingService,
}) {
  const keywordResults = await knowledgeRepository.searchKeyword({
    query,
    language,
    take: env.ragTopK,
  });

  let semanticResults = [];
  if (embeddingService?.isConfigured && knowledgeRepository.searchSemantic) {
    const queryEmbedding = await embeddingService.embedQuery(query);
    try {
      semanticResults = await knowledgeRepository.searchSemantic({
        embedding: queryEmbedding,
        language,
        take: env.ragTopK,
      });
    } catch (error) {
      if (error.code !== "VECTOR_SEARCH_NOT_CONFIGURED") {
        throw error;
      }
    }
  }

  return mergeResults(keywordResults, semanticResults);
}

function mergeResults(keywordResults, semanticResults) {
  const merged = new Map();

  for (const result of keywordResults) {
    merged.set(result.knowledgeId, {
      ...result,
      keywordScore: normalizeScore(result.keywordScore),
      semanticScore: 0,
    });
  }

  for (const result of semanticResults) {
    const current = merged.get(result.knowledgeId);
    merged.set(result.knowledgeId, {
      ...current,
      ...result,
      keywordScore: current?.keywordScore || 0,
      semanticScore: normalizeScore(result.semanticScore),
    });
  }

  return [...merged.values()];
}

function rankResults(results) {
  return results
    .map((result) => ({
      ...result,
      // Hybrid score: semantic similarity 60%, PostgreSQL keyword score 40%.
      score: result.semanticScore > 0
        ? (result.semanticScore * 0.6) + (result.keywordScore * 0.4)
        : result.keywordScore,
    }))
    .sort((left, right) => right.score - left.score);
}

function getServiceCandidates(results) {
  const byService = new Map();

  for (const result of results) {
    const existing = byService.get(result.serviceId);
    if (!existing || result.score > existing.score) {
      byService.set(result.serviceId, {
        service: result.service,
        score: result.score,
      });
    }
  }

  return [...byService.values()].sort((left, right) => right.score - left.score);
}

function isAmbiguous(candidates) {
  return candidates[1].score >= candidates[0].score * 0.9;
}

function collectSources(results) {
  const sources = new Map();

  for (const result of results) {
    if (result.source) {
      sources.set(result.source.id, result.source);
    }
  }

  return [...sources.values()];
}

function serviceSummary(service, language) {
  const suffix = language === "en"
    ? "En"
    : language === "am"
      ? "Am"
      : language === "om"
        ? "Om"
        : "Ti";

  return {
    slug: service.slug,
    name: service[`name${suffix}`] || service.nameEn,
    description: service[`description${suffix}`] || service.descriptionEn,
  };
}

function normalizeScore(score) {
  return Math.max(0, Math.min(1, Number(score || 0)));
}

function insufficientContext() {
  return {
    status: "insufficient-context",
    services: [],
    requirements: [],
    sources: [],
    retrievedKnowledge: [],
  };
}
