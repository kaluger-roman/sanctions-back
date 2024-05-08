import { searchAppApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { appModel } from "models/app";
import { SearchResult } from "shared/sanctions";
import { SyncedFilters } from "shared/search";
import { SearchType } from "shared/search-type";

export const $countries = createStore<Array<string>>([]);
export const $restrictions = createStore<Array<string>>([]);
export const $searchTags = createStore<Array<string>>([]);
export const $searchType = createStore<Array<SearchType>>([
  "code",
  "description",
]);
export const $searchResult = createStore<SearchResult>({});
export const $availableFilters = createStore<SyncedFilters>({
  countries: [],
  restrictions: [],
});

export const $selectedCountries = createStore<Array<string>>([]);
export const $selectedRestrictions = createStore<Array<string>>([]);
export const $selectedSearchTypes = createStore<Array<SearchType>>([]);
export const $isSearchHappened = createStore<boolean>(false);

export const searchTagsChanged = createEvent<Array<string>>();
export const selectedCountriesChanged = createEvent<Array<string>>();
export const selectedRestrictionsChanged = createEvent<Array<string>>();
export const searchTypeChanged = createEvent<Array<SearchType>>();
export const syncFilters = createEvent<void>();
export const search = createEvent<void>();

export const $filtersSyncPending = searchAppApi.checkFiltersFx.pending;

sample({
  clock: appModel.AppGate.open,
  target: searchAppApi.loadCountriesFx,
});

sample({
  clock: appModel.AppGate.open,
  target: searchAppApi.loadRestrictionsFx,
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
  clock: searchTypeChanged,
  target: $searchType,
});

sample({
  clock: searchAppApi.loadCountriesFx.doneData,
  target: $countries,
});

sample({
  clock: searchAppApi.loadRestrictionsFx.doneData,
  target: $restrictions,
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
  clock: searchAppApi.loadRestrictionsFx.doneData,
  source: $availableFilters,
  fn: (availableFilters, restrictions) => ({
    ...availableFilters,
    restrictions,
  }),
  target: $availableFilters,
});

sample({
  clock: syncFilters,
  source: [
    $selectedCountries,
    $selectedRestrictions,
    $searchType,
    $searchTags,
  ] as const,
  fn: ([countries, restrictions, searchTypes, searchTags]) => ({
    countries,
    restrictions,
    searchTypes,
    searchTags,
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
    $searchType,
    $searchTags,
  ] as const,
  fn: ([countries, restrictions, searchTypes, searchTags]) => ({
    countries,
    restrictions,
    searchTypes,
    searchTags,
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

$isSearchHappened.reset($countries, $searchTags, $searchType, $restrictions);
