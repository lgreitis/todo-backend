import expressConfig from '@config/express';
// import hocuspocusConfig from '@config/hocuspocus';
import { NODE_ENV, PORT } from '@constants';
import {
  authRoute,
  indexRoute,
  userRoute,
  directoryRoute,
  organizationRoute,
  inviteRoute,
} from '@routes';
// import { serve } from 'swagger-ui-express';
import { logger } from '@utils/logger';
import * as http from 'node:http';
// import { serve } from 'swagger-ui-express';
import { prisma } from './config/prisma';

const startServer = async () => {
  const app = expressConfig([
    authRoute,
    userRoute,
    indexRoute,
    directoryRoute,
    organizationRoute,
    inviteRoute,
  ]);
  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    logger.info(`=================================`);
    logger.info(`SERVER: API`);
    logger.info(`ENV: ${NODE_ENV}`);
    logger.info(`PORT: ${PORT}`);
    logger.info(`=================================`);
  });
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
