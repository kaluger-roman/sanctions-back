import { Notification } from "@master_kufa/client-tools";
import { authApi, profileApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { appModel } from "models/app/";
import { validatePassword } from "shared/auth.helpers";
import { TarrifKind } from "shared/billing";
import { Profile } from "shared/profile";

export const $profile = createStore<Profile | null>(null);
export const $currentTarrif = $profile.map(
  (profile) =>
    profile?.tarrifs.find(
      (x) =>
        new Date(x.start).getTime() < new Date().getTime() &&
        new Date(x.end).getTime() > new Date().getTime(),
    ) || profile?.tarrifs.find((x) => x.tarrif.identifier === TarrifKind.free),
);

export const $oldPassword = createStore("");
export const $newPassword = createStore("");
export const $newPasswordRepeat = createStore("");

export const $newPasswordError = createStore<string>("");
export const $newPasswordRepeatError = createStore<string>("");
export const $editErrorKeys = createStore<string[]>([]);

export const $isChangePasswordActive = createStore(false);
export const $initialProfile = createStore<Profile | null>(null);

export const ProfileGate = createGate<void>();

export const toggleChangePassword = createEvent();
export const changeOldPassword = createEvent<string>();
export const changeNewPassword = createEvent<string>();
export const changeNewPasswordRepeat = createEvent<string>();
export const changePasswordClicked = createEvent();
export const changeProfileField = createEvent<{
  field: keyof Profile;
  value: string;
}>();
export const addEditErrorKey = createEvent<string>();
export const removeEditErrorKey = createEvent<string>();

export const savePasswordClicked = createEvent();
export const saveProfileClicked = createEvent();

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
  clock: savePasswordClicked,
  source: $newPassword,
  fn: (password) => validatePassword(password),
  target: $newPasswordError,
});

sample({
  clock: savePasswordClicked,
  source: [$newPassword, $newPasswordRepeat],
  fn: ([password, confirmation]) =>
    password === confirmation ? "" : "Пароли не совпадают",
  target: $newPasswordRepeatError,
});

sample({
  clock: savePasswordClicked,
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
  clock: changeProfileField,
  source: $profile,
  fn: (profile, { field, value }) =>
    ({ ...profile, [field]: value } as Profile),
  target: $profile,
});

sample({
  clock: saveProfileClicked,
  source: $profile,
  filter: (profile): profile is Profile => !!profile,
  target: profileApi.changeProfileFx,
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
  clock: profileApi.changeProfileFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Профиль успешно обновлен",
  }),
  target: Notification.add,
});

sample({
  clock: [appModel.AppGate.open, authApi.authFx.doneData, ProfileGate.open],
  target: profileApi.loadCurrentProfileFx,
});

sample({
  clock: profileApi.loadCurrentProfileFx.doneData,
  target: [$profile, $initialProfile],
});

sample({
  clock: profileApi.changeProfileFx.done,
  source: $profile,
  target: $initialProfile,
});

sample({
  clock: addEditErrorKey,
  source: $editErrorKeys,
  fn: (editErrorKeys, key) => [...editErrorKeys, key],
  target: $editErrorKeys,
});

sample({
  clock: removeEditErrorKey,
  source: $editErrorKeys,
  fn: (editErrorKeys, key) =>
    editErrorKeys.filter((editErrorKey) => editErrorKey !== key),
  target: $editErrorKeys,
});

$isChangePasswordActive.reset(
  ProfileGate.close,
  profileApi.changePasswordFx.done,
);
$newPasswordError.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPasswordRepeatError.reset(
  ProfileGate.close,
  profileApi.changePasswordFx.done,
);
$oldPassword.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPassword.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$newPasswordRepeat.reset(ProfileGate.close, profileApi.changePasswordFx.done);
$editErrorKeys.reset(ProfileGate.close, profileApi.changePasswordFx.done);

$initialProfile.reset(ProfileGate.close);
