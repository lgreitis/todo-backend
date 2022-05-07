import { logger } from '@utils/logger';
import * as redis from 'redis';

const redisClient = redis.createClient();

const redisConfig = () => {
  redisClient.on('error', err => logger.error(err));

  redisClient.connect().then(() => {
    logger.info('Redis connected');
  });
};

export { redisClient, redisConfig };
