import { createEffect } from "effector";
import {
  AddRequestsPaymentPayload,
  CreatePaymentPayload,
} from "shared/billing";
import { socket } from "./app.api";
import { ACTIONS } from "./actions";

export const createPaymentFx = createEffect<
  CreatePaymentPayload,
  { confirmation_url: string },
  string
>((data) =>
  socket.emitWithAnswer<CreatePaymentPayload, { confirmation_url: string }>(
    ACTIONS.BILLING_CREATE_PAYMENT,
    data,
  ),
);

export const addRequestsPaymentFx = createEffect<
  AddRequestsPaymentPayload,
  { confirmation_url: string },
  string
>((data) =>
  socket.emitWithAnswer<
    AddRequestsPaymentPayload,
    { confirmation_url: string }
  >(ACTIONS.BILLING_ADD_REQUESTS_PAYMENT, data),
);

export const newTarrifNoticed = createEffect(() =>
  socket.emitWithAnswer(ACTIONS.BILLING_TARRIF_USER_NOTICED, {
    isUserNoticed: true,
  }),
);
