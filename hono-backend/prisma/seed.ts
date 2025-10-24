import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  // Hapus data sebelumnya (opsional)
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  // Buat user demo
  const hashedPassword = await hashPassword('P@ssw0rd!');
  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@example.com',
      passwordHash: hashedPassword,
    },
  });

  // Buat beberapa post demo
  await prisma.post.createMany({
    data: [
      {
        title: 'First Post',
        content: 'This is the content of the first post.',
        authorId: demoUser.id,
      },
      {
        title: 'Second Post',
        content: 'This is the content of the second post.',
        authorId: demoUser.id,
      },
      {
        title: 'Third Post',
        content: 'This is the content of the third post.',
        authorId: demoUser.id,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });