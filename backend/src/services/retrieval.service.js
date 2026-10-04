import { prisma } from "../config/prisma.js";

function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreService(service, question, language) {
  const questionWords = normalize(question);

  const languagePhrases = service.phrases
    .filter((phrase) => phrase.language === language)
    .map((phrase) => phrase.phrase);

  const allSearchable = [
    service.name,
    service.slug,
    service.description || "",

    ...service.phrases.map(
      (phrase) => phrase.phrase
    ),

    ...languagePhrases,

    ...service.requirements.map(
      (item) => item.title
    ),

    ...service.requirements.map(
      (item) => item.description || ""
    ),

    ...service.instructions.map(
      (item) => item.title
    ),

    ...service.instructions.map(
      (item) => item.content
    )
  ];

  const searchableWords = new Set(
    normalize(allSearchable.join(" "))
  );

  let score = 0;

  for (const word of questionWords) {
    if (searchableWords.has(word)) {
      score += 1;
    }
  }

  const nameWords = normalize(service.name);

  for (const word of questionWords) {
    if (nameWords.includes(word)) {
      score += 5;
    }
  }

  for (const phrase of languagePhrases) {
    const phraseWords = normalize(phrase);

    const matches = phraseWords.filter(
      (word) => questionWords.includes(word)
    );

    score += matches.length * 4;
  }

  return score;
}

export async function retrieveServiceContext(
  question,
  language
) {
  const services =
    await prisma.service.findMany({
      where: {
        isActive: true
      },

      include: {
        requirements: {
          orderBy: {
            sortOrder: "asc"
          }
        },

        instructions: {
          orderBy: {
            sortOrder: "asc"
          }
        },

        phrases: {
          orderBy: {
            sortOrder: "asc"
          }
        }
      }
    });

  if (!services.length) {
    return {
      service: null,
      context:
        "No service information is currently available."
    };
  }

  const ranked = services
    .map((service) => ({
      service,
      score: scoreService(
        service,
        question,
        language
      )
    }))
    .sort(
      (a, b) => b.score - a.score
    );

  const best = ranked[0];

  if (!best || best.score <= 0) {
    return {
      service: null,
      context:
        "No matching service was found in the available ServiceVoice information."
    };
  }

  const service = best.service;

  const languagePhrases =
    service.phrases.filter(
      (phrase) =>
        phrase.language === language
    );

const context = `
SERVICE INFORMATION

Service name:
${service.name}

Service description:
${service.description || "Not provided"}

REQUIREMENTS

${
  service.requirements.length
    ? service.requirements
        .map(
          (item, index) => `
Requirement ${index + 1}
Title: ${item.title}
Description: ${item.description || "No additional description provided."}
`
        )
        .join("\n")
    : "No requirements are stored."
}

INSTRUCTIONS

${
  service.instructions.length
    ? service.instructions
        .map(
          (item, index) => `
Instruction ${index + 1}
Title: ${item.title}
Content: ${item.content}
`
        )
        .join("\n")
    : "No instructions are stored."
}

KNOWN PHRASES

${
  languagePhrases.length
    ? languagePhrases
        .map(
          (item) => `Phrase: ${item.phrase}`
        )
        .join("\n")
    : "No phrase is stored for the selected language."
}
`;

  console.log(
    "RETRIEVED SERVICE:",
    service.slug
  );

  console.log(
    "RETRIEVAL LANGUAGE:",
    language
  );

  console.log(
    "RETRIEVAL SCORE:",
    best.score
  );

  return {
    service,
    context
  };
}