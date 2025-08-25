import { adminApi, searchAppApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { AdminGate } from "./admin.model";
import { TarrifKind } from "shared/billing";
import { Tarrif } from "shared/profile";
import { Notification } from "@master_kufa/client-tools";
import { CounterSanctionsTarrifsSettingsPayload } from "api/admin.types";

export const $counterSanctionsTarrifsSettings = createStore<
  Array<Partial<Tarrif>>
>([]);
export const $counterSanctionsSources = createStore<Array<string>>([]);

export const $selectedFreeCounterSanctionSources =
  $counterSanctionsTarrifsSettings.map(
    (tarrifs) =>
      tarrifs.find((tarrif) => tarrif.identifier === TarrifKind.free)
        ?.allowedCounterSanctionSources || [],
  );
export const $selectedPaidCounterSanctionSources =
  $counterSanctionsTarrifsSettings.map(
    (tarrifs) =>
      tarrifs.find((tarrif) => tarrif.identifier === TarrifKind.jurPro)
        ?.allowedCounterSanctionSources || [],
  );

export const selectedFreeCounterSanctionSourcesChanged =
  createEvent<Array<string>>();
export const selectedPaidCounterSanctionSourcesChanged =
  createEvent<Array<string>>();

export const saveCounterSanctionsTarrifs = createEvent<void>();

sample({
  clock: selectedFreeCounterSanctionSourcesChanged,
  source: $counterSanctionsTarrifsSettings,
  fn: (tarrifs, sources) =>
    tarrifs.map((tarrif) =>
      tarrif.identifier === TarrifKind.free
        ? { ...tarrif, allowedCounterSanctionSources: sources }
        : tarrif,
    ),
  target: $counterSanctionsTarrifsSettings,
});

sample({
  clock: selectedPaidCounterSanctionSourcesChanged,
  source: $counterSanctionsTarrifsSettings,
  fn: (tarrifs, sources) =>
    tarrifs.map((tarrif) =>
      tarrif.identifier === TarrifKind.jurPro
        ? { ...tarrif, allowedCounterSanctionSources: sources }
        : tarrif,
    ),
  target: $counterSanctionsTarrifsSettings,
});

sample({
  clock: [
    AdminGate.open,
    adminApi.changeCounterSanctionsTarrifsSettingsFx.doneData,
  ],
  target: [
    searchAppApi.loadCounterSanctionsSourceDocumentsFx,
    adminApi.loadCounterSanctionsTarrifsSettingsFx,
  ],
});

sample({
  clock: adminApi.loadCounterSanctionsTarrifsSettingsFx.doneData,
  fn: ({ tarrifs }: CounterSanctionsTarrifsSettingsPayload) => tarrifs,
  target: $counterSanctionsTarrifsSettings,
});

sample({
  clock: searchAppApi.loadCounterSanctionsSourceDocumentsFx.doneData,
  fn: ({ sourceDocuments }) => sourceDocuments,
  target: $counterSanctionsSources,
});

sample({
  clock: saveCounterSanctionsTarrifs,
  source: [
    $selectedFreeCounterSanctionSources,
    $selectedPaidCounterSanctionSources,
  ] as const,
  fn: ([free, paid]: readonly [Array<string>, Array<string>]) => ({
    tarrifs: [
      { identifier: TarrifKind.free, allowedCounterSanctionSources: free },
      { identifier: TarrifKind.jurPro, allowedCounterSanctionSources: paid },
    ],
  }),
  target: adminApi.changeCounterSanctionsTarrifsSettingsFx,
});

sample({
  clock: adminApi.changeCounterSanctionsTarrifsSettingsFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Настройки тарифов контрсанкций сохранены!",
  }),
  target: Notification.add,
});
