export function createKnowledgeIndexingService({
  knowledgeRepository,
  embeddingService,
}) {
  return {
    async indexKnowledge(knowledge) {
      try {
        const [embedding] = await embeddingService.embedDocuments([
          knowledge.normalizedContent || knowledge.content,
        ]);

        await knowledgeRepository.saveEmbedding(knowledge.id, embedding);
        return { ...knowledge, indexingStatus: "INDEXED" };
      } catch (error) {
        await knowledgeRepository.markIndexingFailed(knowledge.id);
        throw error;
      }
    },
  };
}
