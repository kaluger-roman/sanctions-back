import { createEffect } from "effector";
import { ACTIONS } from "../actions";
import {
  AuthPayload,
  RecoverConfirmPayload,
  RecoverRequestPayload,
  RegisterPayload,
  RegistrationConfirmPayload,
} from "./auth.types";
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

export const recoverRequestFx = createEffect<
  RecoverRequestPayload,
  string,
  string
>((payload) =>
  socket.emitWithAnswer<RecoverRequestPayload, string>(
    ACTIONS.RECOVER_PASSWORD_REQUEST,
    payload,
  ),
);

export const recoverConfirmFx = createEffect<
  RecoverConfirmPayload,
  string,
  string
>((payload) =>
  socket.emitWithAnswer<RecoverConfirmPayload, string>(
    ACTIONS.RECOVER_PASSWORD_CONFIRM,
    payload,
  ),
);

export const registrationConfirmFx = createEffect<
  RegistrationConfirmPayload,
  string,
  string
>((payload) =>
  socket.emitWithAnswer<RegistrationConfirmPayload, string>(
    ACTIONS.REGISTRATION_CONFIRM,
    payload,
  ),
);

export const lastActivityTimeFx = createEffect<{ timestamp: number }, string>(
  (payload) =>
    socket.emitWithAnswer<{ timestamp: number }, string>(
      ACTIONS.LAST_ACTIVITY_TIME,
      payload,
    ),
);

export const logoutFx = createEffect<void, string>((payload) =>
  socket.emitWithAnswer<void, string>(ACTIONS.LOGOUT, payload),
);
