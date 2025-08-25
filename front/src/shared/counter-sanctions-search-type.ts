export type CounterSanctionSearchType = "code" | "description" | "codeAddition";

export const CounterSanctionSearchTypeName: Record<
  CounterSanctionSearchType,
  string
> = {
  code: "Совпадение по коду",
  description: "Совпадение по описанию",
  codeAddition: "Возможное дополнение кода",
};
