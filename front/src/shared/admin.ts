import { ClientCategory, TarrifKind } from "./billing";
import { UserTarrif } from "./profile";

export type UserTarrifsListItem = {
  user: { email: string; category: ClientCategory };
  tariffs: Array<UserTarrif>;
};

export type GrantUserTarrifPayload = {
  email: string;
  endDate: Date | null;
  tarrifId: TarrifKind;
};

export enum AdminPaths {
  root = "/admin",

  preferences = "/admin/preferences",
  data = "/admin/data",
  users = "/admin/users",
}
