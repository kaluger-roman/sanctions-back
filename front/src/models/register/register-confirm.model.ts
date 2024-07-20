import { authApi } from "api";
import { createStore, sample } from "effector";
import { createGate } from "effector-react";

export const $confirmToken = createStore<string>("");
export const $isSuccess = createStore<boolean>(false);
export const $pending = authApi.registrationConfirmFx.pending;

export const RegisterConfirmPageGate = createGate<string>("");

sample({
  clock: RegisterConfirmPageGate.open,
  target: $confirmToken,
});

sample({
  clock: $confirmToken,
  filter: Boolean,
  fn: (confirmToken) => ({ confirmToken }),
  target: authApi.registrationConfirmFx,
});

sample({
  clock: authApi.registrationConfirmFx.doneData,
  fn: () => true,
  target: $isSuccess,
});
