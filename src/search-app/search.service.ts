import { groupBy, isEmpty, mapValues, uniq } from "lodash";
import { prisma } from "../../prisma";
import {
  postLimitCodeAddition,
  searchByCode,
  searchByCodeAddition,
  searchByDescription,
} from "./search-app.helpers";
import { SearchFilters } from "./search-app.types";
import { Sanction } from "@prisma/client";
import { Request } from "../types";
import { searchQuotasService } from "./search-quotas.service";

class SearchService {
  async loadCountries() {
    const countries = await prisma.sanction.findMany({
      select: { sourceCountry: true },
      distinct: ["sourceCountry"],
    });

    return countries.map(({ sourceCountry }) => sourceCountry);
  }
  async loadRestrictions() {
    const restrictions = await prisma.sanction.findMany({
      select: { restriction: true },
      distinct: ["restriction"],
    });

    return restrictions.map(({ restriction }) => restriction);
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
    };
  }

  async search({
    searchTypes,
    searchTags,
    countries,
    restrictions,
    deviceId,
    token,
  }: Request<SearchFilters>) {
    const sanctions: Array<
      Sanction & { descriptionTag?: string; codeTag?: string }
    > = [];

    if (searchTypes.includes("code")) {
      sanctions.push(
        ...(await searchByCode({
          countries,
          restrictions,
          searchTags,
        })),
      );
    }

    if (searchTypes.includes("codeAddition")) {
      sanctions.push(
        ...(await searchByCodeAddition({
          countries,
          restrictions,
          searchTags,
        })),
      );
    }

    if (searchTypes.includes("description")) {
      sanctions.push(
        ...(await searchByDescription(searchTags, countries, restrictions)),
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
      description: groupByCountryAndTag(descriptionMatches),
      codeAddition: postLimitCodeAddition(
        groupByCountryAndTag(codeAdditionMatches),
      ),
    };

    if (!isEmpty(groupedSanctions) && token) {
      await searchQuotasService.registerDevice(deviceId, token);
      await searchQuotasService.registerSearchRequest(
        { searchTypes, searchTags, countries, restrictions },
        token,
      );
    }

    return groupedSanctions;
  }
}

export const searchService = new SearchService();
