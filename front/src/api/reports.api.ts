import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { SearchFilters } from "shared/search";
import { ReportGenerationResult } from "shared/reports";
import { socket } from "./app.api";

export const generateExcelReportFx = createEffect<
  SearchFilters,
  ReportGenerationResult,
  string
>((payload) =>
  socket.emitWithAnswer<SearchFilters, ReportGenerationResult>(
    ACTIONS.GENERATE_EXCEL_REPORT,
    payload,
  ),
);

export const saveReportToMyReportsFx = createEffect<string, void, string>(
  (reportId) =>
    socket.emitWithAnswer<{ reportId: string }, void>(
      ACTIONS.SAVE_REPORT_TO_MY_REPORTS,
      {
        reportId,
      },
    ),
);

export const removeReportFx = createEffect<string, void, string>((reportId) =>
  socket.emitWithAnswer<{ reportId: string }, void>(ACTIONS.REMOVE_REPORT, {
    reportId,
  }),
);

export const downloadReportFx = createEffect<string, ArrayBuffer, string>(
  (reportId) =>
    socket.emitWithAnswer<{ reportId: string }, ArrayBuffer>(
      ACTIONS.DOWNLOAD_REPORT,
      {
        reportId,
      },
    ),
);
