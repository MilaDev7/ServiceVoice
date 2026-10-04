import { prisma } from "../config/prisma.js";

export async function getOrCreateConversation(
  conversationId,
  language
) {
  if (conversationId) {
    const conversation =
      await prisma.conversation.findUnique({
        where: {
          id: conversationId
        }
      });

    if (conversation) {
      return conversation;
    }
  }

  return prisma.conversation.create({
    data: {
      language
    }
  });
}

export async function getConversationHistory(
  conversationId
) {
  return prisma.message.findMany({
    where: {
      conversationId
    },

    orderBy: {
      createdAt: "asc"
    },

    take: 20
  });
}

export async function saveMessage({
  conversationId,
  role,
  content
}) {
  return prisma.message.create({
    data: {
      conversationId,

      role,

      content
    }
  });
}