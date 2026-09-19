import { onBeforeUnmount, onMounted } from 'vue';
import { getSocket } from '../plugins/socket.js';

export function useSocket(handlers = {}) {
  const listeners = new Map();

  const conectar = () => {
    const socket = getSocket();

    for (const [evento, handler] of Object.entries(handlers)) {
      socket.on(evento, handler);
      listeners.set(evento, handler);
    }

    return socket;
  };

  const desconectar = () => {
    const socket = getSocket();
    for (const [evento, handler] of listeners) {
      socket.off(evento, handler);
    }
    listeners.clear();
  };

  onMounted(conectar);
  onBeforeUnmount(desconectar);

  return { conectar, desconectar };
}