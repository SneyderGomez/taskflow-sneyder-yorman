import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: Number(process.env.PORT || 3000),
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/taskflow',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  cacheTtl: Number(process.env.CACHE_TTL || 60),
  queueName: process.env.QUEUE_NAME || 'taskflow:cola',
  eventsChannel: process.env.EVENTS_CHANNEL || 'taskflow:eventos',
  mongoReadyDelay: Number(process.env.MONGO_READY_DELAY || 3000),
  queuePollTimeout: Number(process.env.QUEUE_POLL_TIMEOUT || 5)
};