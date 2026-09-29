const serviceSummary = {
  id: true,
  slug: true,
  nameEn: true,
  nameAm: true,
  nameOm: true,
  nameTi: true,
  descriptionEn: true,
  descriptionAm: true,
  descriptionOm: true,
  descriptionTi: true,
  category: true,
  isActive: true,
};

const knowledgeSelection = {
  id: true,
  language: true,
  type: true,
  content: true,
  publicationStatus: true,
  indexingStatus: true,
  isActive: true,
  source: {
    select: {
      id: true,
      title: true,
      reference: true,
      url: true,
      type: true,
      authority: true,
      isVerified: true,
    },
  },
};

export function createServiceRepository(prisma, knowledgeRepository) {
  return {
    async findService(slug, { language } = {}) {
      const service = await prisma.service.findFirst({
        where: {
          slug,
          isActive: true,
        },
        select: serviceSummary,
      });

      if (!service) {
        return null;
      }

      return addKnowledge(service, await knowledgeRepository.findByService({
        serviceId: service.id,
        language,
      }));
    },

    async findServiceById(id, { language } = {}) {
      const service = await prisma.service.findFirst({
        where: {
          id,
          isActive: true,
        },
        select: serviceSummary,
      });

      if (!service) {
        return null;
      }

      return addKnowledge(service, await knowledgeRepository.findByService({
        serviceId: service.id,
        language,
      }));
    },

    async findServices(query = "", { language } = {}) {
      const normalizedQuery = query.trim();
      const where = {
        isActive: true,
        ...(normalizedQuery
          ? {
              OR: [
                { slug: { contains: normalizedQuery, mode: "insensitive" } },
                { nameEn: { contains: normalizedQuery, mode: "insensitive" } },
                { nameAm: { contains: normalizedQuery, mode: "insensitive" } },
                { nameOm: { contains: normalizedQuery, mode: "insensitive" } },
                { nameTi: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionEn: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionAm: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionOm: { contains: normalizedQuery, mode: "insensitive" } },
                { descriptionTi: { contains: normalizedQuery, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const services = await prisma.service.findMany({
        where,
        select: serviceSummary,
        orderBy: { nameEn: "asc" },
        take: 50,
      });

      return Promise.all(
        services.map(async (service) => addKnowledge(
          service,
          await knowledgeRepository.findByService({
            serviceId: service.id,
            language,
          }),
        )),
      );
    },
  };
}

function addKnowledge(service, knowledgeUnits) {
  const requirements = knowledgeUnits
    .filter((knowledge) => knowledge.type === "REQUIREMENT")
    .map((knowledge) => ({
      nameEn: knowledge.content,
      nameAm: knowledge.content,
      nameOm: knowledge.content,
      nameTi: knowledge.content,
      language: knowledge.language,
    }));

  const source = knowledgeUnits.find((knowledge) => knowledge.source)?.source || null;

  return {
    ...service,
    requirements,
    source,
    knowledgeUnits,
  };
}

export { knowledgeSelection };
