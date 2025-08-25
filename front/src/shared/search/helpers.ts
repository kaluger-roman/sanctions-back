import { isEmpty } from "lodash";
import { SearchResult } from "shared/sanctions";
import { CounterSanctionSearchResult } from "shared/counter-sanctions";

export const isSearchEmpty = (search: SearchResult) =>
  search &&
  [search.code, search.description, search.codeAddition].every(isEmpty);

export const isCounterSanctionSearchEmpty = (
  search: CounterSanctionSearchResult,
) =>
  search &&
  [search.code, search.description, search.codeAddition].every(isEmpty);
