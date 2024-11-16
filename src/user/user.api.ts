import { userService } from "./user.service";
import {
  ChangePasswordPayload,
  LastActivityPayload,
  Profile,
  RecoverConfirmPayload,
  RecoverTokenRequestPayload,
  RegisterPayload,
  RegistrationConfirmPayload,
} from "./types";
import { ACTIONS } from "../actions";
import { Api } from "../api.service";
import { Request } from "../types";
import { profileService } from "./profile.service";
import { sessionsService } from "./sessions.service";

export const userApiHandlers = {
  [ACTIONS.AUTH]: (payload: Request<RegisterPayload>) =>
    sessionsService.auth(payload),
  [ACTIONS.REGISTER]: (payload: Request<RegisterPayload>) =>
    userService.create(payload),
  [ACTIONS.VERIFY]: async (payload: Request<object>) => {
    await sessionsService.verifySession(payload);
    return payload.token;
  },
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
  [ACTIONS.CHANGE_PASSWORD]: (payload: Request<ChangePasswordPayload>) =>
    userService.changePassword(payload),
  [ACTIONS.CHANGE_PROFILE]: (payload: Request<Profile>) =>
    profileService.changeProfile(payload),
  [ACTIONS.LAST_ACTIVITY_TIME]: (payload: Request<LastActivityPayload>) =>
    sessionsService.recordLastActivity(payload),
  [ACTIONS.LOGOUT]: (payload: Request<void>, socket) =>
    sessionsService.logout(payload, socket),
};

export const userApi = new Api(userApiHandlers);
