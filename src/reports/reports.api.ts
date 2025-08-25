import { reportsService } from "./reports.service";
import { ACTIONS } from "../actions";
import { SearchFilters } from "../search-app/search-app.types";
import { CounterSanctionSearchFilters } from "../search-app/counter-sanctions.types";
import { Api } from "../api.service";
import { Request } from "../types";

export const reportsApiHandlers = {
  [ACTIONS.GENERATE_EXCEL_REPORT]: (payload: Request<SearchFilters>) =>
    reportsService.generateExcelReport(payload),
  [ACTIONS.GENERATE_COUNTER_SANCTIONS_EXCEL_REPORT]: (
    payload: Request<CounterSanctionSearchFilters>,
  ) => reportsService.generateCounterSanctionsExcelReport(payload),
  [ACTIONS.REMOVE_REPORT]: (payload: Request<{ reportId: string }>) =>
    reportsService.removeReport(payload),
  [ACTIONS.DOWNLOAD_REPORT]: (payload: Request<{ reportId: string }>) =>
    reportsService.downloadReport(payload),
  [ACTIONS.SAVE_REPORT_TO_MY_REPORTS]: (
    payload: Request<{ reportId: string }>,
  ) => reportsService.saveReportToMyReports(payload),
  [ACTIONS.SAVE_COUNTER_SANCTION_REPORT_TO_MY_REPORTS]: (
    payload: Request<{ reportId: string }>,
  ) => reportsService.saveCounterSanctionReportToMyReports(payload),
  [ACTIONS.LOAD_USER_REPORTS]: (payload: Request<void>) =>
    reportsService.loadUserReports(payload),
  [ACTIONS.DOWNLOAD_MULTIPLE_REPORTS]: (
    payload: Request<{ reportIds: string[] }>,
  ) => reportsService.downloadMultipleReports(payload),
  [ACTIONS.DELETE_MULTIPLE_REPORTS]: (
    payload: Request<{ reportIds: string[] }>,
  ) => reportsService.deleteMultipleReports(payload),
};

export const reportsApi = new Api(reportsApiHandlers);
