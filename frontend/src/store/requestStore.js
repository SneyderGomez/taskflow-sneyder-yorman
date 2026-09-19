import { defineStore } from 'pinia';
import * as requestService from '../services/requestService.js';

export const useRequestStore = defineStore('requests', {
  state: () => ({
    solicitudes: [],
    monitor: null,
    estadisticas: {
      total: 0,
      pendiente: 0,
      enCola: 0,
      procesando: 0,
      respondida: 0,
      error: 0
    },
    cargando: false,
    error: null,
    ultimaFuente: null,
    totalItems: 0,
    totalPaginas: 1,
    paginaActual: 1,
    porPagina: 10
  }),

  getters: {
    solicitudesRespondidas: (state) =>
      state.solicitudes.filter((s) => s.estado === 'RESPONDIDA').length,
    solicitudesPendientes: (state) =>
      state.solicitudes.filter((s) => s.estado === 'PENDIENTE').length
  },

  actions: {
    async cargarSolicitudes(filtros = {}) {
      this.cargando = true;
      this.error = null;
      try {
        const respuesta = await requestService.listarSolicitudes(filtros);
        this.solicitudes = respuesta.solicitudes;
        this.ultimaFuente = respuesta.fuente;
        this.totalItems = respuesta.total ?? this.solicitudes.length;
        this.totalPaginas = respuesta.totalPaginas ?? 1;
        this.paginaActual = respuesta.pagina ?? 1;
        this.porPagina = respuesta.porPagina ?? 10;
      } catch (err) {
        this.error = err.response?.data?.mensaje || 'Error al consultar solicitudes';
      } finally {
        this.cargando = false;
      }
    },

    async cargarMonitor() {
      this.error = null;
      try {
        const respuesta = await requestService.consultarMonitor();
        this.monitor = respuesta;
        if (respuesta.conteos) {
          this.estadisticas = respuesta.conteos;
        }
      } catch (err) {
        this.error = err.response?.data?.mensaje || 'Error al consultar el monitor';
      }
    },

    async registrarSolicitud(solicitud) {
      this.error = null;
      try {
        const respuesta = await requestService.crearSolicitud(solicitud);
        return { ok: true, solicitud: respuesta.solicitud };
      } catch (err) {
        const mensaje = err.response?.data?.errores?.join(' ') || err.response?.data?.mensaje || 'Error al registrar la solicitud';
        this.error = mensaje;
        return { ok: false, errores: err.response?.data?.errores || [mensaje] };
      }
    }
  }
});