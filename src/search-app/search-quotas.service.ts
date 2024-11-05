import { Tarrif, UserTarrif } from "@prisma/client";
import { billingService } from "../billing/billing.service";
import { UserService } from "../user/user.service";
import { SearchFilters } from "./search-app.types";
import { prisma } from "../../prisma";

class SearchQuotasService {
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

    if (
      !isUserUnlimitedDevices &&
      (await prisma.device.count({
        where: {
          UserTarrif: { some: { id: tarrif.id } },
        },
      })) >= tarrif.tarrif.allowedDevices
    ) {
      throw new Error(
        "Превышен лимит устройств для поиска, улучшите ваш тариф",
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

    if (
      !isUserUnlimitedRequests &&
      (await prisma.searchRequest.count({
        where: { userTarrifId: tarrif.id },
      })) >=
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
}

export const searchQuotasService = new SearchQuotasService();
