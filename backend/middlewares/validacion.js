import { CATEGORIAS, PRIORIDADES } from '../models/Solicitud.js';

export function validarSolicitud(req, res, next) {
  const { titulo, descripcion, categoria, prioridad } = req.body;

  const errores = [];

  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    errores.push('El título es obligatorio.');
  } else if (titulo.trim().length < 3) {
    errores.push('El título debe tener al menos 3 caracteres.');
  }

  if (!descripcion || typeof descripcion !== 'string' || !descripcion.trim()) {
    errores.push('La descripción es obligatoria.');
  } else if (descripcion.trim().length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres.');
  }

  if (!categoria || !CATEGORIAS.includes(categoria)) {
    errores.push(`La categoría debe ser una de: ${CATEGORIAS.join(', ')}.`);
  }

  if (!prioridad || !PRIORIDADES.includes(prioridad)) {
    errores.push(`La prioridad debe ser una de: ${PRIORIDADES.join(', ')}.`);
  }

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, errores });
  }

  next();
}