import { adminApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { Notification } from "@master_kufa/client-tools";

export const $selectedFileDB = createStore<File | null>(null);

export const fileChanged = createEvent<File>();
export const updateDB = createEvent<void>();

sample({
  clock: fileChanged,
  target: $selectedFileDB,
});

sample({
  clock: updateDB,
  source: $selectedFileDB,
  filter: Boolean,
  fn: (buffer) => ({ buffer }),
  target: adminApi.uploadSanctionsFileFx,
});

$selectedFileDB.reset(adminApi.uploadSanctionsFileFx.done);

sample({
  clock: adminApi.uploadSanctionsFileFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Успешно обновлено",
  }),
  target: Notification.add,
});
