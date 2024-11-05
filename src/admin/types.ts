import { Tarrif } from "@prisma/client";

export type TarrifSettings = {
  tarrifs: Array<Partial<Tarrif>>;
};
