export type AuthPayload = { email: string; password: string };
export type RegisterPayload = AuthPayload;
export type RecoverRequestPayload = { email: string };
export type RecoverConfirmPayload = {
  recoverPasswordToken: string;
  password: string;
};
