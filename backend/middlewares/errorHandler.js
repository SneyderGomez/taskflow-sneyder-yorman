export function notFound(req, res) {
  res.status(404).json({ ok: false, mensaje: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
}

export function errorHandler(err, _req, res, _next) {
  if (err.name === 'CastError') {
    return res.status(400).json({ ok: false, mensaje: 'ID de solicitud inválido' });
  }
  console.error('[Backend] Error:', err);
  res.status(err.status || 500).json({
    ok: false,
    mensaje: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message
  });
}