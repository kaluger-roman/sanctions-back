export type CounterSanction = {
  id: number | "uplimit_code_addition" | "uplimit_description";
  code: string;
  description: string;
  exception: string;
  sourceDocument: string;
  restriction: string;
  sourceDocumentShort: string;
  matchedWords: Array<string>;
};

export type CounterSanctionSearchMatch = Record<
  string,
  (CounterSanction & {
    tag: string;
  })[]
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
