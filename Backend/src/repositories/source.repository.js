const sourceSelect = {
  id: true,
  title: true,
  reference: true,
  url: true,
  type: true,
  authority: true,
  publicationDate: true,
  verificationNote: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
};

export function createSourceRepository(prisma) {
  return {
    async findById(id) {
      return prisma.source.findUnique({
        where: { id },
        select: sourceSelect,
      });
    },

    async findByReference(reference) {
      return prisma.source.findUnique({
        where: { reference },
        select: sourceSelect,
      });
    },

    async findMany({ take = 50, skip = 0, verifiedOnly = false } = {}) {
      return prisma.source.findMany({
        where: verifiedOnly ? { isVerified: true } : undefined,
        select: sourceSelect,
        orderBy: { updatedAt: "desc" },
        take,
        skip,
      });
    },

    async create(data) {
      return prisma.source.create({
        data,
        select: sourceSelect,
      });
    },

    async update(id, data) {
      return prisma.source.update({
        where: { id },
        data,
        select: sourceSelect,
      });
    },
  };
}
