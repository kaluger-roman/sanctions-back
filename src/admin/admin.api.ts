import { adminService } from "./admin.service";
import { ACTIONS } from "../actions";

import { Api } from "../api.service";
import { Request } from "src/types";
import { GrantUserTarrifPayload, TarrifSettings } from "./types";

export const adminApiHandlers = {
  [ACTIONS.RESET_SANCTIONS_DB_WITH_FILE]: (
    payload: Request<{ buffer: Buffer }>,
  ) => adminService.processFile(payload.buffer),
  [ACTIONS.SAVE_TARRIFS_SETTINGS]: (payload: Request<TarrifSettings>) =>
    adminService.changeTarrifSettings(payload),
  [ACTIONS.LOAD_TARRIFS_SETTINGS]: () => adminService.getTarrifSettings(),
  [ACTIONS.LOAD_USERS_TARIFFS]: () =>
    adminService.getUserTariffs(), 
  [ACTIONS.GRANT_TARIFF]: (
    payload: Request<GrantUserTarrifPayload>,
  ) => adminService.grantTariff(payload),
  [ACTIONS.LOAD_TARRIFS]: () => adminService.loadTarrifs(),
  [ACTIONS.DELETE_USER_TARIFF]: (payload: Request<{ id: number }>) =>
    adminService.deleteUserTariff(payload),
};

export const adminApi = new Api(adminApiHandlers);
