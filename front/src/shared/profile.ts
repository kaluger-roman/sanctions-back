import { ClientCategory, TarrifKind } from "./billing";

export type Profile = {
  id: number;
  email: string;
  isAdmin?: boolean;
  name: string;
  surname: string;
  secondName?: string;
  phone: string;
  INN?: string;
  category: ClientCategory;
  isConfirmed: boolean;
  companyName?: string;
  lastPasswordChangeTime?: string;
  tarrifs: Array<UserTarrif>;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type UserTarrif = {
  start: string;
  end: string;
  tarrif: Tarrif;
};

export type Tarrif = {
  identifier: TarrifKind;
};
