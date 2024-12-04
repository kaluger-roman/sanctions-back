import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { SearchResult } from "shared/sanctions";
import { CountriesResult, SearchFilters, SyncedFilters } from "shared/search";
import { socket } from "./app.api";

export const loadCountriesFx = createEffect<void, CountriesResult, string>(() =>
  socket.emitWithAnswer<void, CountriesResult>(ACTIONS.LOAD_COUNTRIES),
);

export const loadRestrictionsFx = createEffect<void, Array<string>, string>(
  () => socket.emitWithAnswer<void, Array<string>>(ACTIONS.LOAD_RESTRICTIONS),
);

export const checkFiltersFx = createEffect<
  { countries: Array<string> },
  SyncedFilters,
  string
>((payload) =>
  socket.emitWithAnswer<{ countries: Array<string> }, SyncedFilters>(
    ACTIONS.CHECK_FILTERS,
    payload,
  ),
);

export const searchFx = createEffect<SearchFilters, SearchResult, string>(
  (payload) =>
    socket.emitWithAnswer<SearchFilters, SearchResult>(ACTIONS.SEARCH, payload),
);
