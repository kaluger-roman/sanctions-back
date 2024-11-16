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
};
export type RecoverRequestPayload = { email: string };
export type RecoverConfirmPayload = {
  recoverPasswordToken: string;
  password: string;
};

export type RegistrationConfirmPayload = {
  confirmToken: string;
};
