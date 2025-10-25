import {prisma} from '../db/client';

export const userRepository = {
  create: (data: { name: string; email: string; passwordHash: string }) => {
    return prisma.user.create({
      data,
    });
  },

  findById: (id: number) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};