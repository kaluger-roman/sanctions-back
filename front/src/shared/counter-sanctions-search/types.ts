import { CounterSanctionSearchType } from "../counter-sanctions-search-type";

export type CounterSanctionSearchFilters = {
  searchTypes: Array<CounterSanctionSearchType>;
  restrictions: Array<string>;
  sourceDocumentShorts: Array<string>;
  searchTags: Array<string>;
};
