import { sanctionsManagementService } from "./sanctions-management.service";
import { ACTIONS } from "../actions";

import { Api, Request } from "@master_kufa/server-tools";

export const sanctionsManagementApiHandlers = {
  [ACTIONS.RESET_SANCTIONS_DB_WITH_FILE]: (
    payload: Request<{ buffer: Buffer }>,
  ) => sanctionsManagementService.processFile(payload.buffer),
};

export const sanctionsManagementApi = new Api(sanctionsManagementApiHandlers);
