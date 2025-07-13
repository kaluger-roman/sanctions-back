import { reportsService } from "./reports.service";
import { ACTIONS } from "../actions";
import { SearchFilters } from "../search-app/search-app.types";
import { Api } from "../api.service";
import { Request } from "../types";

export const reportsApiHandlers = {
  [ACTIONS.GENERATE_EXCEL_REPORT]: (payload: Request<SearchFilters>) =>
    reportsService.generateExcelReport(payload),
  [ACTIONS.REMOVE_REPORT]: (payload: Request<{ reportId: string }>) =>
    reportsService.removeReport(payload),
  [ACTIONS.DOWNLOAD_REPORT]: (payload: Request<{ reportId: string }>) =>
    reportsService.downloadReport(payload),
  [ACTIONS.SAVE_REPORT_TO_MY_REPORTS]: (
    payload: Request<{ reportId: string }>,
  ) => reportsService.saveReportToMyReports(payload),
};

export const reportsApi = new Api(reportsApiHandlers);
