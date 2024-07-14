import {
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from "effector";
import { authApi } from "../../api";
import { createGate } from "effector-react";
import { navigation } from "shared/navigate";
import { Notification } from "@master_kufa/client-tools";
import { Paths } from "../../shared/paths";
import { validatePassword } from "shared/auth.helpers";

export const emailTextChanged = createEvent<string>();
export const passwordTextChanged = createEvent<string>();
export const passwordConfirmTextChanged = createEvent<string>();

export const registerClicked = createEvent();

export const $emailText = restore(emailTextChanged, "");
export const $passwordText = restore(passwordTextChanged, "");
export const $passwordConfirmText = restore(passwordConfirmTextChanged, "");

export const $emailTextError = createStore("");
export const $passwordTextError = createStore("");
export const $passwordConfirmTextError = createStore("");

export const $registerPending = authApi.registerFx.pending;

export const PageGate = createGate();

export const redirectToAuthFx = createEffect(() =>
  navigation.navigate(Paths.auth),
);

sample({
  clock: registerClicked,
  source: $emailText,
  fn: (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)
      ? ""
      : "Некорректный email.",
  target: $emailTextError,
});

sample({
  clock: registerClicked,
  source: $passwordText,
  fn: (password) => validatePassword(password),
  target: $passwordTextError,
});

sample({
  clock: registerClicked,
  source: [$passwordText, $passwordConfirmText],
  fn: ([password, confirmation]) =>
    password === confirmation ? "" : "Пароли не совпадают",
  target: $passwordConfirmTextError,
});

sample({
  clock: registerClicked,
  source: {
    email: $emailText,
    password: $passwordText,
    emailTextError: $emailTextError,
    passwordTextError: $passwordTextError,
    passwordConfirmTextError: $passwordConfirmTextError,
  },
  filter: ({ emailTextError, passwordTextError, passwordConfirmTextError }) =>
    !emailTextError && !passwordTextError && !passwordConfirmTextError,
  fn: ({ email, password }) => ({ email, password }),
  target: authApi.registerFx,
});

sample({
  clock: authApi.registerFx.doneData,
  target: redirectToAuthFx,
});

sample({
  clock: authApi.registerFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Пользователь успешно создан.",
  }),
  target: Notification.add,
});

sample({
  clock: authApi.registerFx.failData,
  fn: (message: string): Notification.PayloadType => ({
    type: "error",
    message,
  }),
  target: Notification.add,
});

$emailText.reset(PageGate.close);
$passwordText.reset(PageGate.close);
$passwordConfirmText.reset(PageGate.close);
$emailTextError.reset(PageGate.close);
$passwordTextError.reset(PageGate.close);
$passwordConfirmTextError.reset(PageGate.close);
