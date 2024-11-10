export type Sanction = {
  id: number | "uplimit";
  sourceCountry: string;
  sourceDocument: string;
  restriction: string;
  code: string;
  description: string;
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
