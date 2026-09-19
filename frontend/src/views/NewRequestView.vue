<template>
  <div class="new-request">
    <div class="card">
      <h2 class="section-title">Registrar nueva solicitud</h2>
      <RequestForm
        :key="formKey"
        @enviar="enviar"
        @cancelar="cancelar"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import RequestForm from '../components/Requests/RequestForm.vue';
  import { useRequestStore } from '../store/requestStore.js';
  import { useToast } from '../composables/useToast.js';

  const store = useRequestStore();
  const toast = useToast();
  const router = useRouter();

  const formKey = ref(0);

  async function enviar(datos) {
    const res = await store.registrarSolicitud(datos);
    if (res.ok) {
      toast.success('Solicitud registrada correctamente');
      router.push('/solicitudes');
    } else {
      toast.error(res.errores.join(' '));
    }
  }

  function cancelar() {
    router.push('/solicitudes');
  }
</script>

<style scoped>
  .new-request {
    max-width: 720px;
    margin: 0 auto;
  }

  .section-title {
    margin-bottom: 1rem;
  }
</style>