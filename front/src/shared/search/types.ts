import { SearchType } from "../search-type";

export type SearchFilters = {
  countries: Array<string>;
  searchTypes: Array<SearchType>;
  restrictions: Array<string>;
  sourceDocumentOrigins: Array<string>;
  searchTags: Array<string>;
  searchLanguage: Lang;
};

export type SyncedFilters = {
  restrictions: Array<string>;
  sourceDocumentOrigins: Array<string>;
};

export type CountriesResult = {
  countries: Array<string>;
  allowedCountries: Array<string>;
};

export enum Lang {
  en = "en",
  ru = "ru",
}

export const LANG_NAMES: Record<Lang, string> = {
  [Lang.en]: "Английский",
  [Lang.ru]: "Русский",
};

export enum QueryFormat {
  searchString = "searchString",
  excelFile = "excelFile",
}
