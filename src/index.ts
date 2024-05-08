import { Server, Socket } from "socket.io";
import { searchApiHandlers, searchApi } from "./search-app";
import { userService } from "./user";
import { registerApi } from "./helpers";
import {
  sanctionsManagementApi,
  sanctionsManagementApiHandlers,
} from "./sanctions-management";
import { execSync } from "child_process";

const express = require("express");
const path = require("path");
const app = express();

const httpServer = require("http").createServer(app);

const server = new Server(httpServer);

httpServer.listen(80);

app.use(require("express").static(path.resolve(__dirname, "..", "public")));

execSync(`cp -a ./front/build/. public`);

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "index.html")),
);

// if (opts?.withAuthorization) {
//   const clientUrl = new URL(process.env.AUTH_HOST);

//   // const authSocket = io(clientUrl.origin, {
//   //   path: clientUrl.pathname ? `${clientUrl.pathname}/socket.io` : undefined,
//   //   transports: ["websocket"],
//   // });

//   server.use(async (socket, next) => {
//     try {
//       await emitWithAnswer(authSocket, SocketActions.VERIFY, {
//         token: socket.handshake.auth.token,
//       });

//       socket.handshake.auth.decoded = jwt_decode(socket.handshake.auth.token);

//       next();
//     } catch (error) {
//       next(new Error(error));
//       socket.disconnect();
//     }
//   });
// }

// server.use(async (socket, next) => {
//   // await userService.recordUser(socket.handshake.auth.decoded.id);

//   next();
// });

server.on("connection", async (socket: Socket) => {
  registerApi(searchApiHandlers, searchApi, socket);
  registerApi(sanctionsManagementApiHandlers, sanctionsManagementApi, socket);
});
