import { Tarrif } from "shared/profile";

export type TarrifsSettingsPayload = {
  tarrifs: Array<Partial<Tarrif>>;
};

export type CounterSanctionsTarrifsSettingsPayload = {
  tarrifs: Array<Partial<Tarrif>>;
};
