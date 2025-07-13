import { isEmpty } from "lodash";
import { SearchResult } from "shared/sanctions";

export const isSearchEmpty = (search: SearchResult) =>
  [search.code, search.description, search.codeAddition].every(isEmpty);
