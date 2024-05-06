export type SearchFilters = {
  countries: Array<string>;
  searchTypes: Array<SearchType>;
  restrictions: Array<string>;
  searchTags: Array<string>;
};

export type SearchType = "code" | "description";
