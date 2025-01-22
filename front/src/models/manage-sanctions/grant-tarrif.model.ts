import { adminApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { UserTarrifsListItem } from "shared/admin";
import { AdminGate } from "./admin.model";
import { TarrifKind } from "shared/billing";
import { Notification } from "@master_kufa/client-tools";

export const $userTariffs = createStore<Array<UserTarrifsListItem>>([]);
export const $email = createStore<string>("");
export const $endDate = createStore<Date | null>(null);
export const $tarrifId = createStore<TarrifKind>(TarrifKind.demoPro);

export const deleteUserTariff = createEvent<number>();
export const emailChanged = createEvent<string>();
export const endDateChanged = createEvent<Date | null>();
export const tarrifIdChanged = createEvent<TarrifKind>();

export const grantUserTariff = createEvent<void>();

sample({
  clock: [
    adminApi.loadUserTariffsFx.doneData,
    adminApi.grantUserTariffFx.doneData,
    adminApi.deleteUserTariffFx.doneData,
  ],
  target: $userTariffs,
});

sample({
  clock: AdminGate.open,
  target: adminApi.loadUserTariffsFx,
});

sample({
  clock: emailChanged,
  target: $email,
});

sample({
  clock: endDateChanged,
  target: $endDate,
});

sample({
  clock: tarrifIdChanged,
  target: $tarrifId,
});

sample({
  clock: grantUserTariff,
  source: {
    email: $email,
    endDate: $endDate,
    tarrifId: $tarrifId,
  },
  target: adminApi.grantUserTariffFx,
});

sample({
  clock: deleteUserTariff,
  fn: (id) => ({ id }),
  target: adminApi.deleteUserTariffFx,
});

sample({
  clock: [
    adminApi.grantUserTariffFx.doneData,
    adminApi.deleteUserTariffFx.doneData,
  ],
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Успешно!",
  }),
  target: Notification.add,
});
