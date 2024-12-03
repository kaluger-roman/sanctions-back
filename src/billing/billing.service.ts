import { Request } from "src/types";
import { UserService } from "../user/user.service";
import { Payment, YooCheckout } from "@a2seven/yoo-checkout";
import { env } from "process";
import { prisma } from "../../prisma";
import { ACTIONS } from "../actions";
import { AdditionalPayments, UserTarrifsInclude } from "./constants";
import { ActiveConnections } from "../active-connections";
import { paymentsService } from "./payments.service";

export class BillingService {
  constructor() {
    paymentsService.waitingForPayments(
      this.updateUserTarrif.bind(this),
      this.updateSearchRequests.bind(this),
    );
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
        end: "desc",
      },
      include: {
        tarrif: true,
      },
    });

    return userLastTarrif;
  }

  // can be null if free tarrif
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
      ...UserTarrifsInclude,
    });

    ActiveConnections[user.id]?.forEach(async (socket) => {
      socket.emit(ACTIONS.BILLING_TARRIF_UPDATED, { tarrifs: userTarrifs });
    });
  }
  async updateSearchRequests(paymentInfo: Payment) {
    const user = await prisma.user.findFirst({
      where: { id: Number(paymentInfo.metadata.userId) },
    });

    const userCurrentTarrif = await this.getUserCurrentTarrif(user.id);

    await prisma.userTarrif.update({
      where: {
        id: userCurrentTarrif.id,
      },
      data: {
        isUserNoticed: false,
        additionalRequestsCount:
          userCurrentTarrif?.additionalRequestsCount +
          (AdditionalPayments[paymentInfo.metadata.additionalRequestsKind]
            ?.amount || 0),
      },
    });

    const userTarrifs = await prisma.userTarrif.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        end: "asc",
      },
      ...UserTarrifsInclude,
    });

    ActiveConnections[user.id]?.forEach(async (socket) => {
      socket.emit(ACTIONS.BILLING_TARRIF_UPDATED, { tarrifs: userTarrifs });
    });
  }
  async userTarrifNoticed({ token }: Request<void>) {
    const user = await UserService.getUserByToken(token);

    await prisma.userTarrif.updateMany({
      where: {
        userId: user.id,
        isUserNoticed: false,
      },
      data: {
        isUserNoticed: true,
      },
    });
  }
}

export const billingService = new BillingService();
