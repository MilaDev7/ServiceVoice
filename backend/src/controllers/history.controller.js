import { prisma } from "../config/prisma.js";

export async function getChatHistory(
  req,
  res,
  next
) {
  try {
    const conversations =
      await prisma.conversation.findMany({
        where: {
          userId: req.user.id
        },

        orderBy: {
          updatedAt: "desc"
        },

        include: {
          messages: {
            orderBy: {
              createdAt: "asc"
            },

            take: 100
          }
        }
      });

    return res.json({
      success: true,

      data: {
        conversations
      }
    });
  } catch (error) {
    next(error);
  }
}