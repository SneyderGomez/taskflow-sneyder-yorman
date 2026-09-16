import { config } from '../config/env.js';
import { connectRedis } from '../config/redis.js';
import { connectMongoDB } from '../config/db.js';
import { runWorker } from './worker.js';

async function main() {
  const redisClient = await connectRedis();

  await connectMongoDB();

  await runWorker(redisClient);
}

main().catch((err) => {
  console.error('[Worker] No se pudo iniciar:', err.message);
  process.exit(1);
});