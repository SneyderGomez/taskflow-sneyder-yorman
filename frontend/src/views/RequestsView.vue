<template>
  <div class="requests">
    <div class="toolbar card">
      <input
        v-model="filtros.q"
        type="text"
        class="input search-input"
        placeholder="Buscar por título o descripción..."
        @input="buscar"
      />

      <select v-model="filtros.estado" class="select filter-input" @change="cargar">
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="EN COLA">En cola</option>
        <option value="PROCESANDO">Procesando</option>
        <option value="RESPONDIDA">Respondida</option>
        <option value="ERROR">Error</option>
      </select>

      <select v-model="filtros.categoria" class="select filter-input" @change="cargar">
        <option value="">Todas las categorías</option>
        <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
      </select>

      <button type="button" class="btn btn-secondary" @click="limpiar">Limpiar</button>
    </div>

    <div class="toolbar-msg muted" :class="{ hit: store.ultimaFuente }">
      <span v-if="store.ultimaFuente">Fuente: {{ store.ultimaFuente }}</span>
      <span v-if="cargando"> Cargando...</span>
      <span v-if="store.error" class="error-color">{{ store.error }}</span>
    </div>

    <div v-if="store.cargando" class="card mt-2 text-center muted">Cargando solicitudes...</div>

    <div v-else-if="store.solicitudes.length === 0" class="card mt-2 text-center muted">
      No hay solicitudes que coincidan con la búsqueda.
    </div>

    <div v-else class="card mt-2 table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitud</th>
            <th>Categoría</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in store.solicitudes" :key="s.id">
            <td class="muted">#{{ s.id.slice(-6).toUpperCase() }}</td>
            <td class="col-titulo">{{ s.titulo }}</td>
            <td>{{ s.categoria }}</td>
            <td>{{ s.prioridad }}</td>
            <td><StatusBadge :estado="s.estado" /></td>
            <td class="muted">{{ formatoFecha(s.createdAt) }}</td>
            <td>
              <RouterLink :to="`/solicitudes/${s.id}`" class="btn btn-secondary btn-sm">
                Ver detalle
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import StatusBadge from '../components/Status/StatusBadge.vue';
  import { useRequestStore } from '../store/requestStore.js';
  import { useSocket } from '../composables/useSocket.js';
  import { formatoFecha } from '../utils/formatDate.js';
  import { CATEGORIAS } from '../utils/validateRequest.js';
  import { useToast } from '../composables/useToast.js';

  const store = useRequestStore();
  const toast = useToast();
  const cargando = ref(false);
  const categorias = CATEGORIAS;

  const filtros = reactive({
    q: '',
    estado: '',
    categoria: ''
  });

  let timerBusqueda = null;

  async function cargar() {
    cargando.value = true;
    try {
      await store.cargarSolicitudes({ ...filtros });
    } finally {
      cargando.value = false;
    }
  }

  function buscar() {
    clearTimeout(timerBusqueda);
    timerBusqueda = setTimeout(cargar, 400);
  }

  function limpiar() {
    filtros.q = '';
    filtros.estado = '';
    filtros.categoria = '';
    cargar();
  }

  useSocket({
    'solicitud-creada': () => cargar(),
    'solicitud-encolada': (p) => toast.success(`Solicitud #${p.solicitudId.slice(-6).toUpperCase()} en cola`),
    'solicitud-procesando': () => cargar(),
    'solicitud-respondida': () => cargar(),
    'solicitud-error': () => cargar()
  });

  onMounted(cargar);
</script>

<style scoped>
  .toolbar {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input { flex: 1; min-width: 200px; }
  .filter-input { width: 180px; }

  .toolbar-msg {
    margin-top: 0.75rem;
    font-size: 0.85rem;
  }

  .toolbar-msg.hit { color: var(--color-success); }
  .error-color { color: var(--color-danger); }

  .table-wrap {
    overflow-x: auto;
    padding: 0.5rem 1.25rem;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    min-width: 720px;
  }

  .table th,
  .table td {
    text-align: left;
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.9rem;
  }

  .table th {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--color-text-muted);
    letter-spacing: 0.04em;
  }

  .table tr:last-child td {
    border-bottom: none;
  }

  .col-titulo {
    font-weight: 600;
  }

  .btn-sm {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }
</style>