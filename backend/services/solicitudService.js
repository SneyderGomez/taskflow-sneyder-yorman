import { Solicitud } from '../models/Solicitud.js';

export function buildSolicitudFromBody(body) {
  const { titulo, descripcion, categoria, prioridad } = body;
  return new Solicitud({ titulo, descripcion, categoria, prioridad });
}

export async function listarSolicitudes({ estado, categoria, prioridad, q } = {}) {
  const filtro = {};
  if (estado) filtro.estado = estado;
  if (categoria) filtro.categoria = categoria;
  if (prioridad) filtro.prioridad = prioridad;
  if (q) {
    filtro.$or = [
      { titulo: { $regex: q, $options: 'i' } },
      { descripcion: { $regex: q, $options: 'i' } }
    ];
  }
  return Solicitud.find(filtro).sort({ createdAt: -1 });
}

export async function obtenerSolicitudPorId(id) {
  return Solicitud.findById(id);
}

export async function contarPorEstados() {
  const [pendiente, enCola, procesando, respondida, error, total] = await Promise.all([
    Solicitud.countDocuments({ estado: 'PENDIENTE' }),
    Solicitud.countDocuments({ estado: 'EN COLA' }),
    Solicitud.countDocuments({ estado: 'PROCESANDO' }),
    Solicitud.countDocuments({ estado: 'RESPONDIDA' }),
    Solicitud.countDocuments({ estado: 'ERROR' }),
    Solicitud.countDocuments()
  ]);

  return {
    total,
    pendiente,
    enCola,
    procesando,
    respondida,
    error
  };
}

export async function eliminarSolicitud(id) {
  return Solicitud.findByIdAndDelete(id);
}

export async function cambiarActivo(id, activo) {
  return Solicitud.findByIdAndUpdate(
    id,
    { activo },
    { new: true }
  );
}