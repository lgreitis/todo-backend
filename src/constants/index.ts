import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const CREDENTIALS = process.env.CREDENTIALS === 'true';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number.parseInt(process.env.PORT ?? '3000');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const LOG_FORMAT = process.env.LOG_FORMAT || 'dev';
const LOG_DIR = process.env.LOG_DIR || '../../logs';
const ORIGIN = process.env.ORIGIN || '*';
const DATABASE_URL = process.env.DATABASE_URL || '';

export { CREDENTIALS, NODE_ENV, PORT, JWT_SECRET, LOG_FORMAT, LOG_DIR, ORIGIN, DATABASE_URL };
