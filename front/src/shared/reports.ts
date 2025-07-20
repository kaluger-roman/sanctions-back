export type ReportGenerationResult = {
  id: string;
};

export type UserReport = {
  id: string;
  name: string;
  createdAt: string;
};

export type UserReportsLimitStatus = {
  currentReportsCount: number;
  maxUserReports: number;
};
