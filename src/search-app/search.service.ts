import { groupBy, isEmpty, mapValues, uniq } from "lodash";
import { prisma } from "../../prisma";
import {
  postLimitCodeAddition,
  postLimitDescription,
  searchByCode,
  searchByCodeAddition,
  searchByDescription,
} from "./search-app.helpers";
import { SearchFilters } from "./search-app.types";
import { Sanction } from "@prisma/client";
import { Request } from "../types";
import { searchQuotasService } from "./search-quotas.service";
import { TarrifKind } from "../billing/types";
import { UserService } from "../user/user.service";
import { billingService } from "../billing/billing.service";

import * as XLSX from "xlsx";
import * as path from "path";
import { readFileSync } from "fs";

class SearchService {
  async downloadExcelTemplate(): Promise<{ buffer: Buffer }> {
    const filePath = path.resolve(__dirname, "./excel-search-request.xlsx");
    const buffer = readFileSync(filePath);
    return { buffer };
  }
  async parseExcelTags(
    file: Buffer | ArrayBuffer | Uint8Array,
  ): Promise<string[]> {
    const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file as any);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const tags: string[] = [];
    let row = 2;
    while (true) {
      const cell = sheet[`A${row}`];
      if (!cell || !cell.v) break;
      tags.push(String(cell.v).trim());
      row++;
    }
    const preferences = await prisma.preferences.findFirst();

    const maxExcelTags = preferences?.maxExcelTags ?? 1000;
    if (tags.length > maxExcelTags) {
      throw new Error(`В файле должно быть не более ${maxExcelTags} тегов`);
    }
    return tags;
  }
  async loadCountries({ token }: Request<void>) {
    const user = token ? await UserService.getUserByToken(token) : null;
    const userTarrif = user
      ? await billingService.getUserCurrentTarrif(user.id)
      : null;

    const countries = await prisma.sanction.findMany({
      select: { sourceCountry: true },
      distinct: ["sourceCountry"],
    });

    const allowedCountries =
      userTarrif && userTarrif.tarrif.identifier !== TarrifKind.free
        ? (
            await prisma.tarrif.findFirst({
              where: { identifier: TarrifKind.jurPro },
              select: { allowedCountries: true },
            })
          )?.allowedCountries || []
        : (
            await prisma.tarrif.findFirst({
              where: { identifier: TarrifKind.free },
              select: { allowedCountries: true },
            })
          )?.allowedCountries || [];

    return {
      countries: countries.map(({ sourceCountry }) => sourceCountry),
      allowedCountries: uniq(allowedCountries),
    };
  }
  async loadRestrictions() {
    const restrictions = await prisma.sanction.findMany({
      select: { restriction: true },
      distinct: ["restriction"],
    });

    return restrictions.map(({ restriction }) => restriction);
  }
  async loadSourceDocumentOrigins() {
    const sourceDocumentOrigins = await prisma.sanction.findMany({
      select: { sourceDocumentOrigin: true },
      distinct: ["sourceDocumentOrigin"],
    });

    return sourceDocumentOrigins.map(
      ({ sourceDocumentOrigin }) => sourceDocumentOrigin,
    );
  }
  async applyIntermediateFilters({ countries }: { countries: Array<string> }) {
    return {
      restrictions: (
        await prisma.sanction.findMany({
          select: { restriction: true },
          distinct: ["restriction"],
          where: {
            sourceCountry: countries.length
              ? {
                  in: countries,
                }
              : undefined,
          },
        })
      ).map(({ restriction }) => restriction),
      sourceDocumentOrigins: (
        await prisma.sanction.findMany({
          select: { sourceDocumentOrigin: true },
          distinct: ["sourceDocumentOrigin"],
          where: {
            sourceCountry: countries.length
              ? {
                  in: countries,
                }
              : undefined,
          },
        })
      ).map(({ sourceDocumentOrigin }) => sourceDocumentOrigin),
    };
  }

  async search({
    searchTypes,
    searchTags,
    countries,
    restrictions,
    sourceDocumentOrigins,
    deviceId,
    token,
    searchLanguage,
    mode = "web",
  }: Request<SearchFilters> & {
    mode?: "web" | "excel";
  }) {
    const preferences = await prisma.preferences.findFirst();
    const tagLimit = preferences?.maxWebViewTagsCount ?? 50;
    if (searchTags.length > tagLimit && mode === "web") {
      throw new Error("too_many_tags");
    }

    const sanctions: Array<
      Sanction & { descriptionTag?: string; codeTag?: string }
    > = [];

    if (searchTypes.includes("code")) {
      sanctions.push(
        ...(await searchByCode({
          countries,
          restrictions,
          searchTags,
          sourceDocumentOrigins,
        })),
      );
    }

    if (searchTypes.includes("codeAddition")) {
      sanctions.push(
        ...(await searchByCodeAddition({
          countries,
          restrictions,
          searchTags,
          sourceDocumentOrigins,
        })),
      );
    }

    if (searchTypes.includes("description")) {
      sanctions.push(
        ...(await searchByDescription(
          searchTags,
          countries,
          restrictions,
          sourceDocumentOrigins,
          searchLanguage,
        )),
      );
    }

    const isCodeMatch = (
      tag: string,
      sanction: Sanction & { codeTag?: string },
    ) => searchTypes.includes("code") && tag === sanction.codeTag;

    const isCodeAdditionMatch = (
      tag: string,
      sanction: Sanction & { codeAdditionTag?: string },
    ) =>
      searchTypes.includes("codeAddition") && tag === sanction.codeAdditionTag;

    const isDescriptionMatch = (
      tag: string,
      sanction: Sanction & { descriptionTag?: string },
    ) => searchTypes.includes("description") && tag === sanction.descriptionTag;

    const groupByCountryAndTag = (
      sanctions: Array<
        Sanction & {
          codeTag?: string;
          descriptionTag?: string;
          codeAdditionTag?: string;
        }
      >,
    ) =>
      mapValues(
        groupBy(sanctions, (value) => value.sourceCountry),
        (value) =>
          groupBy(
            value,
            ({ descriptionTag, codeTag, codeAdditionTag }) =>
              descriptionTag || codeTag || codeAdditionTag,
          ),
      );

    const codeMatches = sanctions.filter((sanction) =>
      searchTags.some((tag) => isCodeMatch(tag, sanction)),
    );

    const descriptionMatches = sanctions.filter((sanction) =>
      searchTags.some((tag) => isDescriptionMatch(tag, sanction)),
    );

    const codeAdditionMatches = sanctions.filter((sanction) =>
      searchTags.some((tag) => isCodeAdditionMatch(tag, sanction)),
    );

    const groupedSanctions = {
      code: groupByCountryAndTag(codeMatches),
      description: postLimitDescription(
        groupByCountryAndTag(descriptionMatches),
      ),
      codeAddition: postLimitCodeAddition(
        groupByCountryAndTag(codeAdditionMatches),
      ),
    };

    if (!isEmpty(groupedSanctions) && token && mode === "web") {
      await searchQuotasService.registerDevice(deviceId, token);
      await searchQuotasService.registerSearchRequest(
        {
          searchTypes,
          searchTags,
          countries,
          restrictions,
          sourceDocumentOrigins,
          searchLanguage,
        },
        token,
      );
    }

    return groupedSanctions;
  }
}

export const searchService = new SearchService();
