import { combine, createEffect, createEvent, restore, sample } from "effector";
import { authApi } from "../../api";
import { createGate } from "effector-react";
import { Notification } from "@master_kufa/client-tools";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";
import { AuthSystemError } from "./types";

export const emailTextChanged = createEvent<string>();
export const passwordTextChanged = createEvent<string>();
export const authClicked = createEvent<{
  forceLogin?: boolean;
}>();

export const $emailText = restore(emailTextChanged, "");
export const $passwordText = restore(passwordTextChanged, "");

export const $isEmptyFields = combine(
  $emailText,
  $passwordText,
  (emailText, passwordText) => !(emailText && passwordText),
);

export const $authPending = authApi.authFx.pending;

export const PageGate = createGate();

sample({
  clock: authClicked,
  source: [$emailText, $passwordText],
  fn: ([email, password], { forceLogin }) => ({ password, email, forceLogin }),
  target: authApi.authFx,
});

sample({
  clock: authApi.authFx.doneData,
  target: createEffect(() => navigation.navigate(Paths.root)),
});

sample({
  clock: authApi.authFx.failData,
  filter: (message) =>
    ![
      AuthSystemError.SESSION_ALREADY_EXISTS,
      AuthSystemError.SESSION_EXPIRED,
    ].includes(message as any),
  fn: (message: string): Notification.PayloadType => ({
    type: "error",
    message,
  }),
  target: Notification.add,
});

$emailText.reset([PageGate.close, authApi.authFx.done]);
$passwordText.reset([PageGate.close, authApi.authFx.done]);
