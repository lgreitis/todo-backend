import { MONGO_URI } from '@constants';
import mongoose from 'mongoose';

const mongooseConfig = () => {
  return mongoose.connect(MONGO_URI);
};

export default mongooseConfig;
