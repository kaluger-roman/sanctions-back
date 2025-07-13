export type ReportRecord = {
  matchType: string;
  searchTag: string;
  country: string;
  code: string;
  description: string;
  descriptionRussian: string;
  restriction: string;
  sourceDocument: string;
  sourceDocumentOrigin: string;
  sourceLink: string;
  isLimitMessage?: boolean;
};

export type ReportMetadata = {
  generatedAt: string;
  totalRecords: number;
};

export type ExcelReportData = {
  headers: string[];
  data: ReportRecord[];
  metadata: ReportMetadata;
};

export type ReportGenerationResult = {
  id: string;
};
