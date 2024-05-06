import { Socket } from "socket.io";

export type SocketAuth = Socket & {
  handshake: { auth: { decoded: { id: number } } };
};
