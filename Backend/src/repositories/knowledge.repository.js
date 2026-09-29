const knowledgeSelect = {
  id: true,
  serviceId: true,
  sourceId: true,
  language: true,
  type: true,
  content: true,
  normalizedContent: true,
  publicationStatus: true,
  indexingStatus: true,
  isActive: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  source: {
    select: {
      id: true,
      title: true,
      reference: true,
      url: true,
      type: true,
      authority: true,
      publicationDate: true,
      verificationNote: true,
      isVerified: true,
    },
  },
};

export function createKnowledgeRepository(prisma, { vectorDimensions = 1536 } = {}) {
  return {
    async searchKeyword({ query, language, take = 10 }) {
      const rows = await prisma.$queryRaw`
        SELECT
          ku."id" AS "knowledgeId",
          ku."serviceId",
          ku."language",
          ku."type",
          ku."content",
          ku."sourceId",
          s."slug" AS "serviceSlug",
          s."nameEn" AS "serviceNameEn",
          s."nameAm" AS "serviceNameAm",
          s."nameOm" AS "serviceNameOm",
          s."nameTi" AS "serviceNameTi",
          src."id" AS "sourceIdValue",
          src."title" AS "sourceTitle",
          src."reference" AS "sourceReference",
          src."url" AS "sourceUrl",
          src."type" AS "sourceType",
          src."authority" AS "sourceAuthority",
          src."isVerified" AS "sourceIsVerified",
          ts_rank_cd(
            to_tsvector('simple', concat_ws(' ',
              ku."content",
              ku."normalizedContent",
              s."nameEn",
              s."nameAm",
              s."nameOm",
              s."nameTi",
              s."descriptionEn",
              s."descriptionAm",
              s."descriptionOm",
              s."descriptionTi"
            )),
            websearch_to_tsquery('simple', ${query})
          ) AS "keywordScore"
        FROM "KnowledgeUnit" ku
        INNER JOIN "Service" s ON s."id" = ku."serviceId"
        LEFT JOIN "Source" src ON src."id" = ku."sourceId"
        WHERE ku."isActive" = true
          AND ku."publicationStatus" = 'PUBLISHED'
          AND s."isActive" = true
          AND ku."language" = ${language}
          AND to_tsvector('simple', concat_ws(' ',
            ku."content",
            ku."normalizedContent",
            s."nameEn",
            s."nameAm",
            s."nameOm",
            s."nameTi",
            s."descriptionEn",
            s."descriptionAm",
            s."descriptionOm",
            s."descriptionTi"
          )) @@ websearch_to_tsquery('simple', ${query})
        ORDER BY "keywordScore" DESC, ku."updatedAt" DESC
        LIMIT ${take}
      `;

      return rows.map(mapSearchRow);
    },

    async searchSemantic({ embedding, language, take = 10 }) {
      if (!isValidEmbedding(embedding, vectorDimensions)) {
        const error = new Error("Embedding dimension does not match pgvector storage");
        error.code = "EMBEDDING_DIMENSION_MISMATCH";
        error.statusCode = 400;
        throw error;
      }

      const vector = toPgVector(embedding);
      const rows = await prisma.$queryRawUnsafe(`
        SELECT
          ku."id" AS "knowledgeId",
          ku."serviceId",
          ku."language",
          ku."type",
          ku."content",
          src."id" AS "sourceIdValue",
          src."title" AS "sourceTitle",
          src."reference" AS "sourceReference",
          src."url" AS "sourceUrl",
          src."type" AS "sourceType",
          src."authority" AS "sourceAuthority",
          src."isVerified" AS "sourceIsVerified",
          1 - (ku."embedding" <=> $1::vector) AS "semanticScore",
          s."slug" AS "serviceSlug",
          s."nameEn" AS "serviceNameEn",
          s."nameAm" AS "serviceNameAm",
          s."nameOm" AS "serviceNameOm",
          s."nameTi" AS "serviceNameTi"
        FROM "KnowledgeUnit" ku
        INNER JOIN "Service" s ON s."id" = ku."serviceId"
        LEFT JOIN "Source" src ON src."id" = ku."sourceId"
        WHERE ku."embedding" IS NOT NULL
          AND ku."isActive" = true
          AND ku."publicationStatus" = 'PUBLISHED'
          AND s."isActive" = true
          AND ku."language" = $2
        ORDER BY ku."embedding" <=> $1::vector ASC
        LIMIT $3
      `, vector, language, take);

      return rows.map((row) => ({
        ...mapSearchRow(row),
        semanticScore: Number(row.semanticScore || 0),
      }));
    },

    async findByService({ serviceId, language, type }) {
      return prisma.knowledgeUnit.findMany({
        where: {
          serviceId,
          isActive: true,
          publicationStatus: "PUBLISHED",
          ...(language ? { language } : {}),
          ...(type ? { type } : {}),
        },
        select: knowledgeSelect,
        orderBy: [
          { type: "asc" },
          { createdAt: "asc" },
        ],
      });
    },

    async findActive({ language, type, serviceId, take = 50, skip = 0 } = {}) {
      return prisma.knowledgeUnit.findMany({
        where: {
          isActive: true,
          publicationStatus: "PUBLISHED",
          ...(language ? { language } : {}),
          ...(type ? { type } : {}),
          ...(serviceId ? { serviceId } : {}),
        },
        select: knowledgeSelect,
        orderBy: { updatedAt: "desc" },
        take,
        skip,
      });
    },

    async findById(id) {
      return prisma.knowledgeUnit.findUnique({
        where: { id },
        select: knowledgeSelect,
      });
    },

    async create(data) {
      return prisma.knowledgeUnit.create({
        data,
        select: knowledgeSelect,
      });
    },

    async update(id, data) {
      return prisma.knowledgeUnit.update({
        where: { id },
        data,
        select: knowledgeSelect,
      });
    },

    async saveEmbedding(id, embedding) {
      if (!isValidEmbedding(embedding, vectorDimensions)) {
        const error = new Error("Embedding dimension does not match pgvector storage");
        error.code = "EMBEDDING_DIMENSION_MISMATCH";
        error.statusCode = 400;
        throw error;
      }

      const vector = toPgVector(embedding);
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeUnit" SET "embedding" = $1::vector, "indexingStatus" = 'INDEXED', "updatedAt" = NOW() WHERE "id" = $2`,
        vector,
        id,
      );
    },

    async markIndexingFailed(id) {
      await prisma.knowledgeUnit.update({
        where: { id },
        data: { indexingStatus: "FAILED" },
      });
    },
  };
}

function isValidEmbedding(embedding, dimensions) {
  return Array.isArray(embedding)
    && embedding.length === dimensions
    && embedding.every((value) => Number.isFinite(value));
}

function toPgVector(embedding) {
  return `[${embedding.map((value) => Number(value).toString()).join(",")}]`;
}

function mapSearchRow(row) {
  return {
    knowledgeId: row.knowledgeId,
    serviceId: row.serviceId,
    service: {
      slug: row.serviceSlug,
      nameEn: row.serviceNameEn,
      nameAm: row.serviceNameAm,
      nameOm: row.serviceNameOm,
      nameTi: row.serviceNameTi,
    },
    language: row.language,
    type: row.type,
    content: row.content,
    keywordScore: Number(row.keywordScore || 0),
    source: row.sourceIdValue
      ? {
          id: row.sourceIdValue,
          title: row.sourceTitle,
          reference: row.sourceReference,
          url: row.sourceUrl,
          type: row.sourceType,
          authority: row.sourceAuthority,
          isVerified: row.sourceIsVerified,
        }
      : null,
  };
}
