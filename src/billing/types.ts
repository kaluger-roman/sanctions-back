export type CreatePaymentPayload = {
  tariffKind: TarrifKind;
};

export const enum TarrifKind {
  free = "free",
  physBasic = "physBasic",
  physUpper = "physUpper",
  physPro = "physPro",
  jurBasic = "jurBasic",
  jurUpper = "jurUpper",
  jurPro = "jurPro",
}

export type AddRequestsPaymentPayload = {
  kind: AdditionalRequestsPaymentKind;
};

export enum AdditionalRequestsPaymentKind {
  additional100 = "additional100",
  additional200 = "additional200",
  additional300 = "additional300",
}
