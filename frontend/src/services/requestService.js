import http from '../plugins/axios.js';

export async function listarSolicitudes(filtros = {}) {
  const params = Object.fromEntries(
    Object.entries(filtros).filter(([, v]) => v !== undefined && v !== null && v !== '')
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

export async function cambiarActivoSolicitud(id, activo) {
  const { data } = await http.patch(`/solicitudes/${id}/activo`, { activo });
  return data;
}

export async function consultarMonitor() {
  const { data } = await http.get('/monitor');
  return data;
}

export async function enviarLotePrueba(cantidad) {
  const categorias = ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'];
  const prioridades = ['Alta', 'Media', 'Baja'];
  const resultados = [];

  let cursor = 0;
  const trabajadores = Array.from({ length: Math.min(10, cantidad) }, async () => {
    while (cursor < cantidad) {
      const i = cursor++;
      try {
        const res = await crearSolicitud({
          titulo: `Solicitud de prueba ${i + 1}`,
          descripcion: `Solicitud de prueba de carga generada automáticamente ${i + 1}`,
          categoria: categorias[i % categorias.length],
          prioridad: prioridades[i % prioridades.length]
        });
        resultados.push({ ok: true, ...res.solicitud });
      } catch (err) {
        resultados.push({ ok: false, error: err.response?.data?.mensaje || 'Error' });
      }
    }
  });

  await Promise.all(trabajadores);
  return resultados;
}