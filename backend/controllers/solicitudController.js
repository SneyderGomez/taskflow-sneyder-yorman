import * as solicitudService from '../services/solicitudService.js';
import * as redisService from '../services/redisService.js';
import { listKey } from '../services/redisService.js';

let _emit = () => null;

export function setEmitter(emitter) {
  _emit = emitter;
}

export async function listar(req, res, next) {
  try {
    const params = {
      estado: req.query.estado,
      categoria: req.query.categoria,
      prioridad: req.query.prioridad,
      q: req.query.q
    };

    const { redis } = req;
    const cacheKey = listKey('solicitudes', params);

    const cached = await redisService.getFromCache(redis, cacheKey);
    if (cached) {
      return res.json({ ok: true, fuente: 'CACHE HIT', solicitudes: cached });
    }

    const solicitudes = await solicitudService.listarSolicitudes(params);
    await redisService.setInCache(redis, cacheKey, solicitudes);

    res.json({ ok: true, fuente: 'CACHE MISS', solicitudes });
  } catch (err) {
    next(err);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    const { redis } = req;
    const cacheKey = listKey('solicitudes', { id: req.params.id });

    const cached = await redisService.getFromCache(redis, cacheKey);
    if (cached) {
      return res.json({ ok: true, fuente: 'CACHE HIT', solicitud: cached });
    }

    const solicitud = await solicitudService.obtenerSolicitudPorId(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    await redisService.setInCache(redis, cacheKey, solicitud);
    res.json({ ok: true, fuente: 'CACHE MISS', solicitud });
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const solicitud = await solicitudService.buildSolicitudFromBody(req.body);

    solicitud.estado = 'PENDIENTE';
    await solicitud.save();

    const encolada = await redisService.pushToQueue(req.redis, solicitud.id);
    if (encolada) {
      solicitud.estado = 'EN COLA';
      await solicitud.save();
      _emit('solicitud-encolada', { solicitudId: solicitud.id, estado: 'EN COLA' });
    }

    _emit('solicitud-creada', { solicitudId: solicitud.id, estado: solicitud.estado });

    await redisService.deleteFromCache(req.redis, listKey('solicitudes'));

    res.status(201).json({ ok: true, solicitud });
  } catch (err) {
    next(err);
  }
}

export async function cambiarActivo(req, res, next) {
  try {
    const { activo } = req.body;
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ ok: false, mensaje: 'El campo "activo" debe ser booleano' });
    }

    const solicitud = await solicitudService.cambiarActivo(req.params.id, activo);
    if (!solicitud) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    await redisService.deleteFromCache(req.redis, listKey('solicitudes'));
    await redisService.deleteFromCache(req.redis, listKey('solicitudes', { id: req.params.id }));

    res.json({ ok: true, solicitud });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    const result = await solicitudService.eliminarSolicitud(req.params.id);
    if (!result) {
      return res.status(404).json({ ok: false, mensaje: 'Solicitud no encontrada' });
    }

    await redisService.deleteFromCache(req.redis, listKey('solicitudes'));
    await redisService.deleteFromCache(req.redis, listKey('solicitudes', { id: req.params.id }));

    res.json({ ok: true, mensaje: 'Solicitud eliminada' });
  } catch (err) {
    next(err);
  }
}