import { mapValues, uniq } from "lodash";
import { prisma } from "../../prisma/prisma";
import { CounterSanction } from "@prisma/client";
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

export const searchCounterSanctionsByCode = async ({
  restrictions,
  searchTags,
  sourceDocumentShorts,
}: {
  restrictions: Array<string>;
  sourceDocumentShorts: Array<string>;
  searchTags: Array<string>;
}) => {
  const res: Array<CounterSanction> = [];

  for await (const codeTag of searchTags.filter((tag) => tag.match(/^\d*$/g))) {
    res.push(
      ...(
        await prisma.counterSanction.findMany({
          where: {
            code: {
              in: splitCodeTag(codeTag),
            },
            restriction: restrictions.length
              ? {
                  in: restrictions,
                }
              : undefined,
            sourceDocumentShort: sourceDocumentShorts.length
              ? {
                  in: sourceDocumentShorts,
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

export const searchCounterSanctionsByDescription = async (
  searchTags: Array<string>,
  restrictions: Array<string>,
  sourceDocumentShorts: Array<string>,
) => {
  const res: Array<CounterSanction> = [];

  for await (const descriptionTag of searchTags) {
    const tagArr = descriptionTag.split(" ");

    res.push(
      ...(
        await prisma.$queryRawUnsafe<any>(`
      with tokens as (select unnest(string_to_array('${descriptionTag}',' ')) as t), 
      all_rows as (select id, "sourceDocument", "restriction", code, "description", "exception", "sourceDocumentShort",
      sum(1.0 - (tokens.t <<<-> "description")) as score, count(tokens.t <<%  "description") as match_count
      from "CounterSanction" as s, tokens where tokens.t <<% "description"  
      ${
        sourceDocumentShorts.length
          ? ` and "sourceDocumentShort" in (${sourceDocumentShorts
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
      group by id, "description")
      select id, "sourceDocument", "restriction", score, code, "description", "exception", "sourceDocumentShort"
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

export const searchCounterSanctionsByException = async (
  searchTags: Array<string>,
  restrictions: Array<string>,
  sourceDocumentShorts: Array<string>,
) => {
  const res: Array<CounterSanction> = [];

  for await (const exceptionTag of searchTags) {
    const tagArr = exceptionTag.split(" ");

    res.push(
      ...(
        await prisma.$queryRawUnsafe<any>(`
      with tokens as (select unnest(string_to_array('${exceptionTag}',' ')) as t), 
      all_rows as (select id, "sourceDocument", "restriction", code, "description", "exception", "sourceDocumentShort",
      sum(1.0 - (tokens.t <<<-> "exception")) as score, count(tokens.t <<%  "exception") as match_count
      from "CounterSanction" as s, tokens where tokens.t <<% "exception"  
      ${
        sourceDocumentShorts.length
          ? ` and "sourceDocumentShort" in (${sourceDocumentShorts
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
      group by id, "exception")
      select id, "sourceDocument", "restriction", score, code, "description", "exception", "sourceDocumentShort"
      from all_rows WHERE match_count=${tagArr.length} 
      order by score desc, "code" asc;`)
      ).map((x) => ({
        ...x,
        exceptionTag,
        matchedWords: x.exception
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

export const searchCounterSanctionsByCodeAddition = async ({
  restrictions,
  searchTags,
  sourceDocumentShorts,
}: {
  restrictions: Array<string>;
  searchTags: Array<string>;
  sourceDocumentShorts: Array<string>;
}) => {
  const res: Array<CounterSanction> = [];

  for await (const codeAdditionTag of searchTags.filter((tag) =>
    tag.match(/^\d*$/g),
  )) {
    const foundCounterSanctions = await prisma.counterSanction.findMany({
      where: {
        code: {
          startsWith: codeAdditionTag,
          not: {
            equals: codeAdditionTag,
          },
        },
        sourceDocumentShort: sourceDocumentShorts.length
          ? {
              in: sourceDocumentShorts,
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

    res.push(...foundCounterSanctions.map((x) => ({ ...x, codeAdditionTag })));
  }

  return res;
};

export const postLimitCounterSanctionCodeAddition = (
  data: Record<string, Record<string, Array<CounterSanction>>>,
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

export const postLimitCounterSanctionDescription = (
  data: Record<string, Record<string, Array<CounterSanction>>>,
) => {
  const takeLimit = 75;

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
