import { SearchType } from "./search-type";

export type SearchFilters = {
  countries: Array<string>;
  searchTypes: Array<SearchType>;
  restrictions: Array<string>;
  sourceDocumentOrigins: Array<string>;
  searchTags: Array<string>;
};

export type SyncedFilters = {
  restrictions: Array<string>;
  sourceDocumentOrigins: Array<string>;
};

export type CountriesResult = {
  countries: Array<string>;
  allowedCountries: Array<string>;
};
