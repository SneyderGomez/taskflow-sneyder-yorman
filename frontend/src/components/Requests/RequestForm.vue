<template>
  <form class="request-form" @submit.prevent="enviar">
    <div class="field">
      <label class="label" for="titulo">Título</label>
      <input
        id="titulo"
        v-model="form.titulo"
        type="text"
        class="input"
        placeholder="Ej: Solicitud de certificado"
      />
    </div>

    <div class="field">
      <label class="label" for="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        v-model="form.descripcion"
        class="textarea"
        placeholder="Describe tu solicitud..."
      ></textarea>
    </div>

    <div class="grid grid-2">
      <div class="field">
        <label class="label" for="categoria">Categoría</label>
        <select id="categoria" v-model="form.categoria" class="select">
          <option value="" disabled>Selecciona...</option>
          <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field">
        <label class="label" for="prioridad">Prioridad</label>
        <select id="prioridad" v-model="form.prioridad" class="select">
          <option value="" disabled>Selecciona...</option>
          <option v-for="p in prioridades" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>

    <div v-if="errores.length" class="errores">
      <p v-for="(e, i) in errores" :key="i" class="error-msg">{{ e }}</p>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancelar')">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="enviando">
        {{ enviando ? 'Enviando...' : 'Enviar solicitud' }}
      </button>
    </div>
  </form>
</template>

<script setup>
  import { reactive, ref, computed } from 'vue';
  import { CATEGORIAS, PRIORIDADES } from '../../utils/validateRequest.js';

  const emit = defineEmits(['enviar', 'cancelar']);

  const categorias = CATEGORIAS;
  const prioridades = PRIORIDADES;

  const form = reactive({
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: ''
  });

  const enviando = ref(false);
  const errores = ref([]);

  const valido = computed(() => {
    return form.titulo.trim().length >= 3 &&
      form.descripcion.trim().length >= 10 &&
      CATEGORIAS.includes(form.categoria) &&
      PRIORIDADES.includes(form.prioridad);
  });

  async function enviar() {
    errores.value = [];

    if (!form.titulo.trim()) errores.value.push('El título es obligatorio.');
    else if (form.titulo.trim().length < 3) errores.value.push('El título debe tener al menos 3 caracteres.');

    if (!form.descripcion.trim()) errores.value.push('La descripción es obligatoria.');
    else if (form.descripcion.trim().length < 10) errores.value.push('La descripción debe tener al menos 10 caracteres.');

    if (!CATEGORIAS.includes(form.categoria)) errores.value.push('Debes seleccionar una categoría.');
    if (!PRIORIDADES.includes(form.prioridad)) errores.value.push('Debes seleccionar una prioridad.');

    if (errores.value.length) return;

    enviando.value = true;
    try {
      emit('enviar', { ...form });
    } finally {
      enviando.value = false;
    }
  }
</script>

<style scoped>
  .request-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .errores {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 0.75rem 1rem;
  }

  .error-msg {
    color: var(--color-danger);
    font-size: 0.85rem;
  }
</style>