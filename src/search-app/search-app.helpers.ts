import { uniq } from "lodash";

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
