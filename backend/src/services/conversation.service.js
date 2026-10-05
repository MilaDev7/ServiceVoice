import { prisma } from "../config/prisma.js";

export async function getOrCreateConversation({
  conversationId,
  language,
  userId = null
}) {
  /*
   * GUEST
   *
   * Do not create a database conversation.
   */
  if (!userId) {
    return {
      id: null,
      language,
      userId: null,
      isPersistent: false
    };
  }

  /*
   * AUTHENTICATED USER
   *
   * Reuse the conversation only if it
   * belongs to this exact user.
   */
  if (conversationId) {
    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId
        }
      });

    if (conversation) {
      return {
        ...conversation,
        isPersistent: true
      };
    }
  }

  const conversation =
    await prisma.conversation.create({
      data: {
        language,
        userId
      }
    });

  return {
    ...conversation,
    isPersistent: true
  };
}

export async function getConversationHistory(
  conversationId,
  userId
) {
  if (!conversationId || !userId) {
    return [];
  }

  /*
   * Security:
   *
   * Verify that the conversation belongs
   * to the authenticated user.
   */
  const conversation =
    await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId
      }
    });

  if (!conversation) {
    return [];
  }

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
  content,
  userId
}) {
  /*
   * Guest conversations are not persisted.
   */
  if (!conversationId || !userId) {
    return null;
  }

  /*
   * Make sure the conversation belongs
   * to the authenticated user.
   */
  const conversation =
    await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId
      }
    });

  if (!conversation) {
    throw new Error(
      "Conversation does not belong to the authenticated user."
    );
  }

  return prisma.message.create({
    data: {
      conversationId,
      role,
      content
    }
  });
}