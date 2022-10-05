import expressConfig from '@config/express';
import { NODE_ENV, PORT } from '@constants';
import { authRoute, indexRoute, userRoute, directoryRoute } from '@routes';
import { logger } from '@utils/logger';
import * as http from 'http';
import organizationRoute from 'routes/organization.route';
import { prisma } from './config/prisma';

const startServer = async () => {
  const app = expressConfig([authRoute, userRoute, indexRoute, directoryRoute, organizationRoute]);
  const httpServ = http.createServer(app);

  httpServ.listen(PORT, () => {
    logger.info(`=================================`);
    logger.info(`ENV: ${NODE_ENV}`);
    logger.info(`PORT: ${PORT}`);
    logger.info(`=================================`);
  });
};

startServer()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
