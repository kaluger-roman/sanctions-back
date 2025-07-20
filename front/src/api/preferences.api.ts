import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { socket } from "./app.api";
import { Preferences } from "shared/preferences";

export const loadPreferencesFx = createEffect<void, Preferences, string>(() =>
  socket.emitWithAnswer<void, Preferences>(ACTIONS.LOAD_PREFERENCES),
);
