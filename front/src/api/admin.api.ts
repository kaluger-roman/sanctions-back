import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { socket } from "./app.api";
import { TarrifsSettingsPayload } from "./admin.types";

export const uploadSanctionsFileFx = createEffect<
  { buffer: Blob },
  void,
  string
>((payload) => {
  return socket.emitWithAnswer<{ buffer: Blob }, void>(
    ACTIONS.RESET_SANCTIONS_DB_WITH_FILE,
    payload,
  );
});

export const changeTarrifsSettingsFx = createEffect<
  TarrifsSettingsPayload,
  void,
  string
>((payload) => {
  return socket.emitWithAnswer<TarrifsSettingsPayload, void>(
    ACTIONS.SAVE_TARRIFS_SETTINGS,
    payload,
  );
});

export const loadTarrifsSettingsFx = createEffect<
  void,
  TarrifsSettingsPayload,
  string
>(() => {
  return socket.emitWithAnswer<void, TarrifsSettingsPayload>(
    ACTIONS.LOAD_TARRIFS_SETTINGS,
  );
});
