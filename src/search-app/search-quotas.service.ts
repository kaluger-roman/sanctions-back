import { Tarrif, UserTarrif } from "@prisma/client";
import { billingService } from "../billing/billing.service";
import { UserService } from "../user/user.service";
import { SearchFilters } from "./search-app.types";
import { CounterSanctionSearchFilters } from "./counter-sanctions.types";
import { prisma } from "../../prisma";
import { ActiveConnections } from "../active-connections";
import { ACTIONS } from "../actions";
import { UserTarrifsInclude } from "../billing/constants";

const DEVICE_QUOTA_CHECK_TIME = 3 * 60 * 1000;

class SearchQuotasService {
  constructor() {
    setInterval(() => this.resetDeviceQuota(), DEVICE_QUOTA_CHECK_TIME);
  }
  async resetDeviceQuota() {
    const users = await prisma.user.findMany();

    for (const user of users) {
      const tarrif = await billingService.getUserCurrentTarrif(user.id);
      const resetPeriod = user.isAdmin
        ? 5 * 60 * 1000
        : 3 * 24 * 60 * 60 * 1000;

      if (!tarrif) continue;

      const tarrifPending = Date.now() - tarrif.start.getTime();
      const isNeedReset =
        tarrifPending > resetPeriod &&
        tarrifPending % resetPeriod < DEVICE_QUOTA_CHECK_TIME;

      if (!isNeedReset) continue;

      const registeredDevices = await prisma.device.findMany({
        where: {
          UserTarrif: { some: { id: tarrif.id } },
        },
      });

      for (const device of registeredDevices) {
        await prisma.device.update({
          where: { id: device.id },
          data: { UserTarrif: { disconnect: [{ id: tarrif.id }] } },
        });
      }

      const userTarrifs = await prisma.userTarrif.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          end: "asc",
        },
        ...UserTarrifsInclude,
      });

      ActiveConnections[user.id]?.forEach(async ({ socket }) => {
        socket.emit(ACTIONS.BILLING_TARRIF_UPDATED, {
          tarrifs: userTarrifs,
          isQuiet: true,
        });
      });
    }
  }
  isUserUnlimitedRequests(userTarrifs: Array<UserTarrif & { tarrif: Tarrif }>) {
    return userTarrifs.some(
      (tarrif) =>
        tarrif.end?.getTime() > new Date().getTime() &&
        tarrif.tarrif.allowedRequests === null,
    );
  }
  isUserUnlimitedDevices(userTarrifs: Array<UserTarrif & { tarrif: Tarrif }>) {
    return userTarrifs.some(
      (tarrif) =>
        tarrif.end?.getTime() > new Date().getTime() &&
        tarrif.tarrif.allowedDevices === null,
    );
  }
  async registerDevice(deviceId: string, token: string) {
    const { id: userId } = await UserService.getUserByToken(token);
    const tarrif = await billingService.getUserCurrentTarrif(userId);
    const tarrifs = await prisma.userTarrif.findMany({
      where: { userId },
      include: { tarrif: true },
    });
    const isUserUnlimitedDevices = this.isUserUnlimitedDevices(tarrifs);

    if (!tarrif) return;

    const registeredDevices = await prisma.device.findMany({
      where: {
        UserTarrif: { some: { id: tarrif.id } },
      },
    });

    if (
      !isUserUnlimitedDevices &&
      registeredDevices.length >= tarrif.tarrif.allowedDevices &&
      !registeredDevices.some((device) => device.id === deviceId)
    ) {
      throw new Error(
        "Превышен лимит устройств для поиска, улучшите ваш тариф или используйте предыдущие устройства",
      );
    }

    return prisma.device.upsert({
      where: { id: deviceId },
      update: { UserTarrif: { connect: { id: tarrif.id } } },
      create: { id: deviceId, UserTarrif: { connect: { id: tarrif.id } } },
    });
  }
  async registerSearchRequest(payload: SearchFilters, token: string) {
    const { id: userId } = await UserService.getUserByToken(token);
    const tarrif = await billingService.getUserCurrentTarrif(userId);
    const tarrifs = await prisma.userTarrif.findMany({
      where: { userId },
      include: { tarrif: true },
    });
    const isUserUnlimitedRequests = this.isUserUnlimitedRequests(tarrifs);

    if (!tarrif) return;

    // Считаем общее количество запросов (обычные + контрсанкции)
    const totalSearchRequests = await prisma.searchRequest.count({
      where: { userTarrifId: tarrif.id },
    });
    const totalCounterSanctionRequests =
      await prisma.counterSanctionSearchRequest.count({
        where: { userTarrifId: tarrif.id },
      });

    if (
      !isUserUnlimitedRequests &&
      totalSearchRequests + totalCounterSanctionRequests >=
        tarrif.tarrif.allowedRequests + tarrif.additionalRequestsCount
    ) {
      throw new Error("Превышен лимит запросов для поиска, улучшите ваш тариф");
    }

    return prisma.searchRequest.create({
      data: {
        UserTarrif: { connect: { id: tarrif.id } },
        ...payload,
      },
    });
  }

  async registerCounterSanctionSearchRequest(
    payload: CounterSanctionSearchFilters,
    token: string,
  ) {
    const { id: userId } = await UserService.getUserByToken(token);
    const tarrif = await billingService.getUserCurrentTarrif(userId);
    const tarrifs = await prisma.userTarrif.findMany({
      where: { userId },
      include: { tarrif: true },
    });
    const isUserUnlimitedRequests = this.isUserUnlimitedRequests(tarrifs);

    if (!tarrif) return;

    // Считаем общее количество запросов (обычные + контрсанкции)
    const totalSearchRequests = await prisma.searchRequest.count({
      where: { userTarrifId: tarrif.id },
    });
    const totalCounterSanctionRequests =
      await prisma.counterSanctionSearchRequest.count({
        where: { userTarrifId: tarrif.id },
      });

    if (
      !isUserUnlimitedRequests &&
      totalSearchRequests + totalCounterSanctionRequests >=
        tarrif.tarrif.allowedRequests + tarrif.additionalRequestsCount
    ) {
      throw new Error("Превышен лимит запросов для поиска, улучшите ваш тариф");
    }

    return prisma.counterSanctionSearchRequest.create({
      data: {
        UserTarrif: { connect: { id: tarrif.id } },
        ...payload,
      },
    });
  }
}

export const searchQuotasService = new SearchQuotasService();
