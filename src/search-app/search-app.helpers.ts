import { mapValues, uniq } from "lodash";
import { prisma } from "../../prisma/prisma";
import { Sanction } from "@prisma/client";
import * as trigramSimilarity from "trigram-similarity";

const keyPoints = [2, 4, 6, 8, 10, 12];

const expandZeros = (value: string) =>
  keyPoints
    .filter((point) => point >= value.length)
    .map((point) => value.padEnd(point, "0"));

export const splitCodeTag = (value: string) =>
  uniq(
    keyPoints.flatMap((point) =>
      expandZeros(value.padEnd(12, "0").slice(0, point)),
    ),
  );

export const searchByCode = async ({
  countries,
  restrictions,
  searchTags,
}: {
  countries: Array<string>;
  restrictions: Array<string>;
  searchTags: Array<string>;
}) => {
  const res: Array<Sanction> = [];

  for await (const codeTag of searchTags.filter((tag) => tag.match(/^\d*$/g))) {
    res.push(
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

  return res;
};

export const searchByDescription = async (
  searchTags: Array<string>,
  countries: Array<string>,
  restrictions: Array<string>,
) => {
  const res: Array<Sanction> = [];

  for await (const descriptionTag of searchTags) {
    const tagArr = descriptionTag.split(" ");

    res.push(
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
      select id, "sourceCountry", "sourceDocument", "restriction",score, code, description
      from all_rows WHERE match_count=${tagArr.length} 
      order by score desc, "code" asc;`)
      ).map((x) => ({
        ...x,
        descriptionTag,
        matchedWords: x.description
          .split(/\s+/g)
          .filter((descWord: string) =>
            tagArr.some(
              (tagWord) => trigramSimilarity(descWord, tagWord) > 0.2,
            ),
          ),
      })),
    );
  }

  return res;
};

export const searchByCodeAddition = async ({
  countries,
  restrictions,
  searchTags,
}: {
  countries: Array<string>;
  restrictions: Array<string>;
  searchTags: Array<string>;
}) => {
  const res: Array<Sanction> = [];

  for await (const codeAdditionTag of searchTags.filter((tag) =>
    tag.match(/^\d*$/g),
  )) {
    const foundSanctions = await prisma.sanction.findMany({
      where: {
        code: {
          startsWith: codeAdditionTag,
          not: {
            equals: codeAdditionTag,
          },
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
    });

    res.push(...foundSanctions.map((x) => ({ ...x, codeAdditionTag })));
  }

  return res;
};

export const postLimitCodeAddition = (
  data: Record<string, Record<string, Array<Sanction>>>,
) => {
  const takeLimit = 10;

  return mapValues(data, (x) =>
    mapValues(x, (y) =>
      y
        .slice(0, takeLimit + 1)
        .map((z, inx) =>
          inx === takeLimit ? { id: "uplimit_code_addition" } : z,
        ),
    ),
  );
};

export const postLimitDescription = (
  data: Record<string, Record<string, Array<Sanction>>>,
) => {
  const takeLimit = 50;

  return mapValues(data, (x) =>
    mapValues(x, (y) =>
      y
        .slice(0, takeLimit + 1)
        .map((z, inx) =>
          inx === takeLimit ? { id: "uplimit_description" } : z,
        ),
    ),
  );
};
