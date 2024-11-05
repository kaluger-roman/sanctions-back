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

export type AddRequestsPaymentPayload = {
  kind: AdditionalRequestsPaymentKind;
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

export enum AdditionalRequestsPaymentKind {
  additional100 = "additional100",
  additional200 = "additional200",
  additional300 = "additional300",
}
