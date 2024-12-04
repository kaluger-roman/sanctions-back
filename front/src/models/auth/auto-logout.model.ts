import { createEffect, createEvent, createStore, sample } from "effector";
import { appModel } from "models/app";
import { $authorizationData, LogOut } from "models/app/app.model";
import { reset } from "patronum";
import { webWorkerInterval } from "./helpers";
import { socket } from "api/app.api";
import { ACTIONS } from "api/actions";
import { authApi } from "api";
import { AuthSystemError, FORCE_LOGOUT_REASON } from "./types";

export const $isAutoLogoutConfirmShowed = createStore(false);
export const $isForceLogoutConfirmShowed =
  createStore<FORCE_LOGOUT_REASON | null>(null);
export const $isSessionAlreadyExistsConfirmShowed = createStore(false);
export const $logoutConfirmLeftTime = createStore<number>(30);

export const autoLogoutConfirmShowed = createEvent<boolean>();
export const sessionAlreadyExistsConfirmShowed = createEvent<boolean>();
export const forceLogoutShowed = createEvent<FORCE_LOGOUT_REASON | null>();
export const startLogoutConfirmationTimer = createEvent();
export const stopLogoutConfirmationTimer = createEvent();
export const userActionDone = createEvent();
export const logoutAsked = createEvent();

const userActionCheckFx = createEffect(() => {
  document.addEventListener("click", () => userActionDone());
});

export const logoutConfirmed = webWorkerInterval({
  start: startLogoutConfirmationTimer,
  stop: stopLogoutConfirmationTimer,
  interval: 30000,
});

export const logoutConfirmTimer = webWorkerInterval({
  start: startLogoutConfirmationTimer,
  stop: stopLogoutConfirmationTimer,
  interval: 1000,
});

sample({
  clock: appModel.AppGate.open,
  target: userActionCheckFx,
});

sample({
  clock: $authorizationData,
  filter: (data) => !data,
  target: stopLogoutConfirmationTimer,
});

sample({
  clock: autoLogoutConfirmShowed,
  target: $isAutoLogoutConfirmShowed,
});

sample({
  clock: sessionAlreadyExistsConfirmShowed,
  target: $isSessionAlreadyExistsConfirmShowed,
});

sample({
  clock: forceLogoutShowed,
  target: $isForceLogoutConfirmShowed,
});

sample({
  clock: autoLogoutConfirmShowed,
  filter: Boolean,
  target: [startLogoutConfirmationTimer],
});

sample({
  clock: $isAutoLogoutConfirmShowed,
  filter: (x) => !x,
  fn: () => ({ timestamp: Date.now() }),
  target: [
    stopLogoutConfirmationTimer,
    authApi.lastActivityTimeFx,
    reset({ target: $logoutConfirmLeftTime }),
  ],
});

sample({
  clock: logoutConfirmed,
  target: LogOut,
});

sample({
  clock: logoutConfirmTimer,
  source: $logoutConfirmLeftTime,
  fn: (logoutConfirmLeftTime) => logoutConfirmLeftTime - 1,
  target: $logoutConfirmLeftTime,
});

sample({
  clock: socket.$isConnected,
  filter: (isConnected) => isConnected,
  target: createEffect(() => {
    socket.client.on(ACTIONS.INACTIVITY_LOGOUT, () => logoutAsked());
    socket.client.on(ACTIONS.FORCE_LOGOUT, ({ reason }) => {
      forceLogoutShowed(reason);
      appModel.LogOut();
    });
  }),
});

sample({
  clock: logoutAsked,
  fn: () => true,
  target: autoLogoutConfirmShowed,
});

sample({
  clock: userActionDone,
  source: [$authorizationData, $isAutoLogoutConfirmShowed] as const,
  filter: ([data, isAutoLogoutConfirmShowed]) =>
    Boolean(data && !isAutoLogoutConfirmShowed),
  fn: () => ({ timestamp: Date.now() }),
  target: authApi.lastActivityTimeFx,
});

sample({
  clock: authApi.authFx.failData,
  filter: (message) => message === AuthSystemError.SESSION_ALREADY_EXISTS,
  fn: () => true,
  target: sessionAlreadyExistsConfirmShowed,
});

sample({
  clock: authApi.verifyFx.failData,
  filter: (message) => message === AuthSystemError.SESSION_EXPIRED,
  fn: () => true,
  target: $isAutoLogoutConfirmShowed,
});

sample({
  clock: authApi.lastActivityTimeFx.failData,
  source: $authorizationData,
  filter: (authorizationData, message) =>
    !!authorizationData && message === AuthSystemError.SESSION_EXPIRED,
  fn: () => FORCE_LOGOUT_REASON.INACTIVITY,
  target: [$isForceLogoutConfirmShowed, appModel.LogOut],
});

sample({
  clock: authApi.verifyFx.failData,
  filter: (message) => message === AuthSystemError.SESSION_ALREADY_EXISTS,
  fn: () => FORCE_LOGOUT_REASON.NEW_SESSION,
  target: $isForceLogoutConfirmShowed,
});
