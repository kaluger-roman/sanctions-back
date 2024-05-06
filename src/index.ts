import { Socket } from "socket.io";
import { searchApiHandlers, searchApi } from "./search-app";
import { createServer } from "@master_kufa/server-tools";
import { userService } from "./user";
import { registerApi } from "./helpers";
import {
  sanctionsManagementApi,
  sanctionsManagementApiHandlers,
} from "./sanctions-management";

const server = createServer({ withAuthorization: false });

server.use(async (socket, next) => {
  // await userService.recordUser(socket.handshake.auth.decoded.id);

  next();
});

server.on("connection", async (socket: Socket) => {
  registerApi(searchApiHandlers, searchApi, socket);
  registerApi(sanctionsManagementApiHandlers, sanctionsManagementApi, socket);
});
