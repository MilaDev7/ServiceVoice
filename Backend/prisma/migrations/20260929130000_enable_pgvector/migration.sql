-- Phase 4: enable pgvector and add OpenAI text-embedding-3-small storage.
-- The model's default embedding length is 1536, verified from OpenAI's embeddings documentation.
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "KnowledgeUnit" ADD COLUMN "embedding" vector (1536);

CREATE INDEX "KnowledgeUnit_embedding_hnsw_cosine_idx" ON "KnowledgeUnit" USING hnsw ("embedding" vector_cosine_ops)
WHERE
    "embedding" IS NOT NULL
    AND "isActive" = true
    AND "publicationStatus" = 'PUBLISHED';