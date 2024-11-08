import { groupBy, isEmpty, mapValues, uniq } from "lodash";
import { prisma } from "../../prisma";
import { splitCodeTag } from "./search-app.helpers";
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
      for await (const codeTag of searchTags.filter((tag) =>
        tag.match(/^\d*$/g),
      )) {
        sanctions.push(
          ...(
            await prisma.sanction.findMany({
              where: {
                code: {
                  in: splitCodeTag(codeTag),
                },
                sourceCountry: countries.length
                  ? {
                      in: countries,
                    }
                  : undefined,
                restriction: restrictions.length
                  ? {
                      in: restrictions,
                    }
                  : undefined,
              },
              orderBy: { code: "asc" },
            })
          ).map((x) => ({ ...x, codeTag })),
        );
      }
    }

    if (searchTypes.includes("description")) {
      for await (const descriptionTag of searchTags) {
        sanctions.push(
          ...(
            await prisma.$queryRawUnsafe<any>(`
          with tokens as (select unnest(string_to_array('${descriptionTag}',' ')) as t), 
          all_rows as (select id, "sourceCountry", "sourceDocument", "restriction", code, description,
          sum(1.0 - (tokens.t <<<-> description)) as score, count(tokens.t <<%  description) as match_count
          from "Sanction" as s, tokens where tokens.t <<% description  
          ${
            countries.length
              ? ` and "sourceCountry" in (${countries
                  .map((x) => `'${x}' `)
                  .join(",")})`
              : ""
          } 
          ${
            restrictions.length
              ? ` and "restriction" in (${restrictions
                  .map((x) => `'${x}'`)
                  .join(",")}) `
              : ""
          } 
          group by id, description)
          select id, "sourceCountry", "sourceDocument", "restriction", code, description from all_rows WHERE match_count=${
            descriptionTag.split(" ").length
          } order by "code" asc;`)
          ).map((x) => ({ ...x, descriptionTag })),
        );
      }
    }

    const groupedSanctions: Record<
      string,
      Record<string, Array<Sanction & { tag: string }>>
    > = mapValues(
      groupBy(
        sanctions.flatMap((sanction) =>
          searchTags.flatMap((tag) =>
            [
              searchTypes.includes("code") && tag === sanction.codeTag
                ? { ...sanction, tag }
                : null,
              searchTypes.includes("description") &&
              tag === sanction.descriptionTag
                ? { ...sanction, tag }
                : null,
            ].filter(Boolean),
          ),
        ),
        (value) => value.sourceCountry,
      ),
      (value) => groupBy(value, (value) => value.tag),
    );

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
