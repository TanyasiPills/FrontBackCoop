import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  for (let i = 0; i < 10; i++) {
    await prisma.koncert.create({
        data: {
            name: faker.music.songName(),
            date: faker.date.future(),
            time: faker.number.int({min: 50, max: 150}),
            canceled: faker.datatype.boolean(),
        }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })