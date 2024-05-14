import { searchService } from "./search.service";
import { ACTIONS } from "../actions";

import { SearchFilters } from "./search-app.types";
import { Api } from "../api.service";
import { Request } from "src/types";

export const searchApiHandlers = {
  [ACTIONS.LOAD_COUNTRIES]: () => searchService.loadCountries(),
  [ACTIONS.LOAD_RESTRICTIONS]: () => searchService.loadRestrictions(),
  [ACTIONS.CHECK_FILTERS]: (payload: Request<SearchFilters>) =>
    searchService.applyIntermediateFilters(payload),
  [ACTIONS.SEARCH]: (payload: Request<SearchFilters>) =>
    searchService.search(payload),
};

export const searchApi = new Api(searchApiHandlers);
