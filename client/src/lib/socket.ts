import { io } from "socket.io-client";
import { getToken } from "./auth";

export const socket = io("http://localhost:3333", {
  autoConnect: false,
  auth: {
    token: getToken(),
  },
});