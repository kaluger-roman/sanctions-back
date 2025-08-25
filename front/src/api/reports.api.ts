import { createEffect } from "effector";
import { ACTIONS } from "./actions";
import { SearchFilters } from "shared/search";
import { CounterSanctionSearchFilters } from "shared/counter-sanctions-search";
import { ReportGenerationResult, UserReport } from "shared/reports";
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

export const generateCounterSanctionsExcelReportFx = createEffect<
  CounterSanctionSearchFilters,
  ReportGenerationResult,
  string
>((payload) =>
  socket.emitWithAnswer<CounterSanctionSearchFilters, ReportGenerationResult>(
    ACTIONS.GENERATE_COUNTER_SANCTIONS_EXCEL_REPORT,
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

export const saveCounterSanctionReportToMyReportsFx = createEffect<
  string,
  void,
  string
>((reportId) =>
  socket.emitWithAnswer<{ reportId: string }, void>(
    ACTIONS.SAVE_COUNTER_SANCTION_REPORT_TO_MY_REPORTS,
    {
      reportId,
    },
  ),
);

export const removeReportFx = createEffect<{ reportId: string }, void, string>(
  (params) =>
    socket.emitWithAnswer<{ reportId: string }, void>(
      ACTIONS.REMOVE_REPORT,
      params,
    ),
);

export const downloadReportFx = createEffect<
  { reportId: string; isDeleteAfter?: boolean; title?: string },
  { arrayBuffer: ArrayBuffer; title?: string },
  string
>(({ reportId, title }: { reportId: string; title?: string }) =>
  socket
    .emitWithAnswer<{ reportId: string }, ArrayBuffer>(
      ACTIONS.DOWNLOAD_REPORT,
      {
        reportId,
      },
    )
    .then((arrayBuffer) => ({ arrayBuffer, title })),
);

export const loadUserReportsFx = createEffect<void, UserReport[], string>(() =>
  socket.emitWithAnswer<void, UserReport[]>(ACTIONS.LOAD_USER_REPORTS),
);

export const downloadMultipleReportsFx = createEffect<
  string[],
  ArrayBuffer,
  string
>((reportIds) =>
  socket.emitWithAnswer<{ reportIds: string[] }, ArrayBuffer>(
    ACTIONS.DOWNLOAD_MULTIPLE_REPORTS,
    { reportIds },
  ),
);

export const deleteMultipleReportsFx = createEffect<string[], string, string>(
  (reportIds) =>
    socket.emitWithAnswer<{ reportIds: string[] }, string>(
      ACTIONS.DELETE_MULTIPLE_REPORTS,
      { reportIds },
    ),
);
