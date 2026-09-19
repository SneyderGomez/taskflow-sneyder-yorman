<template>
  <div class="request-card card">
    <div class="req-header">
      <div class="req-id muted">#{{ solicitud.id.slice(-6).toUpperCase() }}</div>
      <StatusBadge :estado="solicitud.estado" />
    </div>
    <h3 class="req-titulo">{{ solicitud.titulo }}</h3>
    <p class="req-desc muted">{{ solicitud.descripcion }}</p>
    <div class="req-meta">
      <span>{{ solicitud.categoria }}</span>
      <span>•</span>
      <span>{{ solicitud.prioridad }}</span>
    </div>
    <RouterLink :to="`/solicitudes/${solicitud.id}`" class="btn btn-secondary btn-sm">
      Ver detalle
    </RouterLink>
  </div>
</template>

<script setup>
  import { RouterLink } from 'vue-router';
  import StatusBadge from '../Status/StatusBadge.vue';

  defineProps({
    solicitud: { type: Object, required: true }
  });
</script>

<style scoped>
  .request-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .req-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .req-id {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .req-titulo {
    font-size: 1.05rem;
  }

  .req-desc {
    font-size: 0.9rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .req-meta {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .btn-sm {
    padding: 0.4rem 0.85rem;
    font-size: 0.8rem;
    margin-top: auto;
  }
</style>