import { Api, ApiHandlers } from "@master_kufa/server-tools";
import { Socket } from "socket.io";

export const registerApi = <T extends string>(
  actions: ApiHandlers<string>,
  api: Api<T>,
  socket: Socket,
) =>
  Object.keys(actions).forEach((action) =>
    socket.on(action, api.handle.bind(api, action, socket)),
  );
