import { io } from "socket.io-client";
import { getToken } from "./auth";

export const socket = io("http://localhost:3333", {
  autoConnect: true,
  retries: 5,
  auth: {
    token: getToken(),
  },
});