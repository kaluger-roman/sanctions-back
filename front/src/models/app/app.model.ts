import {
  appApi,
  authApi,
  contactUsApi,
  sanctionsManagementApi,
  searchAppApi,
} from "api";
import {
  Store,
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { Notification } from "@master_kufa/client-tools";
import { createGate } from "effector-react";
import { socket } from "api/app.api";
import { TOKEN_KEY, User } from "shared/authorization";
import { jwtDecode } from "jwt-decode";

export const $isLoading = createStore<boolean>(true);
export const $loadingProgress = createStore<number>(NaN);
export const $authorizationData = createStore<User | null>(null);

const $commonPendingRequests = combine(
  searchAppApi.loadCountriesFx.pending,
  socket.$isConnected.map((isConnected) => !isConnected),
  (...requests: Array<boolean>) => requests.some(Boolean),
) as unknown as Store<boolean>;

export const setIsLoading = createEvent<boolean>();
export const setLoadingProgress = createEvent<number>();
export const LogOut = createEvent();

export const AppGate = createGate();

sample({
  clock: AppGate.open,
  target: appApi.connectSocketFx,
});

sample({
  clock: AppGate.open,
  target: authApi.verifyFx,
});

sample({
  clock: [authApi.verifyFx.failData, LogOut],
  target: createEffect(() => {
    localStorage[TOKEN_KEY] = "";
  }),
});

sample({
  clock: authApi.authFx.doneData,
  target: createEffect<string, void>((token) => {
    localStorage[TOKEN_KEY] = token;
  }),
});

sample({
  clock: [authApi.verifyFx.doneData, authApi.authFx.doneData],
  fn: (token) => jwtDecode<User>(token),
  target: $authorizationData,
});

$authorizationData.reset(LogOut);

sample({
  clock: [
    sanctionsManagementApi.uploadSanctionsFileFx.failData,
    contactUsApi.submitForm.failData,
  ],
  fn: (error?: string): Notification.PayloadType => ({
    type: "error",
    message: error || "An error occurred. Please try again later.",
  }),
  target: Notification.add,
});

sample({
  clock: setIsLoading,
  target: $isLoading,
});

sample({
  clock: setLoadingProgress,
  target: $loadingProgress,
});

sample({
  clock: $commonPendingRequests,
  target: $isLoading,
});

sample({
  clock: $commonPendingRequests,
  filter: (commonPendingRequests) => !commonPendingRequests,
  fn: () => NaN,
  target: $loadingProgress,
});
