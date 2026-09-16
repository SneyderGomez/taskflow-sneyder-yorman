import { config } from '../config/env.js';

export async function publishEvent(redisClient, evento, payload) {
  try {
    const message = JSON.stringify({ evento, payload });
    await redisClient.publish(config.eventsChannel, message);
  } catch (err) {
    console.error('[Worker] No se pudo publicar evento:', err.message);
  }
}