import { AddRequestsPaymentPayload, CreatePaymentPayload } from "./types";
import { Request } from "src/types";
import { UserService } from "../user/user.service";
import { Payment, YooCheckout } from "@a2seven/yoo-checkout";
import { env } from "process";
import { prisma } from "../../prisma";
import { nanoid } from "nanoid";
import { AdditionalPayments, TarrifCategories, TarrifNames } from "./constants";
import { searchQuotasService } from "../search-app/search-quotas.service";

const billing = new YooCheckout({
  shopId: env.BILLING_SHOP_ID,
  secretKey: env.BILLING_SECRET_KEY,
});

export class PaymentsService {
  async waitingForPayments(
    updateUserTarrif: (payment: Payment) => void,
    addSearchRequests: (payment: Payment) => void,
  ) {
    while (true) {
      try {
        const pendingPayments = await prisma.pendingPayment.findMany();

        for await (const payment of pendingPayments) {
          const paymentInfo = await billing.getPayment(payment.id);

          if (paymentInfo.status === "succeeded") {
            if (paymentInfo.metadata.tarrifId) {
              await updateUserTarrif(paymentInfo);
            }

            if (paymentInfo.metadata.additionalRequestsKind) {
              await addSearchRequests(paymentInfo);
            }

            await prisma.pendingPayment.delete({
              where: { id: paymentInfo.id },
            });
          } else if (paymentInfo.status === "canceled") {
            await prisma.pendingPayment.delete({
              where: { id: paymentInfo.id },
            });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (e) {
        console.log(e);
      }
    }
  }
  async createPayment({ tariffKind, token }: Request<CreatePaymentPayload>) {
    const tarrif = await prisma.tarrif.findFirst({
      where: { identifier: tariffKind },
    });

    if (!tarrif) throw new Error("Тариф не найден");

    const user = await UserService.getUserByToken(token);

    const pendingPayments = await billing.getPaymentList({
      status: "pending",
    });

    const pendingUserPayment = pendingPayments.items.find(
      ({ metadata }) =>
        String(metadata.userId) === String(user.id) &&
        metadata.tarrifId === tarrif.identifier,
    );

    if (pendingUserPayment) {
      return {
        confirmation_url: pendingUserPayment.confirmation.confirmation_url,
      };
    }

    const idempotencyId = nanoid();

    const description = `Тариф ${TarrifNames[tarrif.identifier]} (${
      TarrifCategories[tarrif.identifier]
    }) - ${tarrif.duration} мес. id: ${user.id}`;

    const amount = {
      value: user.isAdmin ? "10.00" : tarrif.price.toFixed(2),
      currency: "RUB",
    };

    const payment = await billing.createPayment(
      {
        amount,
        capture: true,
        description,
        confirmation: {
          type: "redirect",
          return_url: `${env.FRONT_HOST}/profile/tariff`,
        },
        save_payment_method: false,
        metadata: {
          userId: user.id,
          idempotencyId,
          tarrifId: tarrif.identifier,
        },
        receipt: {
          customer: {
            email: user.email,
            phone: user.phone,
          },
          items: [
            {
              payment_mode: "full_payment",
              payment_subject: "service",
              description,
              quantity: "1",
              amount,
              vat_code: 1,
            },
          ],
        },
      },
      idempotencyId,
    );

    await prisma.pendingPayment.create({
      data: {
        id: payment.id,
      },
    });

    return {
      confirmation_url: payment.confirmation.confirmation_url,
    };
  }

  async createAdditionalRequestsPayment({
    kind,
    token,
  }: Request<AddRequestsPaymentPayload>) {
    const user = await UserService.getUserByToken(token);
    const tariffs = await prisma.userTarrif.findMany({
      where: { userId: user.id },
      include: { tarrif: true },
    });
    const isUserUnlimitedRequests =
      searchQuotasService.isUserUnlimitedRequests(tariffs);

    if (isUserUnlimitedRequests) {
      throw new Error("У вас уже неограниченное количество запросов.");
    }

    const idempotencyId = nanoid();

    const { price, amount } = AdditionalPayments[kind];

    const payment = await billing.createPayment(
      {
        amount: {
          value: price.toFixed(2),
          currency: "RUB",
        },
        capture: true,
        save_payment_method: false,
        description: `Доп. лимиты +${amount} запросов. id: ${user.id}`,
        confirmation: {
          type: "redirect",
          return_url: `${env.FRONT_HOST}/profile/tariff`,
        },
        metadata: {
          userId: user.id,
          idempotencyId,
          additionalRequestsKind: kind,
        },
      },
      idempotencyId,
    );

    await prisma.pendingPayment.create({ data: { id: payment.id } });

    return { confirmation_url: payment.confirmation.confirmation_url };
  }
}

export const paymentsService = new PaymentsService();
