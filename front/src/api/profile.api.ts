import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { socket } from "./app.api";
import { ChangePasswordPayload, Profile } from "shared/profile";

export const loadCurrentProfileFx = createEffect<void, Profile, string>(() =>
  socket.emitWithAnswer<void, Profile>(ACTIONS.LOAD_PROFILE),
);

export const changePasswordFx = createEffect<
  ChangePasswordPayload,
  void,
  string
>((data) =>
  socket.emitWithAnswer<ChangePasswordPayload, void>(
    ACTIONS.CHANGE_PASSWORD,
    data,
  ),
);
