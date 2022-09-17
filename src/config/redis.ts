import { logger } from '@utils/logger';
import * as redis from 'redis';

// TODO: add env connection address
const redisClient = redis.createClient();

const redisConfig = () => {
  redisClient.on('error', (err) => logger.error(err));

  return redisClient.connect();
};

export { redisClient, redisConfig };
