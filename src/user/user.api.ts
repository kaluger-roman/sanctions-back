import { userService } from "./user.service";
import {
  RecoverConfirmPayload,
  RecoverTokenRequestPayload,
  RegisterPayload,
  RegistrationConfirmPayload,
} from "./types";
import { ACTIONS } from "../actions";
import { Api } from "../api.service";
import { Request } from "../types";
import { profileService } from "./profile.service";

export const userApiHandlers = {
  [ACTIONS.AUTH]: (payload: Request<RegisterPayload>) =>
    userService.auth(payload),
  [ACTIONS.REGISTER]: (payload: Request<RegisterPayload>) =>
    userService.create(payload),
  [ACTIONS.VERIFY]: (payload: Request<void>) => payload.token,
  [ACTIONS.RECOVER_PASSWORD_REQUEST]: (
    payload: Request<RecoverTokenRequestPayload>,
  ) => userService.recoverTokenRequest(payload),
  [ACTIONS.RECOVER_PASSWORD_CONFIRM]: (
    payload: Request<RecoverConfirmPayload>,
  ) => userService.recoverPasswordConfirm(payload),
  [ACTIONS.REGISTRATION_CONFIRM]: (
    payload: Request<RegistrationConfirmPayload>,
  ) => userService.registrationConfirm(payload),
  [ACTIONS.LOAD_PROFILE]: (payload: Request<void>) =>
    profileService.loadProfile(payload.token),
};

export const userApi = new Api(userApiHandlers);
