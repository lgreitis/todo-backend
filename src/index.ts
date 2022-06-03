import expressConfig from '@config/express';
import mongooseConfig from '@config/mongoose';
import { redisConfig } from '@config/redis';
import { NODE_ENV, PORT } from '@constants';
import { authRoute, indexRoute, userRoute } from '@routes';
import { logger } from '@utils/logger';
import * as http from 'http';

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

  const app = expressConfig([authRoute, userRoute, indexRoute]);
  const httpServ = http.createServer(app);

  httpServ.listen(PORT, () => {
    logger.info(`=================================`);
    logger.info(`ENV: ${NODE_ENV}`);
    logger.info(`PORT: ${PORT}`);
    logger.info(`=================================`);
  });
};

startServer();
