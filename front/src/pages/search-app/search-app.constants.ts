import { QueryFormat } from "shared/search";

export const QUERY_FORMAT_NAMES: Record<QueryFormat, string> = {
  [QueryFormat.searchString]: "Строка",
  [QueryFormat.excelFile]: "Excel-файл",
};
