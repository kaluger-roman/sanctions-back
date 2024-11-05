import { Server, Socket } from "socket.io";
import { searchApiHandlers, searchApi } from "./search-app";
import { registerApi } from "./api.service";
import { adminApi, adminApiHandlers } from "./admin";
import { execSync } from "child_process";
import { createServer } from "http";
import * as express from "express";
import * as path from "path";
import * as https from "https";
import { readFileSync } from "fs";
import { userApi, userApiHandlers } from "./user/user.api";
import { contactApi, contactApiHandlers } from "./contact";
import { billingApi, billingApiHandlers } from "./billing";
import { deleteActiveUserConnection } from "./active-connections";
import { initConnection } from "./init-connection";

const app = express();

const httpServer = createServer(app);

httpServer.listen(80);

let server = null;

if (process.env.NODE_ENV !== "development") {
  execSync(`certbot renew`);

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

  server = new Server(httpsServer);

  httpsServer.listen(443);
} else {
  server = new Server(httpServer);
}

app.use(require("express").static(path.resolve(__dirname, "..", "public")));

execSync(`cp -a ./front/build/. public`);

app.get("/*", (_, res) =>
  res.sendFile(path.join(__dirname, "..", "public", "index.html")),
);

server.on("connection", async (socket: Socket) => {
  initConnection(socket);

  registerApi(searchApiHandlers, searchApi, socket);
  registerApi(adminApiHandlers, adminApi, socket);
  registerApi(userApiHandlers, userApi, socket);
  registerApi(contactApiHandlers, contactApi, socket);
  registerApi(billingApiHandlers, billingApi, socket);
});
