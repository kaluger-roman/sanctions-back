export type AuthPayload = { email: string; password: string };
export type RegisterPayload = AuthPayload;
export type RecoverTokenRequestPayload = { email: string };
export type RecoverConfirmPayload = {
  password: string;
  recoverPasswordToken: string;
};
