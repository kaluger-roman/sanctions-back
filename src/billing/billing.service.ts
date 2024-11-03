import { CreatePaymentPayload, TarrifKind } from "./types";
import { Request } from "src/types";
import { UserService } from "../user/user.service";
import { Payment, YooCheckout } from "@a2seven/yoo-checkout";
import { env } from "process";
import { prisma } from "../../prisma";
import { nanoid } from "nanoid";
import { ACTIONS } from "../actions";
import { TarrifCategories, TarrifNames } from "./constants";
import { ActiveConnections } from "../active-connections";

const billing = new YooCheckout({
  shopId: env.BILLING_SHOP_ID,
  secretKey: env.BILLING_SECRET_KEY,
});

export class BillingService {
  async getUserLastTarrif(userId: number) {
    const userLastTarrif = await prisma.userTarrif.findFirst({
      where: {
        userId,
        end: {
          gte: new Date(),
        },
      },
      orderBy: {
        end: "desc",
      },
    });

    return userLastTarrif;
  }
  async updateUserTarrif(paymentInfo: Payment) {
    const user = await prisma.user.findFirst({
      where: { id: Number(paymentInfo.metadata.userId) },
    });

    const tarrif = await prisma.tarrif.findFirst({
      where: { identifier: paymentInfo.metadata.tarrifId },
    });

    const userLastTarrif = await this.getUserLastTarrif(user.id);

    const newEndTarrif = new Date(userLastTarrif.end || new Date());
    newEndTarrif.setMonth(newEndTarrif.getMonth() + tarrif.duration);
    newEndTarrif.setHours(23, 59, 59, 999);

    const newStartTarrif = new Date(userLastTarrif.end || new Date());
    newEndTarrif.setDate(newEndTarrif.getDate() + 1);
    newEndTarrif.setHours(0, 0, 0, 0);

    await prisma.userTarrif.create({
      data: {
        user: { connect: { id: user.id } },
        tarrif: { connect: { id: tarrif.id } },
        start: newStartTarrif,
        end: newEndTarrif,
      },
    });

    const userTarrifs = await prisma.userTarrif.findMany({
      where: {
        userId: user.id,
        end: {
          gte: new Date(),
        },
      },
      orderBy: {
        end: "desc",
      },
    });

    ActiveConnections[user.id]?.forEach(async (socket) => {
      socket.emit(ACTIONS.BILLING_TARRIF_UPDATED, userTarrifs);
    });
  }
  async waitingForPayments() {
    while (true) {
      try {
        const pendingPayments = await prisma.pendingPayment.findMany();

        for await (const payment of pendingPayments) {
          const paymentInfo = await billing.getPayment(payment.id);

          if (paymentInfo.status === "succeeded") {
            await this.updateUserTarrif(paymentInfo);
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
  async userTarrifNoticed({ token }: Request<void>) {
    const user = await UserService.getUserByToken(token);

    const lastTarrif = await billingService.getUserLastTarrif(user.id);

    await prisma.userTarrif.update({
      include: { user: true },
      where: {
        id: lastTarrif.id,
      },
      data: {
        isUserNoticed: true,
      },
    });
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

    const payment = await billing.createPayment(
      {
        amount: {
          value: tarrif.price.toFixed(2),
          currency: "RUB",
        },
        capture: true,
        description: `Тариф ${TarrifNames[tarrif.identifier]} (${
          TarrifCategories[tarrif.identifier]
        }) - ${tarrif.duration} мес.`,
        confirmation: {
          type: "redirect",
          return_url: `${env.FRONT_HOST}/profile/tariff`,
        },
        metadata: {
          userId: user.id,
          idempotencyId,
          tarrifId: tarrif.identifier,
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
}

export const billingService = new BillingService();

billingService.waitingForPayments();
