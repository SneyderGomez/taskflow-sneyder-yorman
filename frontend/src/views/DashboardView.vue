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
      <RouterLink to="/solicitudes/nueva" class="btn btn-primary">Nueva solicitud</RouterLink>
      <RouterLink to="/monitor" class="btn btn-secondary">Monitor</RouterLink>
    </div>

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
  import { onMounted, computed } from 'vue';
  import { RouterLink } from 'vue-router';
  import StatCard from '../components/StatCard.vue';
  import StatusBadge from '../components/Status/StatusBadge.vue';
  import { useRequestStore } from '../store/requestStore.js';
  import { useSocket } from '../composables/useSocket.js';
  import { useToast } from '../composables/useToast.js';

  const store = useRequestStore();
  const toast = useToast();

  const stats = computed(() => store.estadisticas);

  const recientes = computed(() => store.solicitudes.slice(0, 5));

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