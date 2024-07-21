import { ClientCategory } from "./billing";

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
};
