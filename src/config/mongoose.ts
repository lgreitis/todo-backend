import { MONGO_URI } from '@constants';
import { logger } from '@utils/logger';
import mongoose from 'mongoose';

const mongooseConfig = () => {
  mongoose.connect(MONGO_URI).then(() => {
    logger.info('MongoDB connected');
  });
};

export default mongooseConfig;
