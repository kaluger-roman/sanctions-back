import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { socket } from "./app.api";
import { TarrifsSettingsPayload } from "./admin.types";
import { GrantUserTarrifPayload, UserTarrifsListItem } from "shared/admin";
import { Tarrif } from "shared/profile";

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

export const loadUserTariffsFx = createEffect<
  void,
  Array<UserTarrifsListItem>,
  string
>(() => {
  return socket.emitWithAnswer<void, Array<UserTarrifsListItem>>(
    ACTIONS.LOAD_USERS_TARIFFS,
  );
});

export const grantUserTariffFx = createEffect<
  GrantUserTarrifPayload,
  Array<UserTarrifsListItem>,
  string
>((payload) => {
  return socket.emitWithAnswer<
    GrantUserTarrifPayload,
    Array<UserTarrifsListItem>
  >(ACTIONS.GRANT_TARIFF, payload);
});

export const loadTarrifsFx = createEffect<void, Array<Tarrif>, string>(() => {
  return socket.emitWithAnswer<void, Array<Tarrif>>(ACTIONS.LOAD_TARRIFS);
});

export const deleteUserTariffFx = createEffect<
  { id: number },
  Array<UserTarrifsListItem>,
  string
>((payload) => {
  return socket.emitWithAnswer<{ id: number }, Array<UserTarrifsListItem>>(
    ACTIONS.DELETE_USER_TARIFF,
    payload,
  );
});
