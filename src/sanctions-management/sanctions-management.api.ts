import { sanctionsManagementService } from "./sanctions-management.service";
import { ACTIONS } from "../actions";

import { Api } from "../api.service";
import { Request } from "src/types";

export const sanctionsManagementApiHandlers = {
  [ACTIONS.RESET_SANCTIONS_DB_WITH_FILE]: (
    payload: Request<{ buffer: Buffer }>,
  ) => sanctionsManagementService.processFile(payload.buffer),
};

export const sanctionsManagementApi = new Api(sanctionsManagementApiHandlers);
