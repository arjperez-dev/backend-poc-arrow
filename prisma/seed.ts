import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { manualLevels } from './levels/manual-levels';

const prisma = new PrismaClient();

async function seedManualLevels(): Promise<void> {
  for (const level of manualLevels) {
    await prisma.level.upsert({
      where: { number: level.number },
      update: {
        name: level.name,
        difficulty: level.difficulty,
        generationType: 'manual',
        seed: null,
        definitionJson: level.definitionJson,
      },
      create: {
        number: level.number,
        name: level.name,
        difficulty: level.difficulty,
        generationType: 'manual',
        seed: null,
        definitionJson: level.definitionJson,
      },
    });
  }
}

async function seedOptionalAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.ADMIN,
      passwordHash,
    },
    create: {
      email,
      displayName: 'Demo Admin',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
}

async function main(): Promise<void> {
  await seedManualLevels();
  await seedOptionalAdmin();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
