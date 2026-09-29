import { createKnowledgeRepository } from "./knowledge.repository.js";
import { createServiceRepository } from "./service.repository.js";
import { createSourceRepository } from "./source.repository.js";
import { createUserRepository } from "./user.repository.js";

export function createPrismaRepository(prisma, options = {}) {
  const knowledgeRepository = createKnowledgeRepository(prisma, options);
  const serviceRepository = createServiceRepository(
    prisma,
    knowledgeRepository,
  );
  const sourceRepository = createSourceRepository(prisma);
  const userRepository = createUserRepository(prisma);

  return {
    findService: serviceRepository.findService,
    findServiceById: serviceRepository.findServiceById,
    findServices: serviceRepository.findServices,
    searchKeyword: knowledgeRepository.searchKeyword,
    searchSemantic: knowledgeRepository.searchSemantic,
    findByService: knowledgeRepository.findByService,
    findKnowledgeByService: knowledgeRepository.findByService,
    findActiveKnowledge: knowledgeRepository.findActive,
    findKnowledgeById: knowledgeRepository.findById,
    createKnowledge: knowledgeRepository.create,
    updateKnowledge: knowledgeRepository.update,
    findSourceById: sourceRepository.findById,
    findSourceByReference: sourceRepository.findByReference,
    findSources: sourceRepository.findMany,
    createSource: sourceRepository.create,
    updateSource: sourceRepository.update,
    createUser: userRepository.createUser,
    findUser: userRepository.findUser,
    saveRefreshToken: userRepository.saveRefreshToken,
    consumeRefreshToken: userRepository.consumeRefreshToken,
  };
}
