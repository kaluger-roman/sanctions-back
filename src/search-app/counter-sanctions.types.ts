import { CounterSanction } from "@prisma/client";

export type CounterSanctionSearchType = "code" | "description" | "codeAddition";

export type CounterSanctionSearchFilters = {
  searchTypes: Array<CounterSanctionSearchType>;
  searchTags: Array<string>;
  restrictions: Array<string>;
  sourceDocumentShorts: Array<string>;
};

export type CounterSanctionSearchMatch = Record<
  string,
  Array<
    CounterSanction & {
      tag: string;
    }
  >
>;

export type CounterSanctionCategorySearchMatch = Record<
  string,
  CounterSanctionSearchMatch
>;

export type CounterSanctionSearchResult = {
  code: CounterSanctionCategorySearchMatch;
  description: CounterSanctionCategorySearchMatch;
  codeAddition: CounterSanctionCategorySearchMatch;
};
