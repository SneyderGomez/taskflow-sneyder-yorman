<template>
  <span class="bip" :class="ok ? 'on' : 'off'">
    {{ ok ? 'Disponible' : 'No disponible' }}
  </span>
</template>

<script setup>
  defineProps({
    ok: { type: Boolean, required: true }
  });
</script>

<style scoped>
  .bip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
  }

  .bip::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .bip.on {
    background: #dcfce7;
    color: #166534;
  }

  .bip.on::before {
    background: #22c55e;
  }

  .bip.off {
    background: #fee2e2;
    color: #991b1b;
  }

  .bip.off::before {
    background: #ef4444;
  }
</style>