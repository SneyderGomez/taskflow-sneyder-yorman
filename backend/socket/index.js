import { Server as SocketIOServer } from 'socket.io';

let io = null;

export function initSocket(server, config) {
  io = new SocketIOServer(server, {
    cors: {
      origin: config.frontendUrl,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Cliente desconectado:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function emitEvent(evento, payload) {
  if (io) {
    io.emit(evento, payload);
  }
}