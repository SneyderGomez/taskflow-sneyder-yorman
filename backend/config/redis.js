import { createClient } from 'redis';
import { config } from './env.js';

export async function connectRedis() {
  const client = createClient({ url: config.redisUrl });

  client.on('error', (err) => {
    console.error('[Redis] Error:', err.message);
  });

  await client.connect();
  console.log('[Redis] Conectado a', config.redisUrl);
  return client;
}

export async function pingRedis(client) {
  try {
    const pong = await client.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}