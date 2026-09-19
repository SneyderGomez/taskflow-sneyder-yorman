import { ref } from 'vue';

const mensajes = ref([]);
let nextId = 1;

function mostrar(tipo, msg) {
  const id = nextId++;
  mensajes.value.push({ id, type: tipo, msg });
  setTimeout(() => cerrar(id), 4000);
}

function cerrar(id) {
  mensajes.value = mensajes.value.filter((m) => m.id !== id);
}

export function useToast() {
  return {
    mensajes,
    success: (msg) => mostrar('success', msg),
    error: (msg) => mostrar('error', msg),
    cerrar
  };
}