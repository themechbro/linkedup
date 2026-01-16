import { io } from "socket.io-client";
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_HOST_IP, {
      withCredentials: true,
      transports: ["websocket"], // avoid polling mess
    });
  }
  return socket;
};
