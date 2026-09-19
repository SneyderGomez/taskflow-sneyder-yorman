import http from '../plugins/axios.js';

export async function listarSolicitudes(filtros = {}) {
  const params = Object.fromEntries(
    Object.entries(filtros).filter(([, v]) => v)
  );
  const { data } = await http.get('/solicitudes', { params });
  return data;
}

export async function obtenerSolicitud(id) {
  const { data } = await http.get(`/solicitudes/${id}`);
  return data;
}

export async function crearSolicitud(solicitud) {
  const { data } = await http.post('/solicitudes', solicitud);
  return data;
}

export async function eliminarSolicitud(id) {
  const { data } = await http.delete(`/solicitudes/${id}`);
  return data;
}

export async function consultarMonitor() {
  const { data } = await http.get('/monitor');
  return data;
}