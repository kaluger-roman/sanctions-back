export type Sanction = {
  id: number | "uplimit_code_addition" | "uplimit_description";
  sourceCountry: string;
  sourceDocument: string;
  restriction: string;
  code: string;
  description: string;
  matchedWords: Array<string>;
  sourceLink: string;
};

export type CountrySearchMatch = Record<
  string,
  (Sanction & {
    tag: string;
  })[]
>;

export type CategorySearchMath = Record<string, CountrySearchMatch>;

export type SearchResult = {
  code: CategorySearchMath;
  description: CategorySearchMath;
  codeAddition: CategorySearchMath;
};
