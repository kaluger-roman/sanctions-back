import { createHash } from "crypto";

export const buildPasswordHash = (password: string) => {
  return createHash("sha256").update(password).digest("hex");
};
