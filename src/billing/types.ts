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
