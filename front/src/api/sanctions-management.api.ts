import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { socket } from "./app.api";

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
