import { Server, Socket } from "socket.io";
import { searchApiHandlers, searchApi } from "./search-app";
// import { userService } from "./user";
import { registerApi } from "./helpers";
import {
  sanctionsManagementApi,
  sanctionsManagementApiHandlers,
} from "./sanctions-management";
import { execSync } from "child_process";
import { createServer } from "http";
import * as express from "express";
import * as path from "path";
import * as https from "https";
import { readFileSync } from "fs";

const app = express();

const httpServer = createServer(app);

httpServer.listen(80);

app.use((req, res, next) => {
  if (req.secure || req.path.includes("/.well-known/acme-challenge")) {
    next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
});

const httpsServer = https.createServer(
  {
    key: readFileSync(
      `/etc/letsencrypt/live/goodsanctioncheck.com/privkey.pem`,
    ),
    cert: readFileSync(
      `/etc/letsencrypt/live/goodsanctioncheck.com/fullchain.pem`,
    ),
  },
  app,
);

const server = new Server(httpsServer);

httpsServer.listen(443);

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
