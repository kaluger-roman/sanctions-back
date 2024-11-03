import { ACTIONS } from "../actions";

import { Api } from "../api.service";
import { Request } from "src/types";
import { CreatePaymentPayload } from "./types";
import { billingService } from "./billing.service";

export const billingApiHandlers = {
  [ACTIONS.BILLING_CREATE_PAYMENT]: (payload: Request<CreatePaymentPayload>) =>
    billingService.createPayment(payload),
  [ACTIONS.BILLING_TARRIF_USER_NOTICED]: (payload: Request<void>) =>
    billingService.userTarrifNoticed(payload),
};

export const billingApi = new Api(billingApiHandlers);
