import { adminService } from "./admin.service";
import { ACTIONS } from "../actions";

import { Api } from "../api.service";
import { Request } from "src/types";
import { TarrifSettings } from "./types";

export const adminApiHandlers = {
  [ACTIONS.RESET_SANCTIONS_DB_WITH_FILE]: (
    payload: Request<{ buffer: Buffer }>,
  ) => adminService.processFile(payload.buffer),
  [ACTIONS.SAVE_TARRIFS_SETTINGS]: (payload: Request<TarrifSettings>) =>
    adminService.changeTarrifSettings(payload),
  [ACTIONS.LOAD_TARRIFS_SETTINGS]: () => adminService.getTarrifSettings(),
};

export const adminApi = new Api(adminApiHandlers);
