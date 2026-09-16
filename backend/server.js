import http from 'http';
import { config } from './config/env.js';
import { connectMongoDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import app from './app.js';
import { initSocket, emitEvent } from './socket/index.js';
import { setEmitter } from './controllers/solicitudController.js';

async function start() {
  global.redisClient = await connectRedis();

  await connectMongoDB();

  const server = http.createServer(app);
  const io = initSocket(server, { frontendUrl: config.frontendUrl });

  setEmitter(emitEvent);

  const subscriber = global.redisClient.duplicate();
  await subscriber.connect();

  subscriber.subscribe(config.eventsChannel, (message) => {
    try {
      const event = JSON.parse(message);
      emitEvent(event.evento, event.payload);
    } catch (err) {
      console.error('[Backend] Evento inválido:', err.message);
    }
  });

  server.listen(config.port, () => {
    console.log('[Backend] Servidor corriendo en http://localhost:' + config.port);
  });
}

start().catch((err) => {
  console.error('[Backend] No se pudo iniciar:', err.message);
  process.exit(1);
});