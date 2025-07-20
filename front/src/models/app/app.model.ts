import {
  appApi,
  authApi,
  billingApi,
  contactUsApi,
  profileApi,
  adminApi,
  searchAppApi,
  reportsApi,
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
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";
import { loadPreferencesFx } from "api/preferences.api";

export const $isLoading = createStore<boolean>(true);
export const $loadingProgress = createStore<number>(NaN);
export const $authorizationData = createStore<User | null>(null);

const $commonPendingRequests = combine(
  searchAppApi.loadCountriesFx.pending,
  searchAppApi.searchFx.pending,
  reportsApi.generateExcelReportFx.pending,
  reportsApi.downloadReportFx.pending,
  reportsApi.saveReportToMyReportsFx.pending,
  reportsApi.removeReportFx.pending,
  reportsApi.loadUserReportsFx.pending,
  reportsApi.deleteMultipleReportsFx.pending,
  reportsApi.downloadMultipleReportsFx.pending,
  authApi.recoverRequestFx.pending,
  authApi.registrationConfirmFx.pending,
  profileApi.loadCurrentProfileFx.pending,
  profileApi.changePasswordFx.pending,
  profileApi.changeProfileFx.pending,
  billingApi.createPaymentFx.pending,
  billingApi.addRequestsPaymentFx.pending,
  adminApi.changeTarrifsSettingsFx.pending,
  adminApi.changeTarrifsSettingsFx.pending,
  adminApi.grantUserTariffFx.pending,
  adminApi.deleteUserTariffFx.pending,
  profileApi.retryConfirmEmailFx.pending,
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
  clock: [authApi.verifyFx.failData, authApi.logoutFx.done],
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

$authorizationData.reset(authApi.logoutFx.done);

sample({
  clock: authApi.logoutFx.done,
  target: createEffect(() => {
    navigation.navigate(Paths.root);
  }),
});

sample({
  clock: LogOut,
  target: authApi.logoutFx,
});

sample({
  clock: [
    adminApi.uploadSanctionsFileFx.failData,
    contactUsApi.submitForm.failData,
    authApi.recoverRequestFx.failData,
    authApi.recoverConfirmFx.failData,
    authApi.registrationConfirmFx.failData,
    profileApi.changePasswordFx.failData,
    profileApi.changeProfileFx.failData,
    billingApi.createPaymentFx.failData,
    searchAppApi.searchFx.failData,
    reportsApi.generateExcelReportFx.failData,
    reportsApi.downloadReportFx.failData,
    billingApi.addRequestsPaymentFx.failData,
    adminApi.changeTarrifsSettingsFx.failData,
    adminApi.changeTarrifsSettingsFx.failData,
    adminApi.grantUserTariffFx.failData,
    adminApi.deleteUserTariffFx.failData,
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
export function AdminGate(AdminGate: any) {
  throw new Error("Function not implemented.");
}

sample({
  clock: AppGate.open,
  target: loadPreferencesFx,
});
