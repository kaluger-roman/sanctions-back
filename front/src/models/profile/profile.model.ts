import { Notification } from "@master_kufa/client-tools";
import { profileApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { validatePassword } from "shared/auth.helpers";
import { Profile } from "shared/profile";

export const $profile = createStore<Profile | null>(null);
export const $oldPassword = createStore("");
export const $newPassword = createStore("");
export const $newPasswordRepeat = createStore("");

export const $newPasswordError = createStore<string>("");
export const $newPasswordRepeatError = createStore<string>("");

export const $tab = createStore<"profile" | "tarrif">("profile");
export const $isChangePasswordActive = createStore(false);

export const ProfileGate = createGate<void>();

export const changeTab = createEvent<"profile" | "tarrif">();
export const toggleChangePassword = createEvent();
export const changeOldPassword = createEvent<string>();
export const changeNewPassword = createEvent<string>();
export const changeNewPasswordRepeat = createEvent<string>();
export const changePasswordClicked = createEvent();

export const saveClicked = createEvent();

sample({
  clock: toggleChangePassword,
  source: $isChangePasswordActive,
  fn: (isChangePasswordActive) => !isChangePasswordActive,
  target: $isChangePasswordActive,
});

sample({
  clock: changeNewPassword,
  target: $newPassword,
});

sample({
  clock: changeNewPasswordRepeat,
  target: $newPasswordRepeat,
});

sample({
  clock: changeOldPassword,
  target: $oldPassword,
});

sample({
  clock: saveClicked,
  source: $newPassword,
  fn: (password) => validatePassword(password),
  target: $newPasswordError,
});

sample({
  clock: saveClicked,
  source: [$newPassword, $newPasswordRepeat],
  fn: ([password, confirmation]) =>
    password === confirmation ? "" : "Пароли не совпадают",
  target: $newPasswordRepeatError,
});

sample({
  clock: saveClicked,
  source: {
    oldPassword: $oldPassword,
    newPassword: $newPassword,
    newPasswordRepeat: $newPasswordRepeat,
    newPasswordError: $newPasswordError,
    newPasswordRepeatError: $newPasswordRepeatError,
  },
  filter: ({ newPasswordError, newPasswordRepeatError }) =>
    !newPasswordError && !newPasswordRepeatError,
  fn: ({ oldPassword, newPassword }) => ({
    oldPassword,
    newPassword,
  }),
  target: profileApi.changePasswordFx,
});

sample({
  clock: profileApi.changePasswordFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Пароль успешно изменен",
  }),
  target: Notification.add,
});

sample({
  clock: ProfileGate.open,
  target: profileApi.loadCurrentProfileFx,
});

sample({
  clock: profileApi.loadCurrentProfileFx.doneData,
  target: $profile,
});

$isChangePasswordActive.reset(
  ProfileGate.close,
  profileApi.changePasswordFx.done,
);
$tab.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPasswordError.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPasswordRepeatError.reset(
  ProfileGate.close,
  profileApi.changePasswordFx.done,
);
$oldPassword.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPassword.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPasswordRepeat.reset(ProfileGate.close, profileApi.changePasswordFx.done);

$profile.reset(ProfileGate.close);
$tab.reset(ProfileGate.close);
