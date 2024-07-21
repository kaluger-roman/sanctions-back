import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { socket } from "./app.api";
import { Profile } from "shared/profile";

export const loadCurrentProfileFx = createEffect<void, Profile, string>(() =>
  socket.emitWithAnswer<void, Profile>(ACTIONS.LOAD_PROFILE),
);
