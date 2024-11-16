import { createEffect, createEvent, createStore, sample } from "effector";
import { attachLogger } from "effector-logger";
import { appModel } from "models/app";
import { $authorizationData, LogOut } from "models/app/app.model";
import { interval, reset } from "patronum";
attachLogger();

export const $isAutoLogoutConfirmShowed = createStore(false);
export const $logoutConfirmLeftTime = createStore<number>(30);

export const autoLogoutConfirmShowed = createEvent<boolean>();
export const startLogoutTimer = createEvent();
export const stopLogoutTimer = createEvent();
export const startLogoutConfirmationTimer = createEvent();
export const stopLogoutConfirmationTimer = createEvent();
export const userActionDone = createEvent();

const userActionCheckFx = createEffect(() => {
  document.addEventListener("click", () => userActionDone());
});

export const logoutAsked = interval({
  start: startLogoutTimer,
  stop: stopLogoutTimer,
  timeout: 1000 * 60 * 60,
});

export const logoutConfirmed = interval({
  start: startLogoutConfirmationTimer,
  stop: stopLogoutConfirmationTimer,
  timeout: 30000,
});

export const logoutConfirmTimer = interval({
  start: startLogoutConfirmationTimer,
  stop: stopLogoutConfirmationTimer,
  timeout: 1000,
});

sample({
  clock: appModel.AppGate.open,
  target: userActionCheckFx,
});

sample({
  clock: $authorizationData,
  filter: Boolean,
  target: startLogoutTimer,
});

sample({
  clock: $authorizationData,
  filter: (data) => !data,
  target: [stopLogoutConfirmationTimer, stopLogoutTimer],
});

sample({
  clock: [userActionDone, $isAutoLogoutConfirmShowed],
  source: [$authorizationData, $isAutoLogoutConfirmShowed] as const,
  filter: ([data, isAutoLogoutConfirmShowed]) =>
    Boolean(data && !isAutoLogoutConfirmShowed),
  target: [stopLogoutTimer, startLogoutTimer],
});

sample({
  clock: logoutAsked.tick,
  fn: () => true,
  target: autoLogoutConfirmShowed,
});

sample({
  clock: autoLogoutConfirmShowed,
  target: $isAutoLogoutConfirmShowed,
});

sample({
  clock: autoLogoutConfirmShowed,
  filter: Boolean,
  target: [startLogoutConfirmationTimer, stopLogoutTimer],
});

sample({
  clock: $isAutoLogoutConfirmShowed,
  filter: (x) => !x,
  target: [
    stopLogoutConfirmationTimer,
    reset({ target: $logoutConfirmLeftTime }),
  ],
});

sample({
  clock: logoutConfirmed.tick,
  target: LogOut,
});

sample({
  clock: logoutConfirmTimer.tick,
  source: $logoutConfirmLeftTime,
  fn: (logoutConfirmLeftTime) => logoutConfirmLeftTime - 1,
  target: $logoutConfirmLeftTime,
});
