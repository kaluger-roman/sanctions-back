import { searchService } from "./search.service";
import { ACTIONS } from "../actions";

import { SearchFilters } from "./search-app.types";
import { CounterSanctionSearchFilters } from "./counter-sanctions.types";
import { Api } from "../api.service";
import { Request } from "src/types";

export const searchApiHandlers = {
  [ACTIONS.LOAD_COUNTRIES]: (payload: Request<void>) =>
    searchService.loadCountries(payload),
  [ACTIONS.LOAD_RESTRICTIONS]: () => searchService.loadRestrictions(),
  [ACTIONS.LOAD_SOURCE_DOCUMENT_ORIGINS]: () =>
    searchService.loadSourceDocumentOrigins(),
  [ACTIONS.LOAD_COUNTER_SANCTIONS_RESTRICTIONS]: () =>
    searchService.loadCounterSanctionsRestrictions(),
  [ACTIONS.LOAD_COUNTER_SANCTIONS_SOURCE_DOCUMENTS]: (payload: Request<void>) =>
    searchService.loadCounterSanctionsSourceDocuments(payload),
  [ACTIONS.CHECK_FILTERS]: (
    payload: Request<{
      countries: Array<string>;
    }>,
  ) => searchService.applyIntermediateFilters(payload),
  [ACTIONS.SEARCH]: (payload: Request<SearchFilters>) =>
    searchService.search(payload),
  [ACTIONS.SEARCH_COUNTER_SANCTIONS]: (payload: Request<CounterSanctionSearchFilters>) =>
    searchService.searchCounterSanctions(payload),
  [ACTIONS.PARSE_SEARCH_EXCEL_FILE]: async (
    payload: Request<{ data: Buffer | ArrayBuffer | Uint8Array }>,
  ) => searchService.parseExcelTags(payload.data),
  [ACTIONS.DOWNLOAD_EXCEL_TEMPLATE]: async () =>
    searchService.downloadExcelTemplate(),
};

export const searchApi = new Api(searchApiHandlers);
