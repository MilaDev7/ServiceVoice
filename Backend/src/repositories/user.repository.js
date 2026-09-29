import crypto from "node:crypto";
import bcrypt from "bcrypt";

export function createUserRepository(prisma) {
  return {
    async createUser({ email, password }) {
      try {
        const user = await prisma.user.create({
          data: {
            email,
            passwordHash: await bcrypt.hash(password, 10),
          },
          select: {
            id: true,
            email: true,
            role: true,
          },
        });

        return user;
      } catch (error) {
        if (error.code === "P2002") {
          const conflict = new Error("Email already registered");
          conflict.statusCode = 409;
          conflict.code = "EMAIL_ALREADY_REGISTERED";
          throw conflict;
        }
        throw error;
      }
    },

    async findUser(email) {
      return prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          role: true,
          passwordHash: true,
        },
      });
    },

    async saveRefreshToken(token, userId, expiresAt) {
      return prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt: new Date(expiresAt),
        },
        select: {
          id: true,
          token: true,
          userId: true,
          expiresAt: true,
        },
      });
    },

    async consumeRefreshToken(token) {
      return prisma.$transaction(async (transaction) => {
        const storedToken = await transaction.refreshToken.findUnique({
          where: { token },
          select: {
            id: true,
            userId: true,
            expiresAt: true,
          },
        });

        if (!storedToken) {
          return null;
        }

        await transaction.refreshToken.delete({
          where: { id: storedToken.id },
        });

        return {
          userId: storedToken.userId,
          expiresAt: storedToken.expiresAt.getTime(),
        };
      });
    },
  };
}

export function createRefreshTokenId() {
  return crypto.randomUUID();
}
