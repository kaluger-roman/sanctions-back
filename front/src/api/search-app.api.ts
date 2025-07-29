import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { SearchResult } from "shared/sanctions";
import { CountriesResult, SearchFilters, SyncedFilters } from "shared/search";
import { socket } from "./app.api";

export const parseSearchExcelFileFx = createEffect<File, string[], string>(
  (data) => {
    return socket.emitWithAnswer<{ data: File }, string[]>(
      ACTIONS.PARSE_SEARCH_EXCEL_FILE,
      { data },
    );
  },
);

export const downloadExcelTemplateFx = createEffect<
  void,
  { buffer: Blob },
  string
>(
  async () =>
    await socket.emitWithAnswer<void, { buffer: Blob }>(
      ACTIONS.DOWNLOAD_EXCEL_TEMPLATE,
    ),
);

export const loadCountriesFx = createEffect<void, CountriesResult, string>(() =>
  socket.emitWithAnswer<void, CountriesResult>(ACTIONS.LOAD_COUNTRIES),
);

export const loadRestrictionsFx = createEffect<void, Array<string>, string>(
  () => socket.emitWithAnswer<void, Array<string>>(ACTIONS.LOAD_RESTRICTIONS),
);

export const loadSourceDocumentOriginsFx = createEffect<
  void,
  Array<string>,
  string
>(() =>
  socket.emitWithAnswer<void, Array<string>>(
    ACTIONS.LOAD_SOURCE_DOCUMENT_ORIGINS,
  ),
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
