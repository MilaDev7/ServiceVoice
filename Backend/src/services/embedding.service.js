export function createEmbeddingService({
  apiKey,
  apiUrl,
  model,
  dimensions = 1536,
  fetchImpl = fetch,
} = {}) {
  return {
    isConfigured: Boolean(apiKey && apiUrl && model),

    async embedQuery(text) {
      return requestEmbedding({
        text,
        apiKey,
        apiUrl,
        model,
        dimensions,
        fetchImpl,
      });
    },

    async embedDocuments(texts) {
      if (!Array.isArray(texts) || texts.length === 0) {
        return [];
      }

      return Promise.all(
        texts.map((text) => requestEmbedding({
          text,
          apiKey,
          apiUrl,
          model,
          dimensions,
          fetchImpl,
        })),
      );
    },

    getModelInfo() {
      return {
        model: model || null,
        dimensions,
        configured: Boolean(apiKey && apiUrl && model),
      };
    },
  };
}

async function requestEmbedding({
  text,
  apiKey,
  apiUrl,
  model,
  dimensions,
  fetchImpl,
}) {
  if (!apiKey || !apiUrl || !model) {
    const error = new Error("Embedding provider is not configured");
    error.code = "EMBEDDING_PROVIDER_NOT_CONFIGURED";
    error.statusCode = 503;
    throw error;
  }

  const response = await fetchImpl(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text,
      dimensions,
    }),
  });

  if (!response.ok) {
    const error = new Error("Embedding provider request failed");
    error.code = "EMBEDDING_PROVIDER_ERROR";
    error.statusCode = 502;
    throw error;
  }

  const payload = await response.json();
  const vector = payload.data?.[0]?.embedding || payload.embedding;

  if (!Array.isArray(vector) || vector.length !== dimensions) {
    const error = new Error("Embedding provider returned an invalid vector");
    error.code = "INVALID_EMBEDDING_RESPONSE";
    error.statusCode = 502;
    throw error;
  }

  return vector;
}
