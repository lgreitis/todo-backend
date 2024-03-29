import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { URL } from 'node:url';
import { v4 } from 'uuid';

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);
  return url.toString();
};

const schemaId = `test-${v4()}`;
const prismaBinary = join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'prisma');

const url = generateDatabaseURL(schemaId);
process.env.DATABASE_URL = url;
export const prisma = new PrismaClient({
  datasources: { db: { url } },
});

beforeEach(() => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: generateDatabaseURL(schemaId),
    },
  });
});
afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
  await prisma.$disconnect();
});

// Some random workaround to BigInt in prisma
// Prisma... why are you like this?
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};
