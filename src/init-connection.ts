import { Socket } from "socket.io";
import { deleteActiveUserConnection } from "./active-connections";

export const initConnection = (socket: Socket) => {
  socket.on("disconnect", () => {
    deleteActiveUserConnection(socket);
  });
};
