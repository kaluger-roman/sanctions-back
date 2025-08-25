import { adminApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { Notification } from "@master_kufa/client-tools";

export const $selectedCounterSanctionsFileDB = createStore<File | null>(null);

export const counterSanctionsFileChanged = createEvent<File>();
export const updateCounterSanctionsDB = createEvent<void>();

sample({
  clock: counterSanctionsFileChanged,
  target: $selectedCounterSanctionsFileDB,
});

sample({
  clock: updateCounterSanctionsDB,
  source: $selectedCounterSanctionsFileDB,
  filter: Boolean,
  fn: (buffer) => ({ buffer }),
  target: adminApi.uploadCounterSanctionsFileFx,
});

$selectedCounterSanctionsFileDB.reset(
  adminApi.uploadCounterSanctionsFileFx.done,
);

sample({
  clock: adminApi.uploadCounterSanctionsFileFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "База контрсанкций успешно обновлена",
  }),
  target: Notification.add,
});
