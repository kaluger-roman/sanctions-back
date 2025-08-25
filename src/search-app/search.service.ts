import { groupBy, isEmpty, mapValues, uniq } from "lodash";
import { prisma } from "../../prisma";
import {
  postLimitCodeAddition,
  postLimitDescription,
  searchByCode,
  searchByCodeAddition,
  searchByDescription,
} from "./search-app.helpers";
import {
  postLimitCounterSanctionCodeAddition,
  postLimitCounterSanctionDescription,
  searchCounterSanctionsByCode,
  searchCounterSanctionsByCodeAddition,
  searchCounterSanctionsByDescription,
} from "./counter-sanctions.helpers";
import { SearchFilters } from "./search-app.types";
import { CounterSanctionSearchFilters } from "./counter-sanctions.types";
import { Sanction, CounterSanction } from "@prisma/client";
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
    return (
      await prisma.sanction.findMany({
        select: { restriction: true },
        distinct: ["restriction"],
      })
    ).map(({ restriction }) => restriction);
  }

  async loadCounterSanctionsRestrictions() {
    return (
      await prisma.counterSanction.findMany({
        select: { restriction: true },
        distinct: ["restriction"],
      })
    ).map(({ restriction }) => restriction);
  }
  async loadSourceDocumentOrigins() {
    return (
      await prisma.sanction.findMany({
        select: { sourceDocumentOrigin: true },
        distinct: ["sourceDocumentOrigin"],
      })
    ).map(({ sourceDocumentOrigin }) => sourceDocumentOrigin);
  }

  async loadCounterSanctionsSourceDocuments(
    payload: Request<void> = {} as Request<void>,
  ) {
    const { token } = payload;
    const user = token ? await UserService.getUserByToken(token) : null;
    const userTarrif = user
      ? await billingService.getUserCurrentTarrif(user.id)
      : null;

    const allSourceDocuments = await prisma.counterSanction.findMany({
      select: { sourceDocumentShort: true },
      distinct: ["sourceDocumentShort"],
    });

    const allowedCounterSanctionSources =
      userTarrif && userTarrif.tarrif.identifier !== TarrifKind.free
        ? (
            await prisma.tarrif.findFirst({
              where: { identifier: TarrifKind.jurPro },
              select: { allowedCounterSanctionSources: true },
            })
          )?.allowedCounterSanctionSources || []
        : (
            await prisma.tarrif.findFirst({
              where: { identifier: TarrifKind.free },
              select: { allowedCounterSanctionSources: true },
            })
          )?.allowedCounterSanctionSources || [];

    return {
      sourceDocuments: allSourceDocuments.map(
        ({ sourceDocumentShort }) => sourceDocumentShort,
      ),
      allowedCounterSanctionSources: uniq(allowedCounterSanctionSources),
    };
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

  async searchCounterSanctions({
    searchTypes,
    searchTags,
    restrictions,
    sourceDocumentShorts,
    deviceId,
    token,
    mode = "web",
  }: Request<CounterSanctionSearchFilters> & {
    mode?: "web" | "excel";
  }) {
    const preferences = await prisma.preferences.findFirst();
    const tagLimit = preferences?.maxWebViewTagsCount ?? 50;
    if (searchTags.length > tagLimit && mode === "web") {
      throw new Error("too_many_tags");
    }

    // Получаем разрешенные источники для текущего тарифа пользователя
    const user = token ? await UserService.getUserByToken(token) : null;
    const userTarrif = user
      ? await billingService.getUserCurrentTarrif(user.id)
      : null;

    const allowedCounterSanctionSources =
      userTarrif && userTarrif.tarrif.identifier !== TarrifKind.free
        ? (
            await prisma.tarrif.findFirst({
              where: { identifier: TarrifKind.jurPro },
              select: { allowedCounterSanctionSources: true },
            })
          )?.allowedCounterSanctionSources || []
        : (
            await prisma.tarrif.findFirst({
              where: { identifier: TarrifKind.free },
              select: { allowedCounterSanctionSources: true },
            })
          )?.allowedCounterSanctionSources || [];

    // Фильтруем источники только по разрешенным
    const filteredSourceDocumentShorts =
      sourceDocumentShorts.length > 0
        ? sourceDocumentShorts.filter((source) =>
            allowedCounterSanctionSources.includes(source),
          )
        : allowedCounterSanctionSources;

    const counterSanctions: Array<
      CounterSanction & {
        descriptionTag?: string;
        exceptionTag?: string;
        codeTag?: string;
        codeAdditionTag?: string;
      }
    > = [];

    if (
      searchTypes.includes("code") &&
      filteredSourceDocumentShorts.length > 0
    ) {
      counterSanctions.push(
        ...(await searchCounterSanctionsByCode({
          restrictions,
          searchTags,
          sourceDocumentShorts: filteredSourceDocumentShorts,
        })),
      );
    }

    if (
      searchTypes.includes("codeAddition") &&
      filteredSourceDocumentShorts.length > 0
    ) {
      counterSanctions.push(
        ...(await searchCounterSanctionsByCodeAddition({
          restrictions,
          searchTags,
          sourceDocumentShorts: filteredSourceDocumentShorts,
        })),
      );
    }

    if (
      searchTypes.includes("description") &&
      filteredSourceDocumentShorts.length > 0
    ) {
      counterSanctions.push(
        ...(await searchCounterSanctionsByDescription(
          searchTags,
          restrictions,
          filteredSourceDocumentShorts,
        )),
      );
    }

    const isCodeMatch = (
      tag: string,
      counterSanction: CounterSanction & { codeTag?: string },
    ) => searchTypes.includes("code") && tag === counterSanction.codeTag;

    const isCodeAdditionMatch = (
      tag: string,
      counterSanction: CounterSanction & { codeAdditionTag?: string },
    ) =>
      searchTypes.includes("codeAddition") &&
      tag === counterSanction.codeAdditionTag;

    const isDescriptionMatch = (
      tag: string,
      counterSanction: CounterSanction & { descriptionTag?: string },
    ) =>
      searchTypes.includes("description") &&
      tag === counterSanction.descriptionTag;

    const groupBySourceDocumentShortAndTag = (
      counterSanctions: Array<
        CounterSanction & {
          codeTag?: string;
          descriptionTag?: string;
          exceptionTag?: string;
          codeAdditionTag?: string;
        }
      >,
    ) =>
      mapValues(
        groupBy(
          counterSanctions,
          (value) => value.sourceDocumentShort || "Unknown",
        ),
        (value) =>
          groupBy(
            value,
            ({ descriptionTag, exceptionTag, codeTag, codeAdditionTag }) =>
              descriptionTag || exceptionTag || codeTag || codeAdditionTag,
          ),
      );

    const codeMatches = counterSanctions.filter((counterSanction) =>
      searchTags.some((tag) => isCodeMatch(tag, counterSanction)),
    );

    const descriptionMatches = counterSanctions.filter((counterSanction) =>
      searchTags.some((tag) => isDescriptionMatch(tag, counterSanction)),
    );

    const codeAdditionMatches = counterSanctions.filter((counterSanction) =>
      searchTags.some((tag) => isCodeAdditionMatch(tag, counterSanction)),
    );

    const groupedCounterSanctions = {
      code: groupBySourceDocumentShortAndTag(codeMatches),
      description: postLimitCounterSanctionDescription(
        groupBySourceDocumentShortAndTag(descriptionMatches),
      ),
      codeAddition: postLimitCounterSanctionCodeAddition(
        groupBySourceDocumentShortAndTag(codeAdditionMatches),
      ),
    };

    if (!isEmpty(groupedCounterSanctions) && token && mode === "web") {
      await searchQuotasService.registerDevice(deviceId, token);
      await searchQuotasService.registerCounterSanctionSearchRequest(
        {
          searchTypes,
          searchTags,
          restrictions,
          sourceDocumentShorts: filteredSourceDocumentShorts,
        },
        token,
      );
    }

    return groupedCounterSanctions;
  }
}

export const searchService = new SearchService();
