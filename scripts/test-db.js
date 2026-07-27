import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to Neon PostgreSQL database via Prisma...');
  const count = await prisma.student.count();
  console.log('Successfully connected! Current Student count:', count);
}

main()
  .catch((e) => {
    console.error('Error connecting to database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
