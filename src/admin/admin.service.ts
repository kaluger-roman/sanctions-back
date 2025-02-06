import * as xlsx from "xlsx";
import { Request } from "../types"; // Add this import

import { prisma } from "../../prisma";
import { TarrifKind } from "src/billing/types";
import { GrantUserTarrifPayload, TarrifSettings } from "./types";
import { User, UserTarrif } from "@prisma/client";
import { billingService } from "../billing/billing.service";
import { Payment } from "@a2seven/yoo-checkout";

class AdminService {
  async processFile(file: Buffer) {
    const workbook = xlsx.read(file.buffer);

    const data: Array<{
      code: string;
      description: string;
      sourceDocument: string;
      sourceCountry: string;
      sourceDocumentOrigin: string;
      restriction: string;
      sourceLink: string;
    }> = xlsx.utils
      .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      .map((x) => ({
        code: String(x["CNCode"]),
        description: String(x["Описание"]),
        descriptionRussian: String(x["Описание на русском"]),
        sourceDocument: String(x["Источник ограничения"]),
        sourceCountry: String(x["Страна"]),
        restriction: String(x["Тип ограничения"]),
        sourceLink: String(x["ссылка"]),
        sourceDocumentOrigin: String(x["источник коротко"]),
      }));

    await prisma.sanction.deleteMany();

    await prisma.sanction.createMany({
      data,
    });

    return "success";
  }
  async getTarrifSettings(): Promise<TarrifSettings> {
    return {
      tarrifs: await prisma.tarrif.findMany({
        where: { identifier: { in: [TarrifKind.free, TarrifKind.jurPro] } },
        select: {
          identifier: true,
          allowedCountries: true,
        },
      }),
    };
  }
  async changeTarrifSettings({ tarrifs }: TarrifSettings) {
    const { allowedFreeCountries, allowedPaidCountries } = tarrifs.reduce(
      (acc, x) => {
        if (x.identifier === TarrifKind.free) {
          acc.allowedFreeCountries = x.allowedCountries || [];
        } else {
          acc.allowedPaidCountries = x.allowedCountries || [];
        }

        return acc;
      },
      { allowedFreeCountries: [], allowedPaidCountries: [] },
    );

    await prisma.tarrif.updateMany({
      where: { identifier: { in: [TarrifKind.free] } },
      data: {
        allowedCountries: {
          set: allowedFreeCountries,
        },
      },
    });

    await prisma.tarrif.updateMany({
      where: { identifier: { notIn: [TarrifKind.free] } },
      data: {
        allowedCountries: {
          set: allowedPaidCountries,
        },
      },
    });

    return "success";
  }
  async getUserTariffs() {
    const userTariffs = await prisma.userTarrif.findMany({
      include: {
        user: true,
        tarrif: true,
      },
    });

    const groupedByUser = userTariffs.reduce((acc, userTariff) => {
      const userId = userTariff.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: userTariff.user,
          tariffs: [],
          latestEndDate: userTariff.end,
        };
      }
      acc[userId].tariffs.push(userTariff);
      if (userTariff.end > acc[userId].latestEndDate) {
        acc[userId].latestEndDate = userTariff.end;
      }
      return acc;
    }, {} as Record<string, { user: User; tariffs: Array<UserTarrif>; latestEndDate: Date }>);

    const sortedUsers = Object.values(groupedByUser).sort(
      (a, b) => b.latestEndDate?.getTime() - a.latestEndDate?.getTime(),
    );

    return sortedUsers.map(({ latestEndDate, ...rest }) => rest);
  }

  async grantTariff(payload: Request<GrantUserTarrifPayload>) {
    const { email, endDate } = payload;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const newTarrif = await billingService.updateUserTarrif({
      metadata: {
        userId: user.id,
        tarrifId: payload.tarrifId,
      },
    } as Payment);

    if (endDate) {
      await prisma.userTarrif.update({
        where: {
          id: newTarrif.id,
        },
        data: {
          end: endDate,
        },
      });
    }

    return this.getUserTariffs();
  }
  loadTarrifs() {
    return prisma.tarrif.findMany();
  }
  async deleteUserTariff({ id }: Request<{ id: number }>) {
    if (!id) {
      throw new Error("id is required");
    }

    const tarrif = await prisma.userTarrif.findFirst({
      where: {
        id,
      },
      include: {
        tarrif: true,
      },
    });

    if (!tarrif || tarrif.tarrif.identifier === TarrifKind.free) {
      throw new Error("Can't delete free tarrif");
    }

    await prisma.userTarrif.delete({
      where: {
        id,
      },
    });

    return this.getUserTariffs();
  }
}

export const adminService = new AdminService();
