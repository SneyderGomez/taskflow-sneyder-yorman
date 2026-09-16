import { isMongoConnected, pingMongo } from '../config/db.js';
import { pingRedis } from '../config/redis.js';
import * as solicitudService from '../services/solicitudService.js';
import * as redisService from '../services/redisService.js';

export async function monitor(req, res, next) {
  try {
    const [mongo, redis] = await Promise.all([
      pingMongo(),
      pingRedis(req.redis)
    ]);

    const conteos = await solicitudService.contarPorEstados();

    const [cola, procesando] = await Promise.all([
      redisService.getQueueLength(req.redis),
      Promise.resolve(conteos.procesando)
    ]);

    res.json({
      ok: true,
      servicios: {
        express: true,
        mongoDB: mongo,
        redis: redis
      },
      cola,
      procesando,
      respondidas: conteos.respondida,
      errores: conteos.error,
      conteos
    });
  } catch (err) {
    next(err);
  }
}