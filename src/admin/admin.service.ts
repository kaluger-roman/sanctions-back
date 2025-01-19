import * as xlsx from "xlsx";

import { prisma } from "../../prisma";
import { TarrifKind } from "src/billing/types";
import { TarrifSettings } from "./types";

class AdminService {
  async processFile(file: Buffer) {
    const workbook = xlsx.read(file.buffer);

    const data: Array<{
      code: string;
      description: string;
      sourceDocument: string;
      sourceCountry: string;
      restriction: string;
      sourceLink: string;
    }> = xlsx.utils
      .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      .map((x) => ({
        code: String(x["CNCode"]),
        description: String(x["Описание"]),
        sourceDocument: String(x["Источник ограничения"]),
        sourceCountry: String(x["Страна"]),
        restriction: String(x["Тип ограничения"]),
        sourceLink: String(x["ссылка"]),
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
}

export const adminService = new AdminService();
