import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { SearchResult } from "shared/sanctions";
import { SearchFilters, SyncedFilters } from "shared/search";
import { socket } from "./app.api";

export const loadCountriesFx = createEffect<void, Array<string>, string>(() =>
  socket.emitWithAnswer<void, Array<string>>(ACTIONS.LOAD_COUNTRIES),
);

export const loadRestrictionsFx = createEffect<void, Array<string>, string>(
  () => socket.emitWithAnswer<void, Array<string>>(ACTIONS.LOAD_RESTRICTIONS),
);

export const checkFiltersFx = createEffect<
  SearchFilters,
  SyncedFilters,
  string
>((payload) =>
  socket.emitWithAnswer<SearchFilters, SyncedFilters>(
    ACTIONS.CHECK_FILTERS,
    payload,
  ),
);

export const searchFx = createEffect<SearchFilters, SearchResult, string>(
  (payload) =>
    socket.emitWithAnswer<SearchFilters, SearchResult>(ACTIONS.SEARCH, payload),
);
