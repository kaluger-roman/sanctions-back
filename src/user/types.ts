import { UserTarrif } from "@prisma/client";

export type AuthPayload = {
  email: string;
  password: string;
  forceLogin?: boolean;
};
export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  surname: string;
  secondName?: string;
  phone: string;
  companyName?: string;
  INN?: string;
  clientCategory: ClientCategory;
};

export type RecoverTokenRequestPayload = { email: string };
export type RecoverConfirmPayload = {
  password: string;
  recoverPasswordToken: string;
};

export type RegistrationConfirmPayload = {
  confirmToken: string;
};

export enum ClientCategory {
  private = "private",
  company = "company",
}

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

export type LastActivityPayload = {
  timestamp: number;
};

export enum FORCE_LOGOUT_REASON {
  INACTIVITY = "INACTIVITY",
  NEW_SESSION = "NEW_SESSION",
}
