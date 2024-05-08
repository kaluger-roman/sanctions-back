import { SearchType } from "./search-type";

export type SearchFilters = {
  countries: Array<string>;
  searchTypes: Array<SearchType>;
  restrictions: Array<string>;
  searchTags: Array<string>;
};

export type SyncedFilters = {
  countries: Array<string>;
  restrictions: Array<string>;
};
