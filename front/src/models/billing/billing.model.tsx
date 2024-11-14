import { billingApi } from "api";
import { createEffect, createEvent, createStore, sample } from "effector";
import { appModel } from "models/app";
import {
  AdditionalRequestsPaymentKind,
  AddRequestsPaymentPayload,
  CreatePaymentPayload,
  TarrifKind,
} from "shared/billing";
import { Notification } from "@master_kufa/client-tools";
import { createGate } from "effector-react";
import { connectSocketFx, socket } from "api/app.api";
import { ACTIONS } from "api/actions";
import { profileModel } from "models/profile";
import { TARRIF_UPDATED_SHOWED_KEY } from "./billing.constants";
import { Link, Typography } from "@mui/material";
import { Paths } from "shared/paths";
import { navigation } from "shared/navigate";
import { theme } from "shared/theme";
import { CategoryNames, TarrifCategories } from "pages/billing/constants";

export const createPayment = createEvent<TarrifKind>();
export const createAddRequestsPayment =
  createEvent<AdditionalRequestsPaymentKind>();
export const tarrifUpdatedNoticeChanged = createEvent<boolean>();
export const tarrifSoonExpiredNoticeChanged = createEvent<boolean>();

export const $isTarrifUpdateNotification = createStore<boolean>(
  localStorage[TARRIF_UPDATED_SHOWED_KEY] === "true" || false,
);

export const $isTarrifSoonExpireNotification = createStore<boolean>(false);

sample({
  clock: tarrifUpdatedNoticeChanged,
  target: $isTarrifUpdateNotification,
});

sample({
  clock: tarrifSoonExpiredNoticeChanged,
  target: $isTarrifSoonExpireNotification,
});

sample({
  clock: profileModel.$profile,
  filter: (profile) => {
    const lastTarrif = profile?.tarrifs.filter((x) => x.end).at(-1);
    const end = lastTarrif?.end;

    if (!end) return false;

    const endDate = new Date(end);
    const offsetDate = new Date();

    offsetDate.setFullYear(
      offsetDate.getFullYear(),
      offsetDate.getMonth(),
      offsetDate.getDate() +
        ([TarrifKind.jurBasic, TarrifKind.physBasic].includes(
          lastTarrif.tarrif.identifier,
        )
          ? 3
          : 14),
    );

    return endDate.getTime() < offsetDate.getTime();
  },
  fn: () => true,
  target: $isTarrifSoonExpireNotification,
});

export const BillingGate = createGate();

sample({
  clock: createPayment,
  source: appModel.$authorizationData,
  filter: (authorizationData) => !authorizationData,
  fn: (): Notification.PayloadType => ({
    type: "error",
    message:
      "Для покупки тарифа войдите в личный кабинет или зарегистрируйтесь!",
  }),
  target: Notification.add,
});

sample({
  clock: createPayment,
  source: profileModel.$profile,
  filter: (profile) => !!(profile && !profile?.isConfirmed),
  fn: (): Notification.PayloadType => ({
    type: "error",
    message: (
      <Typography variant="body2">
        {" "}
        Для покупки тарифа{" "}
        <Link
          sx={{ cursor: "pointer", color: theme.palette.error.main }}
          onClick={() => navigation.navigate(Paths.profileMy)}
        >
          подтвердите почту{" "}
        </Link>{" "}
      </Typography>
    ) as any,
  }),
  target: Notification.add,
});

sample({
  clock: createPayment,
  source: profileModel.$profile,
  filter: (profile, tariffKind) =>
    profile?.category !== TarrifCategories[tariffKind],
  fn: (profile): Notification.PayloadType => ({
    type: "error",
    message: `Вам доступны только тарифы категории "${
      CategoryNames[profile!.category]
    }"`,
  }),
  target: Notification.add,
});

sample({
  clock: createPayment,
  source: profileModel.$profile,
  filter: (profile, tariffKind) =>
    Boolean(
      profile &&
        profile.isConfirmed &&
        profile.category === TarrifCategories[tariffKind],
    ),
  fn: (_, tariffKind) => ({ tariffKind } satisfies CreatePaymentPayload),
  target: billingApi.createPaymentFx,
});

sample({
  clock: connectSocketFx,
  target: createEffect(() => {
    const showBillingNotice = () => {
      localStorage[TARRIF_UPDATED_SHOWED_KEY] = true;
      tarrifUpdatedNoticeChanged(true);
    };

    socket.client.on(ACTIONS.BILLING_TARRIF_UPDATED, (payload) => {
      profileModel.changeProfileField({ field: "tarrifs", value: payload });

      showBillingNotice();
    });

    socket.client.on(
      ACTIONS.BILLING_TARRIF_USER_NOTICED,
      (payload: { isUserNoticed: boolean }) => {
        if (payload.isUserNoticed) return;

        showBillingNotice();
      },
    );
  }),
});

sample({
  clock: tarrifUpdatedNoticeChanged,
  filter: (value) => !value,
  target: billingApi.newTarrifNoticed,
});

sample({
  clock: tarrifUpdatedNoticeChanged,
  filter: (value) => !value,
  target: createEffect(() => {
    localStorage[TARRIF_UPDATED_SHOWED_KEY] = false;
  }),
});

sample({
  clock: billingApi.createPaymentFx.doneData,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Платеж создан, после оплаты тариф появится в личном кабинете!",
  }),
  target: Notification.add,
});

sample({
  clock: [
    billingApi.createPaymentFx.doneData,
    billingApi.addRequestsPaymentFx.doneData,
  ],
  target: createEffect<{ confirmation_url: string }, void>(
    ({ confirmation_url }) => {
      const isOpened = window.open(confirmation_url, "_blank");

      if (!isOpened) window.location.href = confirmation_url;
    },
  ),
});

sample({
  clock: createAddRequestsPayment,
  fn: (kind) => ({ kind } satisfies AddRequestsPaymentPayload),
  target: billingApi.addRequestsPaymentFx,
});

sample({
  clock: billingApi.addRequestsPaymentFx.doneData,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Платеж создан, вскоре после оплаты лимиты обновятся!",
  }),
  target: Notification.add,
});
