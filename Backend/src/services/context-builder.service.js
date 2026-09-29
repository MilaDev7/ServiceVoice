export function createContextBuilder({ maxItems = 10, maxCharacters = 12000 } = {}) {
  return {
    build(results = []) {
      const seen = new Set();
      const uniqueResults = results.filter((result) => {
        if (seen.has(result.knowledgeId)) {
          return false;
        }

        seen.add(result.knowledgeId);
        return true;
      });

      const selected = [];
      let characterCount = 0;

      for (const result of uniqueResults.slice(0, maxItems)) {
        const nextSize = result.content.length;
        if (selected.length > 0 && characterCount + nextSize > maxCharacters) {
          break;
        }

        selected.push({
          knowledgeId: result.knowledgeId,
          serviceId: result.serviceId,
          service: result.service,
          language: result.language,
          type: result.type,
          content: result.content,
          score: result.score,
          source: result.source || null,
        });
        characterCount += nextSize;
      }

      return {
        records: selected,
        text: selected
          .map((record) => formatRecord(record))
          .join("\n\n"),
      };
    },
  };
}

function formatRecord(record) {
  const source = record.source
    ? `Source: ${record.source.title}${record.source.reference ? ` (${record.source.reference})` : ""}`
    : "Source: unavailable";

  return `[${record.type}] ${record.content}\n${source}`;
}
