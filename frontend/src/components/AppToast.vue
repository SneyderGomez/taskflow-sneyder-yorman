<template>
  <div v-if="mensajes.length" class="toast-container">
    <div
      v-for="(m, i) in mensajes"
      :key="i"
      class="toast"
      :class="m.type"
    >
      {{ m.msg }}
      <button class="toast-close" @click="cerrar(i)">&times;</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useToast } from '../composables/useToast.js';

  const { mensajes, cerrar } = useToast();
</script>

<style scoped>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .toast {
    padding: 0.85rem 1rem;
    border-radius: 8px;
    color: #fff;
    box-shadow: var(--shadow);
    min-width: 260px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
  }

  .toast.success { background: var(--color-success); }
  .toast.error { background: var(--color-danger); }

  .toast-close {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    line-height: 1;
  }
</style>