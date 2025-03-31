const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'yoru.yarns@gmail.com' },
  });

  if (!existing) {
    const passwordHash = await bcrypt.hash('Woah!ThisWorks_556', 10);

    await prisma.user.create({
      data: {
        name: 'Support Admin',
        email: 'yoru.yarns@gmail.com',
        passwordHash,
        role: 'SUPPORT',
      },
    });

    console.log('Support user created');
  } else {
    console.log('Support user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
