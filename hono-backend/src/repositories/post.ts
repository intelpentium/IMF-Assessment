import prisma from './client';

interface FindAllOptions {
  page: number;
  limit: number;
  includeAuthor?: boolean;
}

interface CreatePostData {
  title: string;
  content: string;
  authorId: number;
}

interface UpdatePostData {
  title?: string;
  content?: string;
}

export const postRepository = {
  findAll: async (options: FindAllOptions) => {
    const { page, limit, includeAuthor = false } = options;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: includeAuthor,
        },
      }),
      prisma.post.count(),
    ]);

    return {
      posts,
      total,
    };
  },

  findById: (id: number, options?: { includeAuthor?: boolean }) => {
    const includeAuthor = options?.includeAuthor ?? false;
    
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: includeAuthor,
      },
    });
  },

  create: (data: CreatePostData) => {
    return prisma.post.create({
      data,
    });
  },

  update: (id: number, data: UpdatePostData) => {
    return prisma.post.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return prisma.post.delete({
      where: { id },
    });
  },
};