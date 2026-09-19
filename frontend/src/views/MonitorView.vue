<template>
  <div class="monitor">
    <div v-if="cargando && !store.monitor" class="card text-center muted">
      Cargando monitor...
    </div>

    <div v-else-if="store.monitor" class="grid grid-2">
      <section class="card">
        <h2 class="section-title">Estado de servicios</h2>
        <ul class="servicios">
          <li>
            <span>Express / Backend</span>
            <StatusBip :ok="true" />
          </li>
          <li>
            <span>MongoDB</span>
            <StatusBip :ok="store.monitor.servicios.mongoDB" />
          </li>
          <li>
            <span>Redis</span>
            <StatusBip :ok="store.monitor.servicios.redis" />
          </li>
          <li>
            <span>Worker</span>
            <StatusBip :ok="workerActivo" />
          </li>
        </ul>
      </section>

      <section class="card">
        <h2 class="section-title">Indicadores</h2>
        <ul class="indicadores">
          <li>
            <span>En cola</span>
            <strong>{{ store.monitor.cola }}</strong>
          </li>
          <li>
            <span>Procesando</span>
            <strong>{{ store.monitor.procesando }}</strong>
          </li>
          <li>
            <span>Respondidas</span>
            <strong>{{ store.monitor.respondidas }}</strong>
          </li>
          <li>
            <span>Errores</span>
            <strong>{{ store.monitor.errores }}</strong>
          </li>
        </ul>
      </section>
    </div>

    <p v-if="store.error" class="error-color mt-2">{{ store.error }}</p>
  </div>
</template>

<script setup>
  import { onMounted, computed } from 'vue';
  import StatusBip from '../components/Status/StatusBip.vue';
  import { useRequestStore } from '../store/requestStore.js';
  import { useSocket } from '../composables/useSocket.js';

  const store = useRequestStore();

  const workerActivo = computed(() => {
    const proc = store.monitor?.procesando ?? 0;
    const enCola = store.monitor?.cola ?? 0;
    return proc > 0 || enCola === 0;
  });

  async function refrescar() {
    await store.cargarMonitor();
  }

  useSocket({
    'solicitud-encolada': () => refrescar(),
    'solicitud-procesando': () => refrescar(),
    'solicitud-respondida': () => refrescar(),
    'solicitud-error': () => refrescar(),
    'cola-actualizada': () => refrescar(),
    'monitor-actualizado': () => refrescar()
  });

  onMounted(refrescar);
</script>

<style scoped>
  .servicios,
  .indicadores {
    list-style: none;
  }

  .servicios li,
  .indicadores li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .servicios li:last-child,
  .indicadores li:last-child {
    border-bottom: none;
  }

  .section-title {
    margin-bottom: 0.5rem;
  }

  .error-color {
    color: var(--color-danger);
  }
</style>