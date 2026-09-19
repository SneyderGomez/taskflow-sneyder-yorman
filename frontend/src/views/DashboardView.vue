<template>
  <div class="dashboard">
    <div class="grid grid-4">
      <StatCard label="Total de solicitudes" :value="stats.total" color="var(--color-primary)" />
      <StatCard label="Pendientes" :value="stats.pendiente" color="var(--color-warning)" />
      <StatCard label="En cola" :value="stats.enCola" color="var(--color-info)" />
      <StatCard label="Procesando" :value="stats.procesando" color="var(--color-warning)" />
    </div>

    <div class="grid grid-2 mt-2">
      <StatCard label="Respondidas" :value="stats.respondida" color="var(--color-success)" />
      <StatCard label="Con error" :value="stats.error" color="var(--color-danger)" />
    </div>

    <div class="dashboard-actions mt-3">
      <RouterLink to="/monitor" class="btn btn-secondary">Monitor</RouterLink>
    </div>

    <section class="card mt-3 prueba-card">
      <div class="prueba-header">
        <div>
          <h2 class="section-title">Modo prueba de carga</h2>
          <p class="muted">Envía muchas solicitudes a la vez para probar la cola y el worker.</p>
        </div>
        <button
          type="button"
          class="switch"
          :class="{ on: pruebaActiva }"
          role="switch"
          :aria-checked="pruebaActiva"
          :disabled="enviandoPrueba"
          @click="alternarPrueba"
        >
          <span class="switch-thumb"></span>
        </button>
      </div>

      <div class="prueba-opciones">
        <label class="label" for="cantidad-prueba">Cantidad por lote</label>
        <select id="cantidad-prueba" v-model="cantidadPrueba" class="select" :disabled="pruebaActiva">
          <option :value="10">10 solicitudes</option>
          <option :value="25">25 solicitudes</option>
          <option :value="50">50 solicitudes</option>
          <option :value="100">100 solicitudes</option>
        </select>
      </div>

      <p v-if="enviandoPrueba" class="muted">Enviando lote...</p>
      <p v-else-if="resultadoPrueba" class="prueba-resultado">
        {{ resultadoPrueba }}
      </p>
    </section>

    <section class="card mt-3">
      <h2 class="section-title">Solicitudes recientes</h2>
      <p v-if="cargando" class="muted">Cargando...</p>
      <p v-else-if="store.solicitudes.length === 0" class="muted">
        No hay solicitudes registradas.
      </p>
      <ul v-else class="recientes">
        <li v-for="s in recientes" :key="s.id">
          <RouterLink :to="`/solicitudes/${s.id}`" class="reciente-link">
            <span class="reciente-titulo">{{ s.titulo }}</span>
            <StatusBadge :estado="s.estado" />
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
  import { onMounted, computed, ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import StatCard from '../components/StatCard.vue';
  import StatusBadge from '../components/Status/StatusBadge.vue';
  import { useRequestStore } from '../store/requestStore.js';
  import { useSocket } from '../composables/useSocket.js';
  import { useToast } from '../composables/useToast.js';
  import * as requestService from '../services/requestService.js';

  const store = useRequestStore();
  const toast = useToast();

  const stats = computed(() => store.estadisticas);

  const recientes = computed(() => store.solicitudes.slice(0, 5));

  const pruebaActiva = ref(false);
  const enviandoPrueba = ref(false);
  const cantidadPrueba = ref(10);
  const resultadoPrueba = ref('');

  async function alternarPrueba() {
    if (enviandoPrueba.value) return;
    pruebaActiva.value = true;
    enviandoPrueba.value = true;
    resultadoPrueba.value = '';
    try {
      const resultados = await requestService.enviarLotePrueba(cantidadPrueba.value);
      const ok = resultados.filter((r) => r.ok).length;
      const mal = resultados.length - ok;
      resultadoPrueba.value = `Lote enviado: ${ok} aceptadas, ${mal} con error.`;
      toast.success(`Se enviaron ${ok} solicitudes de prueba`);
    } catch (err) {
      toast.error('Error al enviar el lote de prueba');
    } finally {
      pruebaActiva.value = false;
      enviandoPrueba.value = false;
      actualizarTodo();
    }
  }

  async function actualizarTodo() {
    await Promise.all([store.cargarSolicitudes(), store.cargarMonitor()]);
  }

  useSocket({
    'solicitud-creada': () => actualizarTodo(),
    'solicitud-encolada': (p) => toast.success(`Solicitud ${p.solicitudId.slice(-6).toUpperCase()} en cola`),
    'solicitud-procesando': () => actualizarTodo(),
    'solicitud-respondida': () => actualizarTodo(),
    'solicitud-error': () => actualizarTodo()
  });

  onMounted(actualizarTodo);
</script>

<style scoped>
  .dashboard-actions {
    display: flex;
    gap: 0.75rem;
  }

  .prueba-card {
    max-width: 640px;
  }

  .prueba-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .prueba-header .section-title {
    margin-bottom: 0.25rem;
  }

  .prueba-opciones {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .prueba-resultado {
    margin-top: 0.75rem;
    color: var(--color-success);
    font-weight: 600;
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
    flex-shrink: 0;
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

  .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  .recientes {
    list-style: none;
  }

  .recientes li {
    border-bottom: 1px solid var(--color-border);
  }

  .recientes li:last-child {
    border-bottom: none;
  }

  .reciente-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 0;
  }

  .reciente-titulo {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .reciente-link:hover .reciente-titulo {
    color: var(--color-primary);
  }
</style>