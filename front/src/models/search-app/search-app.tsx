import { searchAppApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { $profile } from "models/profile/profile.model";
import { spread } from "patronum";
import { SearchResult } from "shared/sanctions";
import { Lang, SyncedFilters } from "shared/search";
import { SearchType } from "shared/search-type";

export const $countries = createStore<Array<string>>([]);
export const $allowedCountries = createStore<Array<string>>([]);
export const $restrictions = createStore<Array<string>>([]);
export const $searchLanguage = createStore<Lang>(Lang.en);
export const $sourceDocumentOrigins = createStore<Array<string>>([]);
export const $searchTags = createStore<Array<string>>([]);
export const $searchType = createStore<Array<SearchType>>([
  "code",
  "description",
  "codeAddition",
]);
export const $searchResult = createStore<SearchResult>({
  code: {},
  description: {},
  codeAddition: {},
});
export const $availableFilters = createStore<SyncedFilters>({
  restrictions: [],
  sourceDocumentOrigins: [],
});

export const $selectedCountries = createStore<Array<string>>([]);
export const $selectedRestrictions = createStore<Array<string>>([]);
export const $selectedSourceDocumentOrigins = createStore<Array<string>>([]);
export const $selectedSearchTypes = createStore<Array<SearchType>>([]);
export const $isSearchHappened = createStore<boolean>(false);

export const searchTagsChanged = createEvent<Array<string>>();
export const selectedCountriesChanged = createEvent<Array<string>>();
export const searchLanguageChanged = createEvent<Lang>();
export const selectedRestrictionsChanged = createEvent<Array<string>>();
export const selectedSourceDocumentOriginsChanged =
  createEvent<Array<string>>();
export const searchTypeChanged = createEvent<Array<SearchType>>();
export const syncFilters = createEvent<void>();
export const search = createEvent<void>();

export const $filtersSyncPending = searchAppApi.checkFiltersFx.pending;
export const $searchPending = searchAppApi.searchFx.pending;

export const SearchAppGate = createGate();

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
  target: searchAppApi.loadSourceDocumentOriginsFx,
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
  clock: searchLanguageChanged,
  target: $searchLanguage,
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
  clock: searchAppApi.loadSourceDocumentOriginsFx.doneData,
  target: $sourceDocumentOrigins,
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
  clock: $availableFilters,
  source: $selectedSourceDocumentOrigins,
  fn: (selectedSourceDocumentOrigins, { sourceDocumentOrigins }) =>
    selectedSourceDocumentOrigins.filter((x) =>
      sourceDocumentOrigins.includes(x),
    ),
  target: $selectedSourceDocumentOrigins,
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
  clock: searchAppApi.loadSourceDocumentOriginsFx.doneData,
  source: $availableFilters,
  fn: (availableFilters, sourceDocumentOrigins) => ({
    ...availableFilters,
    sourceDocumentOrigins,
  }),
  target: $availableFilters,
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
  ] as const,
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
  clock: searchAppApi.searchFx.done,
  fn: () => true,
  target: $isSearchHappened,
});

sample({
  clock: searchAppApi.searchFx.doneData,
  target: $searchResult,
});

$isSearchHappened.reset(
  $countries,
  $searchTags,
  $searchType,
  $restrictions,
  $sourceDocumentOrigins,
);
