import * as path from "path";

export const MATCH_TYPES = {
  code: "Совпадение по коду",
  description: "Совпадение по описанию",
  codeAddition: "Возможное дополнение кода",
} as const;

export const COLUMN_HEADERS = [
  "Поисковый тег",
  "Страна",
  "Санкционный код",
  "Источник ограничения",
  "Тип ограничений",
  "Описание",
];

export const REPORTS_STORAGE_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "storage",
  "reports",
);
