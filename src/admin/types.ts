import { Tarrif } from "@prisma/client";
import { TarrifKind } from "src/billing/types";

export type TarrifSettings = {
  tarrifs: Array<Partial<Tarrif>>;
};

export type CounterSanctionsTarrifSettings = {
  tarrifs: Array<Partial<Tarrif>>;
};

export type GrantUserTarrifPayload = {
  email: string;
  endDate?: Date;
  tarrifId: TarrifKind;
};
