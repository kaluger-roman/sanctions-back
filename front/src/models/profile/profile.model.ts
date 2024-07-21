import { profileApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { Profile } from "shared/profile";

export const $profile = createStore<Profile | null>(null);

export const $tab = createStore<"profile" | "tarrif" | "credentials">(
  "profile",
);

export const ProfileGate = createGate<void>();

export const changeTab = createEvent<"profile" | "tarrif" | "credentials">();

sample({
  clock: ProfileGate.open,
  target: profileApi.loadCurrentProfileFx,
});

sample({
  clock: profileApi.loadCurrentProfileFx.doneData,
  target: $profile,
});
