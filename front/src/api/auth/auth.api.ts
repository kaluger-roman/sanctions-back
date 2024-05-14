import { createEffect } from "effector";
import { ACTIONS } from "../actions";
import { AuthPayload, RegisterPayload } from "./auth.types";
import { socket } from "api/app.api";

export const authFx = createEffect<AuthPayload, string, string>((payload) =>
  socket.emitWithAnswer<AuthPayload, string>(ACTIONS.AUTH, payload),
);

export const registerFx = createEffect<RegisterPayload, string, string>(
  (payload) =>
    socket.emitWithAnswer<RegisterPayload, string>(ACTIONS.REGISTER, payload),
);

export const verifyFx = createEffect<void, string, string>(() =>
  socket.emitWithAnswer<void, string>(ACTIONS.VERIFY),
);
