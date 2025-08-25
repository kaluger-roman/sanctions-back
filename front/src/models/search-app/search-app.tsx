import { searchAppApi } from "api";
import { loadPreferencesFx } from "api/preferences.api";
import { createEffect, createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { $profile } from "models/profile/profile.model";
import { reset, spread } from "patronum";
import { SearchResult } from "shared/sanctions";
import { CounterSanctionSearchResult } from "shared/counter-sanctions";
import { Lang, SyncedFilters, QueryFormat } from "shared/search";
import { SearchType } from "shared/search-type";

export enum SearchCategory {
  sanctions = "sanctions",
  counterSanctions = "counterSanctions",
}

export const $searchCategory = createStore<SearchCategory>(
  SearchCategory.sanctions,
);
export const $countries = createStore<Array<string>>([]);
export const $allowedCountries = createStore<Array<string>>([]);
export const $restrictions = createStore<Array<string>>([]);
export const $counterSanctionsRestrictions = createStore<Array<string>>([]);
export const $searchLanguage = createStore<Lang>(Lang.en);
export const $sourceDocumentOrigins = createStore<Array<string>>([]);
export const $counterSanctionsSourceDocuments = createStore<Array<string>>([]);
export const $allowedCounterSanctionSources = createStore<Array<string>>([]);
export const $searchTags = createStore<Array<string>>([]);
export const $queryFormat = createStore<QueryFormat>(QueryFormat.searchString);
export const $searchType = createStore<Array<SearchType>>([
  "code",
  "description",
  "codeAddition",
]);

const DEFAULT_SEARCH_RESULT: SearchResult = {
  code: {},
  description: {},
  codeAddition: {},
};

const DEFAULT_COUNTER_SANCTION_SEARCH_RESULT: CounterSanctionSearchResult = {
  code: {},
  description: {},
  codeAddition: {},
};

export const $searchResult = createStore<SearchResult>(DEFAULT_SEARCH_RESULT);
export const $counterSanctionSearchResult =
  createStore<CounterSanctionSearchResult>(
    DEFAULT_COUNTER_SANCTION_SEARCH_RESULT,
  );
export const $availableFilters = createStore<SyncedFilters>({
  restrictions: [],
  sourceDocumentOrigins: [],
});

export const $availableCounterSanctionsFilters = createStore<{
  restrictions: Array<string>;
  sourceDocuments: Array<string>;
}>({
  restrictions: [],
  sourceDocuments: [],
});

export const $selectedCountries = createStore<Array<string>>([]);
export const $selectedRestrictions = createStore<Array<string>>([]);
export const $selectedSourceDocumentOrigins = createStore<Array<string>>([]);
export const $selectedCounterSanctionsRestrictions = createStore<Array<string>>(
  [],
);
export const $selectedCounterSanctionsSourceDocuments = createStore<
  Array<string>
>([]);
export const $selectedSearchTypes = createStore<Array<SearchType>>([]);
export const $isSearchHappened = createStore<boolean>(false);
export const $tooManyTagsError = createStore<boolean>(false);
export const $uploadedExcelFile = createStore<File | null>(null);
export const $excelTagsCount = createStore<number>(0);
export const $maxWebViewTagsCount = createStore<number>(0);

export const searchTagsChanged = createEvent<Array<string>>();
export const selectedCountriesChanged = createEvent<Array<string>>();
export const searchLanguageChanged = createEvent<Lang>();
export const queryFormatChanged = createEvent<QueryFormat>();
export const selectedRestrictionsChanged = createEvent<Array<string>>();
export const selectedSourceDocumentOriginsChanged =
  createEvent<Array<string>>();
export const selectedCounterSanctionsRestrictionsChanged =
  createEvent<Array<string>>();
export const selectedCounterSanctionsSourceDocumentsChanged =
  createEvent<Array<string>>();
export const searchTypeChanged = createEvent<Array<SearchType>>();
export const searchCategoryChanged = createEvent<SearchCategory>();
export const syncFilters = createEvent<void>();
export const search = createEvent<void>();
export const downloadExcelTemplateClicked = createEvent<void>();
export const parseExcelFileChanged = createEvent<File>();

export const $filtersSyncPending = searchAppApi.checkFiltersFx.pending;
export const $searchPending = searchAppApi.searchFx.pending;

export const SearchAppGate = createGate();

reset({
  clock: queryFormatChanged,
  target: [$uploadedExcelFile, $searchTags, $excelTagsCount],
});

sample({
  clock: parseExcelFileChanged,
  target: $uploadedExcelFile,
});

sample({
  clock: searchTagsChanged,
  fn: (tags) => tags.length,
  target: $excelTagsCount,
});

sample({
  clock: parseExcelFileChanged,
  target: searchAppApi.parseSearchExcelFileFx,
});

sample({
  clock: searchAppApi.parseSearchExcelFileFx.doneData,
  target: searchTagsChanged,
});

sample({
  clock: [SearchAppGate.open, $profile.map((x) => x?.id || null)],
  target: searchAppApi.loadCountriesFx,
});

sample({
  clock: [SearchAppGate.open, $profile.map((x) => x?.id || null)],
  target: searchAppApi.loadRestrictionsFx,
});

sample({
  clock: [SearchAppGate.open, $profile.map((x) => x?.id || null)],
  target: searchAppApi.loadCounterSanctionsRestrictionsFx,
});

sample({
  clock: [SearchAppGate.open, $profile.map((x) => x?.id || null)],
  target: searchAppApi.loadSourceDocumentOriginsFx,
});

sample({
  clock: [SearchAppGate.open, $profile.map((x) => x?.id || null)],
  target: searchAppApi.loadCounterSanctionsSourceDocumentsFx,
});

sample({
  clock: searchCategoryChanged,
  target: $searchCategory,
});

sample({
  clock: searchTagsChanged,
  target: $searchTags,
});

sample({
  clock: selectedCountriesChanged,
  target: $selectedCountries,
});

sample({
  clock: selectedRestrictionsChanged,
  target: $selectedRestrictions,
});

sample({
  clock: selectedSourceDocumentOriginsChanged,
  target: $selectedSourceDocumentOrigins,
});

sample({
  clock: selectedCounterSanctionsRestrictionsChanged,
  target: $selectedCounterSanctionsRestrictions,
});

sample({
  clock: selectedCounterSanctionsSourceDocumentsChanged,
  target: $selectedCounterSanctionsSourceDocuments,
});

sample({
  clock: searchLanguageChanged,
  target: $searchLanguage,
});

sample({
  clock: queryFormatChanged,
  target: $queryFormat,
});

sample({
  clock: downloadExcelTemplateClicked,
  target: searchAppApi.downloadExcelTemplateFx,
});

sample({
  clock: searchAppApi.downloadExcelTemplateFx.doneData,
  target: createEffect<{ buffer: Blob }, void>(({ buffer }) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Пример.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }),
});

sample({
  clock: searchTypeChanged,
  target: $searchType,
});

sample({
  clock: searchAppApi.loadCountriesFx.doneData,
  fn: ({ countries, allowedCountries }) => ({
    countries,
    allowedCountries,
    selectedCountries: allowedCountries,
  }),
  target: spread({
    targets: {
      countries: $countries,
      allowedCountries: $allowedCountries,
      selectedCountries: $selectedCountries,
    },
  }),
});

sample({
  clock: $selectedCountries,
  target: syncFilters,
});

sample({
  clock: searchAppApi.loadRestrictionsFx.doneData,
  target: $restrictions,
});

sample({
  clock: searchAppApi.loadCounterSanctionsRestrictionsFx.doneData,
  target: $counterSanctionsRestrictions,
});

sample({
  clock: searchAppApi.loadSourceDocumentOriginsFx.doneData,
  target: $sourceDocumentOrigins,
});

sample({
  clock: searchAppApi.loadCounterSanctionsSourceDocumentsFx.doneData,
  fn: ({ sourceDocuments }) => sourceDocuments,
  target: $counterSanctionsSourceDocuments,
});

sample({
  clock: searchAppApi.loadCounterSanctionsSourceDocumentsFx.doneData,
  fn: ({ allowedCounterSanctionSources }) => allowedCounterSanctionSources,
  target: $allowedCounterSanctionSources,
});

sample({
  clock: searchAppApi.loadCounterSanctionsSourceDocumentsFx.doneData,
  fn: ({ allowedCounterSanctionSources }) => allowedCounterSanctionSources,
  target: $selectedCounterSanctionsSourceDocuments,
});

sample({
  clock: searchAppApi.loadCountriesFx.doneData,
  source: $availableFilters,
  fn: (availableFilters, countries) => ({
    ...availableFilters,
    countries,
  }),
  target: $availableFilters,
});

sample({
  clock: $availableFilters,
  source: $selectedRestrictions,
  fn: (selectedRestrictions, { restrictions }) =>
    selectedRestrictions.filter((x) => restrictions.includes(x)),
  target: $selectedRestrictions,
});

sample({
  clock: $availableCounterSanctionsFilters,
  source: $selectedCounterSanctionsRestrictions,
  fn: (selectedRestrictions, { restrictions }) =>
    selectedRestrictions.filter((x) => restrictions.includes(x)),
  target: $selectedCounterSanctionsRestrictions,
});

sample({
  clock: $availableFilters,
  source: $selectedSourceDocumentOrigins,
  fn: (selectedSourceDocumentOrigins, { sourceDocumentOrigins }) =>
    selectedSourceDocumentOrigins.filter((x) =>
      sourceDocumentOrigins.includes(x),
    ),
  target: $selectedSourceDocumentOrigins,
});

sample({
  clock: $allowedCounterSanctionSources,
  source: $selectedCounterSanctionsSourceDocuments,
  fn: (selectedSourceDocuments, allowedSources) =>
    selectedSourceDocuments.filter((x) => allowedSources.includes(x)),
  target: $selectedCounterSanctionsSourceDocuments,
});

sample({
  clock: searchAppApi.loadRestrictionsFx.doneData,
  source: $availableFilters,
  fn: (availableFilters, restrictions) => ({
    ...availableFilters,
    restrictions,
  }),
  target: $availableFilters,
});

sample({
  clock: searchAppApi.loadCounterSanctionsRestrictionsFx.doneData,
  source: $availableCounterSanctionsFilters,
  fn: (availableFilters, restrictions) => ({
    ...availableFilters,
    restrictions,
  }),
  target: $availableCounterSanctionsFilters,
});

sample({
  clock: searchAppApi.loadSourceDocumentOriginsFx.doneData,
  source: $availableFilters,
  fn: (availableFilters, sourceDocumentOrigins) => ({
    ...availableFilters,
    sourceDocumentOrigins,
  }),
  target: $availableFilters,
});

sample({
  clock: searchAppApi.loadCounterSanctionsSourceDocumentsFx.doneData,
  source: $availableCounterSanctionsFilters,
  fn: (availableFilters, { sourceDocuments }) => ({
    ...availableFilters,
    sourceDocuments,
  }),
  target: $availableCounterSanctionsFilters,
});

sample({
  clock: syncFilters,
  source: [$selectedCountries] as const,
  fn: ([countries]) => ({
    countries,
  }),
  target: searchAppApi.checkFiltersFx,
});

sample({
  clock: searchAppApi.checkFiltersFx.doneData,
  target: $availableFilters,
});

sample({
  clock: search,
  source: [
    $selectedCountries,
    $selectedRestrictions,
    $selectedSourceDocumentOrigins,
    $searchType,
    $searchTags,
    $searchLanguage,
    $searchCategory,
  ] as const,
  filter: ([, , , , , , category]) => category === SearchCategory.sanctions,
  fn: ([
    countries,
    restrictions,
    sourceDocumentOrigins,
    searchTypes,
    searchTags,
    searchLanguage,
  ]) => ({
    countries,
    restrictions,
    sourceDocumentOrigins,
    searchTypes,
    searchTags,
    searchLanguage,
  }),
  target: searchAppApi.searchFx,
});

sample({
  clock: search,
  source: [
    $selectedCounterSanctionsRestrictions,
    $selectedCounterSanctionsSourceDocuments,
    $searchType,
    $searchTags,
    $searchCategory,
  ] as const,
  filter: ([, , , , category]) => category === SearchCategory.counterSanctions,
  fn: ([restrictions, sourceDocumentShorts, searchTypes, searchTags]) => ({
    restrictions,
    sourceDocumentShorts,
    searchTypes,
    searchTags,
  }),
  target: searchAppApi.searchCounterSanctionsFx,
});

sample({
  clock: searchAppApi.searchFx.done,
  fn: () => true,
  target: $isSearchHappened,
});

sample({
  clock: searchAppApi.searchCounterSanctionsFx.done,
  fn: () => true,
  target: $isSearchHappened,
});

sample({
  clock: searchAppApi.searchFx.failData,
  filter: (message) => message === "too_many_tags",
  fn: () => true,
  target: $tooManyTagsError,
});

sample({
  clock: searchAppApi.searchCounterSanctionsFx.failData,
  filter: (message) => message === "too_many_tags",
  fn: () => true,
  target: $tooManyTagsError,
});

sample({
  clock: searchAppApi.searchFx.doneData,
  fn: () => false,
  target: $tooManyTagsError,
});

sample({
  clock: searchAppApi.searchCounterSanctionsFx.doneData,
  fn: () => false,
  target: $tooManyTagsError,
});

sample({
  clock: $tooManyTagsError,
  filter: (error) => error,
  fn: () => DEFAULT_SEARCH_RESULT,
  target: $searchResult,
});

sample({
  clock: $tooManyTagsError,
  filter: (error) => error,
  fn: () => DEFAULT_COUNTER_SANCTION_SEARCH_RESULT,
  target: $counterSanctionSearchResult,
});

sample({
  clock: loadPreferencesFx.doneData,
  fn: ({ maxWebViewTagsCount }) => maxWebViewTagsCount,
  target: $maxWebViewTagsCount,
});

sample({
  clock: searchAppApi.searchFx.doneData,
  target: $searchResult,
});

sample({
  clock: searchAppApi.searchCounterSanctionsFx.doneData,
  target: $counterSanctionSearchResult,
});

$isSearchHappened.reset(
  $countries,
  $searchTags,
  $searchType,
  $restrictions,
  $counterSanctionsRestrictions,
  $sourceDocumentOrigins,
  $counterSanctionsSourceDocuments,
  $selectedRestrictions,
  $selectedSourceDocumentOrigins,
  $selectedCounterSanctionsRestrictions,
  $selectedCounterSanctionsSourceDocuments,
  $searchCategory,
);

$searchResult.reset($searchCategory);
$counterSanctionSearchResult.reset($searchCategory);
