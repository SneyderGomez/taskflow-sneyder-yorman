<template>
  <div class="detail">
    <div v-if="cargando" class="card text-center muted">Cargando solicitud...</div>

    <div v-else-if="error" class="card text-center">
      <p class="error-color">{{ error }}</p>
      <RouterLink to="/solicitudes" class="btn btn-secondary mt-2">Volver al listado</RouterLink>
    </div>

    <div v-else-if="solicitud" class="grid detail-grid">
      <div class="card">
        <div class="detail-header">
          <h2 class="detail-id">Solicitud #{{ solicitud.id.slice(-6).toUpperCase() }}</h2>
          <StatusBadge :estado="solicitud.estado" />
        </div>

        <dl class="detail-info">
          <div class="detail-row">
            <dt>Título</dt>
            <dd><strong>{{ solicitud.titulo }}</strong></dd>
          </div>
          <div class="detail-row">
            <dt>Descripción</dt>
            <dd>{{ solicitud.descripcion }}</dd>
          </div>
          <div class="detail-row">
            <dt>Categoría</dt>
            <dd>{{ solicitud.categoria }}</dd>
          </div>
          <div class="detail-row">
            <dt>Prioridad</dt>
            <dd>{{ solicitud.prioridad }}</dd>
          </div>
          <div class="detail-row">
            <dt>Estado</dt>
            <dd>
              {{ textoEstado(solicitud.estado) }}
              <span class="muted"> • Activa:&nbsp;</span>
              <button
                type="button"
                class="switch"
                :class="{ on: solicitud.activo }"
                role="switch"
                :aria-checked="solicitud.activo"
                :disabled="guardandoActivo"
                @click="pedirConfirmacion"
              >
                <span class="switch-thumb"></span>
              </button>
              <span class="switch-label" :class="{ off: !solicitud.activo }">
                {{ solicitud.activo ? 'Sí' : 'No' }}
              </span>
            </dd>
          </div>
          <div class="detail-row">
            <dt>Creada</dt>
            <dd>{{ formatoFecha(solicitud.createdAt) }}</dd>
          </div>
          <div class="detail-row">
            <dt>Procesada</dt>
            <dd>{{ formatoFecha(solicitud.fechaProcesamiento) }}</dd>
          </div>
        </dl>
      </div>

      <div class="card respuesta">
        <h3 class="section-title">Respuesta</h3>

        <p v-if="solicitud.estado === 'ERROR'" class="respuesta-error">
          <strong>Error:</strong> {{ solicitud.error || 'No se pudo procesar la solicitud.' }}
        </p>

        <p v-else-if="solicitud.respuesta" class="respuesta-texto">
          {{ solicitud.respuesta }}
        </p>

        <p v-else class="muted">
          La solicitud aún no tiene respuesta. Estado: {{ textoEstado(solicitud.estado) }}.
        </p>

        <div class="mt-2">
          <RouterLink to="/solicitudes" class="btn btn-secondary">Volver</RouterLink>
        </div>
      </div>
    </div>

    <div v-if="mostrarConfirmacion" class="modal-overlay" @click.self="cancelarConfirmacion">
      <div class="modal" role="dialog" aria-modal="true">
        <h3 class="modal-title">
          {{ solicitud.activo ? 'Desactivar solicitud' : 'Activar solicitud' }}
        </h3>
        <p class="modal-text">
          ¿Seguro que deseas {{ solicitud.activo ? 'desactivar' : 'activar' }} la solicitud
          <strong>#{{ solicitud.id.slice(-6).toUpperCase() }}</strong>?
        </p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="cancelarConfirmacion">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="confirmarToggle">Sí, confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { RouterLink } from 'vue-router';
  import StatusBadge from '../components/Status/StatusBadge.vue';
  import * as requestService from '../services/requestService.js';
  import { formatoFecha, textoEstado } from '../utils/formatDate.js';
  import { useSocket } from '../composables/useSocket.js';
  import { useToast } from '../composables/useToast.js';

  const route = useRoute();
  const toast = useToast();

  const solicitud = ref(null);
  const cargando = ref(true);
  const error = ref(null);
  const guardandoActivo = ref(false);
  const mostrarConfirmacion = ref(false);

  function pedirConfirmacion() {
    if (!solicitud.value) return;
    mostrarConfirmacion.value = true;
  }

  function cancelarConfirmacion() {
    mostrarConfirmacion.value = false;
  }

  async function confirmarToggle() {
    mostrarConfirmacion.value = false;
    await alternarActivo();
  }

  async function alternarActivo() {
    if (!solicitud.value) return;
    const nuevoValor = !solicitud.value.activo;
    guardandoActivo.value = true;
    try {
      const data = await requestService.cambiarActivoSolicitud(route.params.id, nuevoValor);
      solicitud.value = data.solicitud;
      toast.success(nuevoValor ? 'Solicitud activada' : 'Solicitud desactivada');
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al cambiar el estado de la solicitud');
    } finally {
      guardandoActivo.value = false;
    }
  }

  async function cargar() {
    cargando.value = true;
    error.value = null;
    try {
      const data = await requestService.obtenerSolicitud(route.params.id);
      solicitud.value = data.solicitud;
    } catch (err) {
      error.value = err.response?.data?.mensaje || 'Error al consultar la solicitud';
    } finally {
      cargando.value = false;
    }
  }

  useSocket({
    'solicitud-encolada': (p) => {
      if (p.solicitudId === route.params.id) cargar();
    },
    'solicitud-procesando': () => cargar(),
    'solicitud-respondida': (p) => {
      if (p.solicitudId === route.params.id) {
        toast.success('Solicitud respondida');
        cargar();
      }
    },
    'solicitud-error': (p) => {
      if (p.solicitudId === route.params.id) {
        toast.error('Ocurrió un error en el procesamiento');
        cargar();
      }
    }
  });

  onMounted(cargar);
</script>

<style scoped>
  .detail-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .detail-id {
    font-size: 1.25rem;
  }

  .detail-info {
    margin: 0;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--color-border);
    gap: 0.5rem;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-row dt {
    color: var(--color-text-muted);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .respuesta-texto {
    line-height: 1.6;
    font-size: 0.98rem;
  }

  .respuesta-error {
    color: var(--color-danger);
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 0.85rem 1rem;
    line-height: 1.5;
  }

  .switch {
    width: 44px;
    height: 24px;
    border-radius: 999px;
    background: #cbd5e1;
    border: none;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
    vertical-align: middle;
  }

  .switch.on {
    background: var(--color-success);
  }

  .switch:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s;
  }

  .switch.on .switch-thumb {
    transform: translateX(20px);
  }

  .switch-label {
    font-weight: 700;
    color: var(--color-success);
  }

  .switch-label.off {
    color: var(--color-text-muted);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: #fff;
    border-radius: 10px;
    padding: 1.5rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }

  .modal-title {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  .modal-text {
    margin: 0 0 1.25rem;
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    .detail-grid {
      grid-template-columns: 1fr;
    }

    .detail-row {
      grid-template-columns: 1fr;
    }
  }
</style>