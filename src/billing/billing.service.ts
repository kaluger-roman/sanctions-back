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
import { SearchFilters } from "src/search-app/search-app.types";
import { Tarrif, UserTarrif } from "@prisma/client";
import { paymentsService } from "./payments.service";

const billing = new YooCheckout({
  shopId: env.BILLING_SHOP_ID,
  secretKey: env.BILLING_SECRET_KEY,
});

export class BillingService {
  constructor() {
    paymentsService.waitingForPayments(this.updateUserTarrif);
  }
  async getUserLastTarrif(userId: number) {
    const userLastTarrif = await prisma.userTarrif.findFirst({
      where: {
        userId,
        end: {
          gte: new Date(),
        },
      },
      orderBy: {
        end: "asc",
      },
      include: {
        tarrif: true,
      },
    });

    return userLastTarrif;
  }
  async getUserCurrentTarrif(userId: number) {
    const userLastTarrif = await prisma.userTarrif.findFirst({
      where: {
        userId,
        end: {
          gte: new Date(),
        },
        start: {
          lte: new Date(),
        },
      },
      include: {
        tarrif: true,
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

    const newEndTarrif = new Date(userLastTarrif?.end || new Date());
    newEndTarrif.setMonth(newEndTarrif.getMonth() + tarrif.duration);
    newEndTarrif.setHours(23, 59, 59, 999);

    const newStartTarrif = new Date(userLastTarrif?.end || new Date());
    newStartTarrif.setDate(newEndTarrif.getDate() + (userLastTarrif ? 1 : 0));
    newStartTarrif.setHours(0, 0, 0, 0);

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
      },
      orderBy: {
        end: "asc",
      },
      include: {
        tarrif: true,
      },
    });

    ActiveConnections[user.id]?.forEach(async (socket) => {
      socket.emit(ACTIONS.BILLING_TARRIF_UPDATED, userTarrifs);
    });
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
}

export const billingService = new BillingService();
