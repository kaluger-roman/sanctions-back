import { createEvent, createStore, sample, createEffect } from "effector";
import { reportsApi } from "api";
import { loadPreferencesFx } from "api/preferences.api";
import { ReportGenerationResult, UserReportsLimitStatus } from "shared/reports";
import { searchAppModel } from "models/search-app";
import { Notification } from "@master_kufa/client-tools";

// Stores

export const $currentReportId = createStore<string | null>(null);
export const $isReportSaveDialogOpen = createStore<boolean>(false);
export const $userReportsLimitStatus =
  createStore<UserReportsLimitStatus | null>(null);

// Events
export const generateExcelReportClicked = createEvent<void>();
export const downloadExcelReport = createEvent<string>();
const setReportSaveDialogOpen = createEvent<boolean>();
export const saveReportToMyReports = createEvent<string>();
export const downloadReportToComputer = createEvent<string>();
export const discardReport = createEvent<string>();

// Effect for handling the file download
const handleFileDownloadFx = createEffect(
  ({ arrayBuffer, title }: { arrayBuffer: ArrayBuffer; title?: string }) => {
    // Convert ArrayBuffer to Blob and create download link
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Use title if available, otherwise use default name with date
    const filename = title
      ? `${title}.xlsx`
      : `sanctions-report-${new Date().toISOString().split("T")[0]}.xlsx`;

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
);

// Samples
sample({
  clock: generateExcelReportClicked,
  source: [
    searchAppModel.$selectedCountries,
    searchAppModel.$selectedRestrictions,
    searchAppModel.$selectedSourceDocumentOrigins,
    searchAppModel.$searchType,
    searchAppModel.$searchTags,
    searchAppModel.$searchLanguage,
  ] as const,
  fn: ([
    countries,
    restrictions,
    sourceDocumentOrigins,
    searchTypes,
    searchTags,
    searchLanguage,
  ]) => ({
    countries,
    restrictions,
    sourceDocumentOrigins,
    searchTypes,
    searchTags,
    searchLanguage,
  }),
  target: reportsApi.generateExcelReportFx,
});

sample({
  clock: reportsApi.generateExcelReportFx.doneData,
  fn: ({ id }: ReportGenerationResult) => id,
  target: $currentReportId,
});

sample({
  clock: reportsApi.generateExcelReportFx.doneData,
  fn: () => true,
  target: setReportSaveDialogOpen,
});

sample({
  clock: searchAppModel.SearchAppGate.open,
  target: loadPreferencesFx,
});

sample({
  clock: setReportSaveDialogOpen,
  target: $isReportSaveDialogOpen,
});

sample({
  clock: [saveReportToMyReports, downloadReportToComputer, discardReport],
  fn: () => false,
  target: setReportSaveDialogOpen,
});

sample({
  clock: setReportSaveDialogOpen,
  filter: (isOpen) => !isOpen,
  fn: () => null,
  target: $currentReportId,
});

sample({
  clock: saveReportToMyReports,
  target: reportsApi.saveReportToMyReportsFx,
});

sample({
  clock: downloadReportToComputer,
  fn: (reportId) => ({ reportId, isDeleteAfter: true }),
  target: reportsApi.downloadReportFx,
});

sample({
  clock: reportsApi.downloadReportFx.doneData,
  target: handleFileDownloadFx,
});

// Auto-delete report after successful download to computer
sample({
  clock: reportsApi.downloadReportFx.done,
  filter: ({ params }) => !!params.isDeleteAfter,
  fn: ({ params }) => ({ reportId: params.reportId }),
  target: reportsApi.removeReportFx,
});

sample({
  clock: discardReport,
  fn: (reportId) => ({ reportId }),
  target: reportsApi.removeReportFx,
});

// Reset stores
$currentReportId.reset(generateExcelReportClicked);

sample({
  clock: reportsApi.saveReportToMyReportsFx.doneData,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Отчет успешно сохранен!",
  }),
  target: Notification.add,
});

// Load limit status when opening save dialog
sample({
  clock: setReportSaveDialogOpen,
  filter: (isOpen) => isOpen,
  target: loadPreferencesFx,
});

sample({
  clock: loadPreferencesFx.doneData,
  target: $userReportsLimitStatus,
});
