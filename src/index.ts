import expressConfig from '@config/express';
import mongooseConfig from '@config/mongoose';
import { redisConfig } from '@config/redis';
import socketConfig from '@config/socket';
import { NODE_ENV, PORT } from '@constants';
import { authRoute, indexRoute, nbaRoute, userRoute } from '@routes';
import { logger } from '@utils/logger';
import * as http from 'http';

import { initFetch } from './services/nba.service';

const env = NODE_ENV || 'development';
const port = PORT || 3000;

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});

const startServer = async () => {
  logger.info(`=================================`);
  await mongooseConfig().then(() => {
    logger.info('MongoDB connected');
  });
  await redisConfig().then(() => {
    logger.info('Redis connected');
  });

  const app = expressConfig([authRoute, userRoute, nbaRoute, indexRoute]);
  const httpServ = http.createServer(app);

  socketConfig(httpServ);

  // initFetch();

  httpServ.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`ENV: ${env}`);
    logger.info(`PORT: ${port}`);
    logger.info(`=================================`);
  });
};

startServer();
