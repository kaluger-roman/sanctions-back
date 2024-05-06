import * as xlsx from "xlsx";

import { prisma } from "../../prisma";

class SanctionsManagementService {
  async processFile(file: Buffer) {
    const workbook = xlsx.read(file.buffer);

    const data: Array<{
      code: string;
      description: string;
      sourceDocument: string;
      sourceCountry: string;
      restriction: string;
    }> = xlsx.utils
      .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      .map((x) => ({
        code: String(x["CNCode"]),
        description: String(x["Описание"]),
        sourceDocument: String(x["Источник ограничения"]),
        sourceCountry: String(x["Страна"]),
        restriction: String(x["Тип ограничения"]),
      }));

    await prisma.sanction.deleteMany();

    await prisma.sanction.createMany({
      data,
    });

    return "success";
  }
}

export const sanctionsManagementService = new SanctionsManagementService();
