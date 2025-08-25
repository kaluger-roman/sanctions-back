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
  isUnlimitedRequests: boolean;
  isUnlimitedDevices: boolean;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type UserTarrif = {
  id: number;
  start: string;
  end: string;
  tarrif: Tarrif;
  additionalRequestsCount: number;
  _count: {
    searchRequest: number;
    devices: number;
    counterSanctionSearchRequest: number;
  };
};

export type Tarrif = {
  identifier: TarrifKind;
  allowedRequests: number;
  allowedDevices: number;
  allowedCountries: Array<string>;
  allowedCounterSanctionSources?: Array<string>;
};
