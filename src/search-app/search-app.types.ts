import { Lang } from "../shared/search";

export type SearchFilters = {
  countries: Array<string>;
  searchTypes: Array<SearchType>;
  restrictions: Array<string>;
  sourceDocumentOrigins: Array<string>;
  searchTags: Array<string>;
  searchLanguage: Lang;
};

export type SearchType = "code" | "description" | "codeAddition";
