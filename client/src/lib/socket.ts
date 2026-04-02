import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3333";

export const socket: Socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});