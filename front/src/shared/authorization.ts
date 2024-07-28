export const TOKEN_KEY = "auth-token";

export type User = {
  isAdmin: boolean;
  email: string;
  isConfirmed: boolean;
};
