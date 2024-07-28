import { Notification } from "@master_kufa/client-tools";
import { authApi } from "api";
import { createEffect, createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { appModel } from "models/app";
import { validatePassword } from "shared/auth.helpers";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";

export const $email = createStore<string>("");
export const $isConfirmApproved = createStore<boolean>(false);
export const $recoverPasswordToken = createStore<string>("");

export const $newPassword = createStore<string>("");
export const $confirmPassword = createStore<string>("");

export const $newPasswordError = createStore<string | null>(null);
export const $confirmPasswordError = createStore<string | null>(null);

export const recoverClicked = createEvent();
export const recoverConfirmClicked = createEvent();
export const changeEmail = createEvent<string>();
export const changeNewPassword = createEvent<string>();
export const changeConfirmPassword = createEvent<string>();

export const RecoverRequestPageGate = createGate();
export const RecoverConfirmPageGate = createGate<string>("");

sample({
  clock: changeEmail,
  target: $email,
});

sample({
  clock: changeNewPassword,
  target: $newPassword,
});

sample({
  clock: changeConfirmPassword,
  target: $confirmPassword,
});

sample({
  clock: recoverClicked,
  source: [$email, appModel.$authorizationData] as const,
  fn: ([email, authorizationData]) => ({
    email: email || authorizationData?.email || "",
  }),
  target: authApi.recoverRequestFx,
});

sample({
  clock: authApi.recoverRequestFx.doneData,
  fn: () => true,
  target: $isConfirmApproved,
});

sample({
  clock: RecoverConfirmPageGate.open,
  source: RecoverConfirmPageGate.open,
  target: $recoverPasswordToken,
});

sample({
  clock: recoverConfirmClicked,
  source: [$newPassword, $confirmPassword] as const,
  fn: ([newPassword, confirmPassword]) =>
    confirmPassword === newPassword ? "" : "Пароли не совпадают",
  target: $confirmPasswordError,
});

sample({
  clock: recoverConfirmClicked,
  source: $newPassword,
  fn: (newPassword) => validatePassword(newPassword),
  target: $newPasswordError,
});

sample({
  clock: authApi.recoverConfirmFx.doneData,
  target: createEffect(() => {
    Notification.add({ type: "success", message: "Пароль успешно изменен" });

    navigation.navigate(Paths.auth);
  }),
});

sample({
  clock: recoverConfirmClicked,
  source: [
    $newPassword,
    $recoverPasswordToken,
    $newPasswordError,
    $confirmPasswordError,
  ] as const,
  filter: ([_, __, newPasswordError, confirmPasswordError]) =>
    !newPasswordError && !confirmPasswordError,
  fn: ([password, recoverPasswordToken]) => ({
    recoverPasswordToken,
    password,
  }),
  target: authApi.recoverConfirmFx,
});

sample({
  clock: RecoverConfirmPageGate.open,
  target: $recoverPasswordToken,
});

$email.reset(RecoverRequestPageGate.close);
$isConfirmApproved.reset(RecoverRequestPageGate.close);

$recoverPasswordToken.reset(RecoverConfirmPageGate.close);
$newPassword.reset(RecoverConfirmPageGate.close);
$confirmPassword.reset(RecoverConfirmPageGate.close);
$confirmPasswordError.reset(RecoverConfirmPageGate.close);
$newPasswordError.reset(RecoverConfirmPageGate.close);
