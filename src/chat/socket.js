import { io } from "socket.io-client";

const chatSocket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"], // 🔥 IMPORTANT
});

export default chatSocket;
