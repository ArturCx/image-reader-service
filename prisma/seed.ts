import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const codes = Array.from({ length: 10 }, (_, i) => `customer-${i + 1}`);

async function main() {
  // criação de 10 customers para popular o banco de dados
  for (const code of codes) {
    await prisma.customer.upsert({
      where: {
        code,
      },
      create: {
        code,
      },
      update: {},
    });
  }

  console.log('Customers created');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
