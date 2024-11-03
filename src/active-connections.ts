import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";

// user id - connections
export const ActiveConnections: Record<number, Array<Socket>> = {};

export const addActiveUserConnection = async (
  token: string,
  socket: Socket,
) => {
  const { id: userId } = jwt.decode(token);

  if (!ActiveConnections[userId]) ActiveConnections[userId] = [];

  if (!ActiveConnections[userId].some(({ id }) => id === socket.id)) {
    ActiveConnections[userId].push(socket);
  }
};

export const deleteActiveUserConnection = async (socket: Socket) => {
  const [userId, sockets] = Object.entries(ActiveConnections).find(
    ([_, sockets]) => sockets.some(({ id }) => id === socket.id),
  ) || [null, null];

  if (userId) {
    ActiveConnections[userId] = sockets.filter(({ id }) => id !== socket.id);
  }
};
