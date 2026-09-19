<template>
  <div class="stat-card card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value" :style="colorStyle">{{ value }}</div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    color: { type: String, default: 'var(--color-primary)' }
  });

  const colorStyle = computed(() => ({ color: props.color }));
</script>

<style scoped>
  .stat-card {
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .stat-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-muted);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 800;
  }
</style>