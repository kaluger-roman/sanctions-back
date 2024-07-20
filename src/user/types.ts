export type AuthPayload = { email: string; password: string };
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
