import mongooseConfig from '@config/mongoose';
import { redisConfig } from '@config/redis';
import indexRoute from '@routes/index.route';
import { logger } from '@utils/logger';
import * as http from 'http';

import expressConfig from './config/express';
import { NODE_ENV, PORT } from './constants';

const env = NODE_ENV || 'development';
const port = PORT || 3000;

process.on('uncaughtException', err => {
  logger.error(err);
  process.exit(1);
});

const startServer = async () => {
  mongooseConfig();
  redisConfig();

  const app = expressConfig([indexRoute]);
  const httpServ = http.createServer(app);

  httpServ.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`ENV: ${env}`);
    logger.info(`PORT: ${port}`);
    logger.info(`=================================`);
  });
};

startServer();
