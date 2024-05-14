import { userService } from "./user.service";
import { RegisterPayload } from "./types";
import { ACTIONS } from "../actions";
import { Api } from "../api.service";
import { Request } from "../types";

export const userApiHandlers = {
  [ACTIONS.AUTH]: (payload: Request<RegisterPayload>) =>
    userService.auth(payload),
  [ACTIONS.REGISTER]: (payload: Request<RegisterPayload>) =>
    userService.create(payload),
  [ACTIONS.VERIFY]: (payload: Request<void>) => payload.token,
};

export const userApi = new Api(userApiHandlers);
