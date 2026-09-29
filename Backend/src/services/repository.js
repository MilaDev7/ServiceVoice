import crypto from "node:crypto";
import bcrypt from "bcrypt";

const services = [
  {
    id: "service-marriage",
    slug: "marriage-certificate",
    category: "CIVIL_STATUS",
    nameEn: "Marriage certificate",
    nameAm: "የጋብቻ ምስክር ወረቀት",
    nameOm: "Ragaa gaa'elaa",
    nameTi: "ናይ መርዓ ምስክር ወረቐት",
    descriptionEn: "Register and obtain a marriage certificate.",
    descriptionAm: "የጋብቻ ምስክር ወረቀት ማግኘት።",
    descriptionOm: "Ragaa gaa'elaa galmeessuu fi argachuu.",
    descriptionTi: "ናይ መርዓ ምስክር ወረቐት ምርካብ።",
    translations: { en: "Marriage certificate", am: "የጋብቻ ምስክር ወረቀት", om: "Ragaa gaa'elaa", ti: "ናይ መርዓ ምስክር ወረቐት" },
    requirements: [
      { nameEn: "National ID", nameAm: "ብሔራዊ መታወቂያ", nameOm: "Waraqaa eenyummaa", nameTi: "መንነት መለለዪ" },
      { nameEn: "Two witnesses", nameAm: "ሁለት ምስክሮች", nameOm: "Ragoota lama", nameTi: "ክልተ ምስክሮች" },
    ],
    source: { type: "REGULATION", title: "Civil Registration Regulation", reference: "CR-2024-01" },
    relatedServices: ["birth-certificate"],
  },
  {
    id: "service-birth",
    slug: "birth-certificate",
    category: "VITAL_RECORD",
    nameEn: "Birth certificate",
    nameAm: "የልደት ምስክር ወረቀት",
    nameOm: "Ragaa dhalootaa",
    nameTi: "ናይ ልደት ምስክር ወረቐት",
    descriptionEn: "Register a birth and obtain a certificate.",
    descriptionAm: "ልደት መመዝገብ እና ምስክር ወረቀት ማግኘት።",
    descriptionOm: "Dhaloota galmeessuu fi ragaa argachuu.",
    descriptionTi: "ልደት ምምዝጋብን ምስክር ወረቐት ምርካብን።",
    translations: { en: "Birth certificate", am: "የልደት ምስክር ወረቀት", om: "Ragaa dhalootaa", ti: "ናይ ልደት ምስክር ወረቐት" },
    requirements: [{ nameEn: "Birth notification", nameAm: "የልደት ማስታወቂያ", nameOm: "Beeksisa dhalootaa", nameTi: "መፍለጢ ልደት" }],
    source: { type: "REGULATION", title: "Vital Records Regulation", reference: "VR-2024-02" },
    relatedServices: [],
  },
];

export function createRepository(seed = services) {
  const users = [];
  const refreshTokens = new Map();
  return {
    services: seed,
    async findServices(query = "") {
      const normalized = query.toLocaleLowerCase();
      const matches = seed.filter((service) => [service.slug, service.nameEn, service.nameAm, service.nameOm, service.nameTi, service.descriptionEn].some((value) => value.toLocaleLowerCase().includes(normalized)));

      return matches.length ? matches : seed;
    },
    async findService(slug) { return seed.find((service) => service.slug === slug) || null; },
    async findByService({ serviceId, language, type }) {
      const service = seed.find((item) => item.id === serviceId);
      if (!service) {
        return [];
      }

      const suffix = language === "en"
        ? "En"
        : language === "am"
          ? "Am"
          : language === "om"
            ? "Om"
            : "Ti";

      return service.requirements
        .map((requirement, index) => ({
          id: `${service.id}-requirement-${index}`,
          serviceId,
          language,
          type: "REQUIREMENT",
          content: requirement[`name${suffix}`],
          source: service.source || null,
        }))
        .filter((knowledge) => !type || knowledge.type === type);
    },
    async searchKeyword({ query, language, take = 10 }) {
      const normalizedQuery = normalizeText(query);
      const queryTerms = normalizedQuery.split(" ").filter(Boolean);
      const results = [];

      for (const service of seed) {
        const serviceText = [
          service.slug,
          service.nameEn,
          service.nameAm,
          service.nameOm,
          service.nameTi,
          service.descriptionEn,
          service.descriptionAm,
          service.descriptionOm,
          service.descriptionTi,
        ].join(" ");

        for (const [index, requirement] of service.requirements.entries()) {
          const content = requirement[`name${language === "en" ? "En" : language === "am" ? "Am" : language === "om" ? "Om" : "Ti"}`];
          const searchableText = normalizeText(`${serviceText} ${content}`);
          const searchableTerms = searchableText.split(" ");
          const matchedTerms = queryTerms.filter((term) => searchableTerms.some((searchableTerm) => (
            searchableTerm.includes(term)
            || term.includes(searchableTerm)
          )));
          const score = queryTerms.length ? matchedTerms.length / queryTerms.length : 0;

          if (score > 0) {
            results.push({
              knowledgeId: `${service.id}-requirement-${index}`,
              serviceId: service.id,
              service,
              language,
              type: "REQUIREMENT",
              content,
              keywordScore: score,
              source: service.source || null,
            });
          }
        }
      }

      return results
        .sort((left, right) => right.keywordScore - left.keywordScore)
        .slice(0, take);
    },
    async searchSemantic() {
      const error = new Error("Vector search is not configured");
      error.code = "VECTOR_SEARCH_NOT_CONFIGURED";
      error.statusCode = 503;
      throw error;
    },
    async createUser({ email, password }) {
      if (users.some((user) => user.email === email)) { const error = new Error("Email already registered"); error.statusCode = 409; throw error; }
      const user = { id: crypto.randomUUID(), email, passwordHash: await bcrypt.hash(password, 10) };
      users.push(user);
      return { id: user.id, email: user.email };
    },
    async findUser(email) { return users.find((user) => user.email === email) || null; },
    async saveRefreshToken(token, userId, expiresAt) { refreshTokens.set(token, { userId, expiresAt }); },
    async consumeRefreshToken(token) { const record = refreshTokens.get(token); refreshTokens.delete(token); return record || null; },
  };
}

function normalizeText(value) {
  return value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.length > 5 ? word.slice(0, -2) : word)
    .join(" ");
}
