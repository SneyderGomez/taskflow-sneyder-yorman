import { config } from '../config/env.js';
import { publishEvent } from './eventosWorker.js';
import { Solicitud } from '../models/Solicitud.js';
import { generarRespuesta } from '../services/respuestaService.js';
import * as redisService from '../services/redisService.js';
import { listKey } from '../services/redisService.js';

const QUEUE = config.queueName;
const POLL_TIMEOUT = config.queuePollTimeout;

async function limpiarCacheSolicitud(redisClient, requestId) {
  await redisService.deleteFromCache(redisClient, listKey('solicitudes'));
  await redisService.deleteFromCache(redisClient, listKey('solicitudes', { id: requestId }));
}

export async function procesarSolicitud(redisClient, requestId) {
  const solicitud = await Solicitud.findById(requestId);
  if (!solicitud) {
    console.warn('[Worker] Solicitud no encontrada:', requestId);
    return;
  }

  try {
    solicitud.estado = 'PROCESANDO';
    await solicitud.save();
    console.log(`[Worker] Procesando ${solicitud.id} (${solicitud.categoria})`);
    await limpiarCacheSolicitud(redisClient, solicitud.id);
    await publishEvent(redisClient, 'solicitud-procesando', {
      solicitudId: solicitud.id,
      estado: 'PROCESANDO'
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    solicitud.respuesta = generarRespuesta(solicitud.categoria);
    solicitud.fechaProcesamiento = new Date();
    solicitud.estado = 'RESPONDIDA';
    solicitud.error = null;
    await solicitud.save();

    console.log(`[Worker] Respondida ${solicitud.id}`);
    await limpiarCacheSolicitud(redisClient, solicitud.id);
    await publishEvent(redisClient, 'solicitud-respondida', {
      solicitudId: solicitud.id,
      estado: 'RESPONDIDA'
    });
  } catch (err) {
    console.error(`[Worker] Error procesando ${solicitud.id}:`, err.message);

    solicitud.estado = 'ERROR';
    solicitud.error = err.message;
    await solicitud.save();

    await limpiarCacheSolicitud(redisClient, solicitud.id);
    await publishEvent(redisClient, 'solicitud-error', {
      solicitudId: solicitud.id,
      estado: 'ERROR'
    });
  }
}

export async function runWorker(redisClient) {
  console.log(`[Worker] Escuchando cola "${QUEUE}"...`);

  while (true) {
    try {
      const result = await redisClient.brPop(QUEUE, POLL_TIMEOUT);
      if (!result) continue;

      const requestId = result.element;
      console.log(`[Worker] Solicitud obtenida de la cola: ${requestId}`);
      await procesarSolicitud(redisClient, requestId);
    } catch (err) {
      console.error('[Worker] Error en el bucle de la cola:', err.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}