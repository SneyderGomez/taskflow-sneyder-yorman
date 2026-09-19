<template>
  <span class="estado-badge" :class="cls">
    {{ texto }}
  </span>
</template>

<script setup>
  import { computed } from 'vue';
  import { textoEstado, classEstado } from '../../utils/formatDate.js';

  const props = defineProps({
    estado: { type: String, required: true }
  });

  const texto = computed(() => textoEstado(props.estado));
  const cls = computed(() => classEstado(props.estado));
</script>