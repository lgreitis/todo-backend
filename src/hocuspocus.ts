import hocuspocusConfig from '@config/hocuspocus';
import { NODE_ENV, PORT } from '@constants';
import { logger } from '@utils/logger';
import { prisma } from './config/prisma';

const startServer = async () => {
  const hocuspocusServer = hocuspocusConfig();

  await hocuspocusServer.listen(PORT);

  logger.info(`=================================`);
  logger.info(`SERVER: HOCUSPOCUS`);
  logger.info(`ENV: ${NODE_ENV}`);
  logger.info(`PORT: ${PORT}`);
  logger.info(`=================================`);
};

startServer()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });
