import { computed } from 'vue';

export function formatoFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function textoEstado(estado) {
  const mapa = {
    'PENDIENTE': 'Pendiente',
    'EN COLA': 'En cola',
    'PROCESANDO': 'Procesando',
    'RESPONDIDA': 'Respondida',
    'ERROR': 'Error'
  };
  return mapa[estado] || estado;
}

export function classEstado(estado) {
  return 'estado-' + (estado || '').toLowerCase().replace(/\s+/g, '-');
}