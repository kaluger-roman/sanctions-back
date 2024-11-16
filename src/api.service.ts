import { Socket } from "socket.io";
import { ApiHandlers, SocketResponse } from "./types";
import { userService } from "./user";
import { ACTIONS, UNAUTHORIZED_ACTIONS } from "./actions";
import { beforeAction, afterAction } from "./init-user-connection";
import { sessionsService } from "./user/sessions.service";
import { Request } from "./types";

export class Api<T extends string> {
  constructor(private handlers: ApiHandlers<T>) {}

  async handle(action: T, socket: Socket, payload: Request<any>) {
    try {
      beforeAction(payload.token, socket);

      if (!UNAUTHORIZED_ACTIONS.includes(action as ACTIONS)) {
        const decoded = await sessionsService.verifyToken(payload);
        if (decoded) {
          await userService.recordUser(decoded.email);
        } else {
          throw new Error("Unauthorized");
        }
      }

      const answer = await this.handlers[action](payload, socket);

      if (answer && payload.requestId) {
        const successResponse: SocketResponse<typeof answer> = {
          requestId: payload.requestId,
          payload: answer,
        };

        socket.emit(action, successResponse);
      }

      afterAction(payload.token, socket);
    } catch ({ message }) {
      payload.requestId &&
        socket.emit(action, { requestId: payload.requestId, error: message });
    }
  }
}

export const registerApi = <T extends string>(
  actions: ApiHandlers<string>,
  api: Api<T>,
  socket: Socket,
) =>
  Object.keys(actions).forEach((action) =>
    socket.on(action, api.handle.bind(api, action, socket)),
  );
