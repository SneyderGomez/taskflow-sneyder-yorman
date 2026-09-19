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

      <select v-model="filtros.activo" class="select filter-input" @change="cargar">
        <option value="">Activa e inactiva</option>
        <option :value="true">Activa</option>
        <option :value="false">Inactiva</option>
      </select>

      <select v-model="filtros.categoria" class="select filter-input" @change="cargar">
        <option value="">Todas las categorías</option>
        <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
      </select>

      <button type="button" class="btn btn-primary" @click="alternarFormulario">
        {{ mostrandoFormulario ? 'Cerrar formulario' : 'Nueva solicitud' }}
      </button>
      <button type="button" class="btn btn-secondary" @click="limpiar">Limpiar</button>
    </div>

    <div v-if="mostrandoFormulario" class="card mt-2 new-request">
      <h2 class="section-title">Registrar nueva solicitud</h2>
      <RequestForm
        :key="formKey"
        @enviar="registrar"
        @cancelar="cerrarFormulario"
      />
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
            <th>Activa</th>
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
            <td>
              <span class="activo-badge" :class="{ off: s.activo === false }">
                {{ s.activo === false ? 'Inactiva' : 'Activa' }}
              </span>
            </td>
            <td class="muted">{{ formatoFecha(s.createdAt) }}</td>
            <td>
              <RouterLink :to="`/solicitudes/${s.id}`" class="btn btn-secondary btn-sm">
                Ver detalle
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="paginador">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="store.paginaActual <= 1 || cargando"
          @click="irPagina(store.paginaActual - 1)"
        >
          Anterior
        </button>
        <span class="paginador-info">
          Página {{ store.paginaActual }} de {{ store.totalPaginas }}
          ({{ store.totalItems }} en total)
        </span>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="store.paginaActual >= store.totalPaginas || cargando"
          @click="irPagina(store.paginaActual + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import StatusBadge from '../components/Status/StatusBadge.vue';
  import RequestForm from '../components/Requests/RequestForm.vue';
  import { useRequestStore } from '../store/requestStore.js';
  import { useSocket } from '../composables/useSocket.js';
  import { formatoFecha } from '../utils/formatDate.js';
  import { CATEGORIAS } from '../utils/validateRequest.js';
  import { useToast } from '../composables/useToast.js';

  const store = useRequestStore();
  const toast = useToast();
  const cargando = ref(false);
  const categorias = CATEGORIAS;

  const mostrandoFormulario = ref(false);
  const formKey = ref(0);

  function alternarFormulario() {
    mostrandoFormulario.value = !mostrandoFormulario.value;
  }

  function cerrarFormulario() {
    mostrandoFormulario.value = false;
  }

  async function registrar(datos) {
    const res = await store.registrarSolicitud(datos);
    if (res.ok) {
      toast.success('Solicitud registrada correctamente');
      formKey.value++;
      cerrarFormulario();
      cargar();
    } else {
      toast.error(res.errores.join(' '));
    }
  }

  const filtros = reactive({
    q: '',
    estado: '',
    categoria: '',
    activo: ''
  });

  let timerBusqueda = null;

  async function cargar() {
    cargando.value = true;
    try {
      const params = {
        ...filtros,
        activo: filtros.activo === '' ? '' : filtros.activo
      };
      await store.cargarSolicitudes(params);
    } finally {
      cargando.value = false;
    }
  }

  async function irPagina(pagina) {
    if (pagina < 1 || pagina > store.totalPaginas) return;
    await store.cargarSolicitudes({
      ...filtros,
      activo: filtros.activo === '' ? '' : filtros.activo,
      pagina
    });
  }

  function buscar() {
    clearTimeout(timerBusqueda);
    timerBusqueda = setTimeout(cargar, 400);
  }

  function limpiar() {
    filtros.q = '';
    filtros.estado = '';
    filtros.categoria = '';
    filtros.activo = '';
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

  .new-request {
    max-width: 720px;
  }

  .section-title {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

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

  .activo-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    background: #dcfce7;
    color: #166534;
  }

  .activo-badge.off {
    background: #f3f4f6;
    color: var(--color-text-muted);
  }

  .btn-sm {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }

  .paginador {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .paginador-info {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
</style>