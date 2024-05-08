export type Sanction = {
  id: number;
  sourceCountry: string;
  sourceDocument: string;
  restriction: string;
  code: string;
  description: string;
};

export type SearchResult = Record<
  string,
  Record<
    string,
    (Sanction & {
      tag: string;
    })[]
  >
>;
