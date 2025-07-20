import { preferencesService } from "./preferences.service";
import { ACTIONS } from "../actions";
import { Api } from "../api.service";
import { Request } from "../types";

export const preferencesApiHandlers = {
  [ACTIONS.LOAD_PREFERENCES]: (payload: Request<void>) =>
    preferencesService.loadPreferences(payload),
};

export const preferencesApi = new Api(preferencesApiHandlers);
