import { groupBy, intersection, mapValues, uniq } from "lodash";
import { prisma } from "../../prisma";
import { splitCodeTag } from "./search-app.helpers";
import { SearchFilters } from "./search-app.types";
import { Sanction } from "@prisma/client";

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

  async applyIntermediateFilters({ countries, restrictions }: SearchFilters) {
    const filteredSanctions = await prisma.sanction.findMany({
      where: {
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
    });

    return {
      countries: uniq(
        filteredSanctions.map(({ sourceCountry }) => sourceCountry),
      ),
      restrictions: uniq(
        filteredSanctions.map(({ restriction }) => restriction),
      ),
    };
  }

  async search({
    searchTypes,
    searchTags,
    countries,
    restrictions,
  }: SearchFilters) {
    const sanctions: Array<Sanction> = [];

    if (searchTypes.includes("code")) {
      sanctions.push(
        ...(await prisma.sanction.findMany({
          where: {
            code: {
              in: searchTags.length
                ? searchTags
                    .filter((tag) => tag.match(/^\d*$/g))
                    .flatMap(splitCodeTag)
                : undefined,
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
        })),
      );
    }

    if (searchTypes.includes("description")) {
      sanctions.push(
        ...(await prisma.sanction.findMany({
          where: {
            description: searchTags.length
              ? {
                  search: searchTags
                    .flatMap((tag) => tag.split(/\s+/g))
                    .join(" | "),
                }
              : undefined,
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
        })),
      );
    }

    const groupedSanctions: Record<
      string,
      Record<string, Array<Sanction & { tag: string }>>
    > = mapValues(
      groupBy(
        sanctions.flatMap((sanction: Sanction) =>
          searchTags.flatMap((tag) =>
            [
              searchTypes.includes("code") && tag.startsWith(sanction.code)
                ? { ...sanction, tag }
                : null,
              searchTypes.includes("description") &&
              intersection(
                tag.split(/\s+/g),
                sanction.description.split(/\s+/g),
              ).length
                ? { ...sanction, tag }
                : null,
            ].filter(Boolean),
          ),
        ),
        (value) => value.sourceCountry,
      ),
      (value) => groupBy(value, (value) => value.tag),
    );

    return groupedSanctions;
  }
}

export const searchService = new SearchService();
