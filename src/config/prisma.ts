import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // log: [
  //   {
  //     emit: 'event',
  //     level: 'query',
  //   },
  // ],
});

// prisma.$on('query', async (e) => {
//   console.log(`${e.query} ${e.params}`);
// });

// Some random workaround to BigInt in prisma
// Prisma... why are you like this?
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};
