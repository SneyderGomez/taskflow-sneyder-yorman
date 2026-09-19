import { ref } from 'vue';
import * as requestService from '../services/requestService.js';
import { useRequestStore } from '../store/requestStore.js';

export function useRequests() {
  const cargando = ref(false);
  const error = ref(null);
  const store = useRequestStore();

  async function cargar(filtros = {}) {
    cargando.value = true;
    error.value = null;
    try {
      const respuesta = await requestService.listarSolicitudes(filtros);
      store.solicitudes = respuesta.solicitudes;
      store.ultimaFuente = respuesta.fuente;
      return respuesta;
    } catch (err) {
      error.value = 'Error al consultar las solicitudes';
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  async function obtener(id) {
    cargando.value = true;
    error.value = null;
    try {
      return await requestService.obtenerSolicitud(id);
    } catch (err) {
      error.value = 'Error al consultar la solicitud';
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  async function crear(solicitud) {
    cargando.value = true;
    error.value = null;
    try {
      return await requestService.crearSolicitud(solicitud);
    } catch (err) {
      error.value = err.response?.data?.errores?.join(' ') || 'Error al registrar la solicitud';
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  async function eliminar(id) {
    cargando.value = true;
    error.value = null;
    try {
      return await requestService.eliminarSolicitud(id);
    } catch (err) {
      error.value = 'Error al eliminar la solicitud';
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  async function cargarMonitor() {
    cargando.value = true;
    error.value = null;
    try {
      const resp = await requestService.consultarMonitor();
      store.monitor = resp;
      if (resp.conteos) store.estadisticas = resp.conteos;
      return resp;
    } catch (err) {
      error.value = 'Error al consultar el monitor';
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  return { cargando, error, cargar, obtener, crear, eliminar, cargarMonitor };
}