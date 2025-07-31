import { SearchFilters, SearchType } from "../search-app/search-app.types";
import { Request } from "../types";
import { searchService } from "../search-app/search.service";
import { UserService } from "../user/user.service";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import * as path from "path";
import { prisma } from "../../prisma";
import { LANG_NAMES } from "../shared/search";
import {
  ReportRecord,
  ExcelReportData,
  ReportGenerationResult,
} from "./reports.types";
import {
  COLUMN_HEADERS,
  MATCH_TYPES,
  REPORTS_STORAGE_PATH,
} from "./reports.constants";
import * as xlsx from "xlsx";
import * as archiver from "archiver";

class ReportsService {
  constructor() {
    this.autoReportsCleanupWatch();
  }

  generateExcelReport = async ({
    countries,
    restrictions,
    sourceDocumentOrigins,
    searchTypes,
    searchTags,
    searchLanguage,
  }: Request<SearchFilters>): Promise<ReportGenerationResult> => {
    // Get search results using existing search service, not pass token to not trigger user limits
    const searchResults = await searchService.search({
      countries,
      restrictions,
      sourceDocumentOrigins,
      searchTypes,
      searchTags,
      searchLanguage,
      mode: "excel",
    });

    const reportId = randomUUID();
    const filePath = path.join(REPORTS_STORAGE_PATH, `${reportId}.xlsx`);
    const workbook = xlsx.utils.book_new();
    const searchTypesToProcess: Array<SearchType> = [
      "code",
      "description",
      "codeAddition",
    ];

    searchTypesToProcess.forEach((searchType) => {
      const sheetName = MATCH_TYPES[searchType];

      if (!searchTypes.includes(searchType as any)) {
        const noFilterData = [["Не установлен фильтр для данного типа поиска"]];
        const worksheet = xlsx.utils.aoa_to_sheet(noFilterData);
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        return;
      }

      const typeResults = searchResults[searchType] || {};
      const transformedData = this.transformSearchResultsForSheet(
        typeResults,
        searchType,
      );

      const { sheetData, merges } = this.createSheetData({
        searchTags,
        countries,
        restrictions,
        sourceDocumentOrigins,
        searchLanguage: searchLanguage || "en",
        matchType: MATCH_TYPES[searchType],
        data: transformedData,
      });

      const worksheet = xlsx.utils.aoa_to_sheet(sheetData);

      // Apply merges
      merges.forEach((merge) => {
        worksheet["!merges"] = [...(worksheet["!merges"] || []), merge];
      });

      // Set column widths
      const colWidths = [
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 },
        { wch: 40 },
      ];
      worksheet["!cols"] = colWidths;

      // Apply cell styles for vertical alignment to all cells
      const range = xlsx.utils.decode_range(worksheet["!ref"] || "A1:A1");
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
          if (!worksheet[cellAddress]) {
            // Create empty cell if it doesn't exist
            worksheet[cellAddress] = { t: "s", v: "" };
          }

          // Apply vertical alignment to top for all cells
          const baseStyle = {
            alignment: {
              vertical: "top",
              wrapText: true,
            },
          };

          // Make headers row (row 7 in 0-based indexing) bold
          if (row === 7) {
            worksheet[cellAddress].s = {
              ...baseStyle,
              font: {
                bold: true,
              },
            };
          } else {
            worksheet[cellAddress].s = baseStyle;
          }
        }
      }

      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    await fs.mkdir(REPORTS_STORAGE_PATH, { recursive: true });

    xlsx.writeFile(workbook, filePath);

    await this.cleanupUnlinkedReports();

    await prisma.report.create({
      data: {
        id: reportId,
        userId: null,
        countries,
        searchTypes,
        restrictions,
        sourceDocumentOrigins,
        searchTags,
        searchLanguage: searchLanguage || "en",
      },
    });

    return { id: reportId };
  };

  saveReportToMyReports = async ({
    reportId,
    token,
  }: Request<{ reportId: string }>) => {
    const user = token ? await UserService.getUserByToken(token) : null;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("Report not found");
    }

    await this.cleanupUserReports(user.id);

    const userReports = await prisma.report.findMany({
      where: {
        userId: user.id,
        title: { startsWith: "sanctions-report-" },
        isDeleted: false, // Фильтруем только не удаленные отчеты
      },
      select: { title: true },
    });

    // Извлекаем номера из существующих названий
    const existingNumbers = userReports
      .map((r) => r.title?.match(/sanctions-report-(\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number)
      .filter((num) => !isNaN(num));

    // Находим следующий доступный номер
    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    const reportTitle = `sanctions-report-${nextNumber}`;

    await prisma.report.update({
      where: { id: reportId },
      data: {
        userId: user.id,
        title: reportTitle,
      },
    });

    console.log(
      `Report ${reportId} saved to user ${user.id} reports with title: ${reportTitle}`,
    );

    return "success";
  };

  loadUserReports = async ({ token }: Request<void>) => {
    const user = await UserService.getUserByToken(token);

    const reports = await prisma.report.findMany({
      where: {
        userId: user.id,
        isDeleted: false, // Фильтруем только не удаленные отчеты
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return reports.map((report) => ({
      id: report.id,
      name: report.title || "Отчет без названия",
      createdAt: report.createdAt,
    }));
  };

  private cleanupUnlinkedReports = async (): Promise<void> => {
    const preferences = await prisma.preferences.findFirst();
    const maxUnlinkedReports = preferences?.maxUnlinkedReports || 500;

    const unlinkedReportsCount = await prisma.report.count({
      where: { userId: null, isDeleted: false }, // Считаем только не удаленные отчеты
    });

    if (unlinkedReportsCount > maxUnlinkedReports) {
      const reportsToDelete = await prisma.report.findMany({
        where: { userId: null, isDeleted: false },
        orderBy: { createdAt: "asc" },
        take: unlinkedReportsCount - maxUnlinkedReports,
      });

      for (const report of reportsToDelete) {
        await this.deleteReportFile(report.id);
        // Помечаем как удаленные вместо физического удаления
        await prisma.report.update({
          where: { id: report.id },
          data: { isDeleted: true },
        });
      }

      console.log(
        `Marked ${reportsToDelete.length} old unlinked reports as deleted`,
      );
    }
  };

  private cleanupUserReports = async (userId: number): Promise<void> => {
    const preferences = await prisma.preferences.findFirst();
    const maxUserReports = preferences?.maxUserReports || 100;

    const userReportsCount = await prisma.report.count({
      where: {
        userId,
        isDeleted: false, // Считаем только не удаленные отчеты
      },
    });

    if (userReportsCount >= maxUserReports) {
      const reportsToDelete = await prisma.report.findMany({
        where: {
          userId,
          isDeleted: false, // Берем только не удаленные отчеты
        },
        orderBy: { createdAt: "asc" },
        take: userReportsCount - (maxUserReports - 1), // Keep max-1, so after adding new one we'll have max
      });

      for (const report of reportsToDelete) {
        await this.deleteReportFile(report.id);
        // Помечаем как удаленные вместо физического удаления
        await prisma.report.update({
          where: { id: report.id },
          data: { isDeleted: true },
        });
      }

      console.log(
        `Marked ${reportsToDelete.length} old user reports as deleted for user ${userId}`,
      );
    }
  };

  private deleteReportFile = async (reportId: string): Promise<void> => {
    const filePath = path.join(REPORTS_STORAGE_PATH, `${reportId}.xlsx`);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log(`Report file ${reportId}.xlsx not found in filesystem`);
    }
  };

  autoReportsCleanupWatch = async (): Promise<void> => {
    // Clean up unlinked reports older than 24 hours every hour
    setInterval(() => this.cleanupOldUnlinkedReports(), 60 * 60 * 1000); // 1 hour
  };

  private cleanupOldUnlinkedReports = async (): Promise<void> => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const oldUnlinkedReports = await prisma.report.findMany({
      where: {
        userId: null,
        isDeleted: false, // Считаем только не удаленные отчеты
        createdAt: {
          lte: oneDayAgo,
        },
      },
    });

    for (const report of oldUnlinkedReports) {
      await this.deleteReportFile(report.id);
      // Помечаем как удаленные вместо физического удаления
      await prisma.report.update({
        where: { id: report.id },
        data: { isDeleted: true },
      });
    }

    if (oldUnlinkedReports.length > 0) {
      console.log(
        `Marked ${oldUnlinkedReports.length} old unlinked reports as deleted (older than 24h)`,
      );
    }
  };

  private createSheetData = ({
    searchTags,
    countries,
    restrictions,
    sourceDocumentOrigins,
    searchLanguage,
    matchType,
    data,
  }: {
    searchTags: string[];
    countries: string[];
    restrictions: string[];
    sourceDocumentOrigins: string[];
    searchLanguage: string;
    matchType: string;
    data: ReportRecord[];
  }): { sheetData: Array<Array<string>>; merges: Array<any> } => {
    const sheetData: Array<Array<string>> = [];

    sheetData.push(["Поисковый запрос", searchTags.join(", ")]);

    sheetData.push([
      "Количество найденных результатов",
      data.length.toString(),
    ]);

    sheetData.push([
      "Установленные фильтры",
      "Страна",
      "Ограничения",
      "Источник",
      "Язык",
    ]);

    sheetData.push([
      "",
      countries.join(", "),
      restrictions.length > 0 ? restrictions.join(", ") : "Все",
      sourceDocumentOrigins.length > 0
        ? sourceDocumentOrigins.join(", ")
        : "Все",
      LANG_NAMES[searchLanguage as keyof typeof LANG_NAMES] || searchLanguage,
    ]);

    sheetData.push([]);

    sheetData.push([matchType, "", "", "", "", ""]);

    sheetData.push(COLUMN_HEADERS);

    const merges: Array<any> = [];
    let currentRow = 7; // Start after headers (0-indexed)

    // Add data rows and track consecutive same search tags for merging
    data.forEach((record, index) => {
      const isFirstOfGroup =
        index === 0 || data[index - 1].searchTag !== record.searchTag;
      const isLastOfGroup =
        index === data.length - 1 ||
        data[index + 1].searchTag !== record.searchTag;

      sheetData.push([
        isFirstOfGroup ? record.searchTag : "", // Only show search tag in first row of group
        record.country,
        record.code,
        record.sourceDocument,
        record.restriction,
        record.description,
      ]);

      // If this is a limit message, merge cells across all columns (except search tag)
      if (record.isLimitMessage) {
        merges.push({
          s: { r: currentRow, c: 2 }, // Start from 'code' column (index 2)
          e: { r: currentRow, c: 5 }, // End at 'description' column (index 5)
        });
      }

      // If this is the last row of a group and the group has more than 1 row, add merge for search tag
      if (isLastOfGroup && !isFirstOfGroup) {
        // Find the start of this group
        let groupStart = index;
        while (
          groupStart > 0 &&
          data[groupStart - 1].searchTag === record.searchTag
        ) {
          groupStart--;
        }

        merges.push({
          s: { r: currentRow - (index - groupStart), c: 0 }, // Start row for search tag
          e: { r: currentRow, c: 0 }, // End row for search tag
        });
      }

      currentRow++;
    });

    return { sheetData, merges };
  };

  private transformSearchResultsForSheet = (
    typeResults: Awaited<ReturnType<typeof searchService.search>>[
      | "code"
      | "description"
      | "codeAddition"],
    searchType: string,
  ): ReportRecord[] => {
    const data: ReportRecord[] = [];

    Object.entries(typeResults).forEach(([country, tagData]) => {
      Object.entries(tagData).forEach(([searchTag, sanctions]) => {
        sanctions.forEach((sanction: any) => {
          if (
            ["uplimit_code_addition", "uplimit_description"].includes(
              sanction.id,
            )
          ) {
            const limitMessage =
              sanction.id === "uplimit_code_addition"
                ? "Возможных дополнений более 10 (показаны первые 10), конкретизируйте ваш код ТНВЭД"
                : "Совпадений по описанию более 75 (показаны первые 75), конкретизируйте поисковый запрос";

            data.push({
              matchType: MATCH_TYPES[searchType],
              searchTag,
              country,
              code: limitMessage,
              description: "",
              descriptionRussian: "",
              restriction: "",
              sourceDocument: "",
              sourceDocumentOrigin: "",
              sourceLink: "",
              isLimitMessage: true,
            });
          } else {
            data.push({
              matchType: MATCH_TYPES[searchType],
              searchTag,
              country,
              code: String(sanction.code || ""),
              description: String(sanction.description || ""),
              descriptionRussian: String(sanction.descriptionRussian || ""),
              restriction: String(sanction.restriction || ""),
              sourceDocument: String(sanction.sourceDocument || ""),
              sourceDocumentOrigin: String(sanction.sourceDocumentOrigin || ""),
              sourceLink: String(sanction.sourceLink || ""),
              isLimitMessage: false,
            });
          }
        });
      });
    });

    return data;
  };

  getReportData = async (reportId: string): Promise<ExcelReportData | null> => {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return null;
    }

    const filePath = path.join(REPORTS_STORAGE_PATH, `${reportId}.xlsx`);

    try {
      await fs.access(filePath);

      return {
        headers: COLUMN_HEADERS,
        data: [], // File content will be served directly
        metadata: {
          generatedAt: report.createdAt.toISOString(),
          totalRecords: 0, // Will be calculated when needed
        },
      };
    } catch {
      return null;
    }
  };

  removeReport = async ({ reportId }: Request<{ reportId: string }>) => {
    const filePath = path.join(REPORTS_STORAGE_PATH, `${reportId}.xlsx`);

    try {
      // Remove file from filesystem
      await fs.unlink(filePath);
      console.log(`Report file ${reportId}.xlsx deleted from filesystem`);
    } catch (error) {
      console.log(`Report file ${reportId}.xlsx not found in filesystem`);
    }

    try {
      // Mark record as deleted in database (soft delete)
      await prisma.report.update({
        where: { id: reportId },
        data: { isDeleted: true },
      });
      console.log(`Report ${reportId} marked as deleted in database`);
    } catch (error) {
      console.log(`Report ${reportId} not found in database`);
    }

    return "success";
  };

  downloadReport = async ({
    reportId,
  }: Request<{ reportId: string }>): Promise<Buffer | null> => {
    const filePath = path.join(REPORTS_STORAGE_PATH, `${reportId}.xlsx`);

    try {
      // Check if report exists in database
      const report = await prisma.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        return null;
      }

      // Read and return file buffer
      const fileBuffer = await fs.readFile(filePath);
      return fileBuffer;
    } catch (error) {
      console.log(`Error downloading report ${reportId}:`, error);
      return null;
    }
  };

  downloadMultipleReports = async ({
    reportIds,
    token,
  }: Request<{ reportIds: string[] }>): Promise<Buffer> => {
    const user = await UserService.getUserByToken(token);

    // Verify all reports belong to the user and are not deleted
    const reports = await prisma.report.findMany({
      where: {
        id: { in: reportIds },
        userId: user.id,
        isDeleted: false, // Проверяем только не удаленные отчеты
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (reports.length !== reportIds.length) {
      throw new Error("Some reports not found or access denied");
    }

    // Create ZIP archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    const chunks: Buffer[] = [];

    archive.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // Add each report to the archive
    for (const report of reports) {
      const filePath = path.join(REPORTS_STORAGE_PATH, `${report.id}.xlsx`);

      try {
        await fs.access(filePath);
        const fileName = `${report.title || `report-${report.id}`}.xlsx`;
        archive.file(filePath, { name: fileName });
      } catch (error) {
        console.log(`Report file ${report.id}.xlsx not found, skipping`);
      }
    }

    await archive.finalize();

    return Buffer.concat(chunks);
  };

  deleteMultipleReports = async ({
    reportIds,
    token,
  }: Request<{ reportIds: string[] }>): Promise<string> => {
    const user = await UserService.getUserByToken(token);

    // Verify all reports belong to the user and are not already deleted
    const reports = await prisma.report.findMany({
      where: {
        id: { in: reportIds },
        userId: user.id,
        isDeleted: false,
      },
    });

    if (reports.length !== reportIds.length) {
      throw new Error("Some reports not found or access denied");
    }

    // Delete files only, mark records as deleted in database
    for (const reportId of reportIds) {
      const filePath = path.join(REPORTS_STORAGE_PATH, `${reportId}.xlsx`);

      try {
        await fs.unlink(filePath);
        console.log(`Report file ${reportId}.xlsx deleted from filesystem`);
      } catch (error) {
        console.log(`Report file ${reportId}.xlsx not found in filesystem`);
      }
    }

    // Mark reports as deleted (soft delete)
    await prisma.report.updateMany({
      where: {
        id: { in: reportIds },
        userId: user.id,
      },
      data: { isDeleted: true },
    });

    console.log(
      `Marked ${reportIds.length} reports as deleted for user ${user.id}`,
    );
    return "success";
  };
}

export const reportsService = new ReportsService();
