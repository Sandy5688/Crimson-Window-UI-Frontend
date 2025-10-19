import { io, type Socket } from 'socket.io-client';
import { config } from './config';
import { getToken } from './auth';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  const token = getToken();
  socket = io(config.gatewayWsUrl, {
    transports: ['websocket'],
    auth: token ? { token } : undefined,
    autoConnect: true,
    reconnection: true,
  });
  return socket;
}


