export enum ClientCategory {
  private = "private",
  company = "company",
}

export type TarrifCard = {
  durationTitle: string;
  description: string;
  features: Array<string>;
  price: number;
  kind: TarrifKind;
};

export type CreatePaymentPayload = {
  tariffKind: TarrifKind;
};

export enum TarrifKind {
  free = "free",
  physBasic = "physBasic",
  physUpper = "physUpper",
  physPro = "physPro",
  jurBasic = "jurBasic",
  jurUpper = "jurUpper",
  jurPro = "jurPro",
}
