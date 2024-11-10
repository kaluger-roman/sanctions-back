export type SearchType = "code" | "description" | "codeAddition";

export const SearchTypeName: Record<SearchType, string> = {
  code: "Совпадение по коду",
  description: "Совпадение по описанию",
  codeAddition: "Возможное дополнение кода",
};
