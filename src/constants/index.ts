import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const CREDENTIALS = process.env.CREDENTIALS === 'true';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const LOG_FORMAT = process.env.LOG_FORMAT || 'dev';
const LOG_DIR = process.env.LOG_DIR || '../logs';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

export { CREDENTIALS, NODE_ENV, PORT, JWT_SECRET, LOG_FORMAT, LOG_DIR, ORIGIN, MONGO_URI };
