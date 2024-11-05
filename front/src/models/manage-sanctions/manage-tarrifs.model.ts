import { adminApi, searchAppApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { AdminGate } from "./admin.model";
import { TarrifKind } from "shared/billing";
import { Tarrif } from "shared/profile";
import { Notification } from "@master_kufa/client-tools";

export const $tarrifsSettings = createStore<Array<Partial<Tarrif>>>([]);

export const $selectedFreeCountries = $tarrifsSettings.map(
  (tarrifs) =>
    tarrifs.find((tarrif) => tarrif.identifier === TarrifKind.free)
      ?.allowedCountries || [],
);
export const $selectedPaidCountries = $tarrifsSettings.map(
  (tarrifs) =>
    tarrifs.find((tarrif) => tarrif.identifier === TarrifKind.jurPro)
      ?.allowedCountries || [],
);

export const selectedFreeCountriesChanged = createEvent<Array<string>>();
export const selectedPaidCountriesChanged = createEvent<Array<string>>();

export const saveTarrifs = createEvent<void>();

sample({
  clock: selectedFreeCountriesChanged,
  source: $tarrifsSettings,
  fn: (tarrifs, countries) =>
    tarrifs.map((tarrif) =>
      tarrif.identifier === TarrifKind.free
        ? { ...tarrif, allowedCountries: countries }
        : tarrif,
    ),
  target: $tarrifsSettings,
});

sample({
  clock: selectedPaidCountriesChanged,
  source: $tarrifsSettings,
  fn: (tarrifs, countries) =>
    tarrifs.map((tarrif) =>
      tarrif.identifier === TarrifKind.jurPro
        ? { ...tarrif, allowedCountries: countries }
        : tarrif,
    ),
  target: $tarrifsSettings,
});

sample({
  clock: [AdminGate.open, adminApi.changeTarrifsSettingsFx.doneData],
  target: [searchAppApi.loadCountriesFx, adminApi.loadTarrifsSettingsFx],
});

sample({
  clock: adminApi.loadTarrifsSettingsFx.doneData,
  fn: ({ tarrifs }) => tarrifs,
  target: $tarrifsSettings,
});

sample({
  clock: saveTarrifs,
  source: [$selectedFreeCountries, $selectedPaidCountries] as const,
  fn: ([free, paid]) => ({
    tarrifs: [
      { identifier: TarrifKind.free, allowedCountries: free },
      { identifier: TarrifKind.jurPro, allowedCountries: paid },
    ],
  }),
  target: adminApi.changeTarrifsSettingsFx,
});

sample({
  clock: adminApi.changeTarrifsSettingsFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Сохранено!",
  }),
  target: Notification.add,
});
