import { createEvent, createStore, sample, createEffect } from "effector";
import { createGate } from "effector-react";
import { reportsApi } from "api";
import { loadPreferencesFx } from "api/preferences.api";
import { UserReport, UserReportsLimitStatus } from "shared/reports";
import { Notification } from "@master_kufa/client-tools";

// Gate
export const MyReportsGate = createGate();

// Stores
export const $userReports = createStore<UserReport[]>([]);
export const $selectedReportIds = createStore<string[]>([]);
export const $isSelectAllChecked = createStore<boolean>(false);
export const $isDeleteConfirmDialogOpen = createStore<boolean>(false);
export const $userReportsLimitStatus =
  createStore<UserReportsLimitStatus | null>(null);

// Events
export const toggleReportSelection = createEvent<string>();
export const toggleSelectAll = createEvent<void>();
export const clearSelection = createEvent<void>();
export const downloadSelectedReports = createEvent<void>();
export const deleteSelectedReports = createEvent<void>();
export const downloadSingleReport = createEvent<string>();
export const openDeleteConfirmDialog = createEvent<void>();
export const closeDeleteConfirmDialog = createEvent<void>();
export const confirmDeleteSelectedReports = createEvent<void>();

// Effect for handling ZIP file download
const handleZipDownloadFx = createEffect((arrayBuffer: ArrayBuffer) => {
  const blob = new Blob([arrayBuffer], {
    type: "application/zip",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reports-${new Date().toISOString().split("T")[0]}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
});

// Effect for handling single report file download
const handleFileDownloadFx = createEffect(
  ({ arrayBuffer, title }: { arrayBuffer: ArrayBuffer; title?: string }) => {
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

// Derived stores
export const $selectedCount = $selectedReportIds.map((ids) => ids.length);
export const $hasSelection = $selectedCount.map((count) => count > 0);

// Samples
sample({
  clock: MyReportsGate.open,
  target: reportsApi.loadUserReportsFx,
});

sample({
  clock: MyReportsGate.open,
  target: loadPreferencesFx,
});

sample({
  clock: reportsApi.loadUserReportsFx.doneData,
  target: $userReports,
});

sample({
  clock: loadPreferencesFx.doneData,
  target: $userReportsLimitStatus,
});

// Reload limit status after operations that might affect it
sample({
  clock: [
    reportsApi.deleteMultipleReportsFx.done,
    reportsApi.removeReportFx.done,
  ],
  target: loadPreferencesFx,
});

sample({
  clock: toggleReportSelection,
  source: $selectedReportIds,
  fn: (selectedIds, reportId) => {
    const isSelected = selectedIds.includes(reportId);
    return isSelected
      ? selectedIds.filter((id) => id !== reportId)
      : [...selectedIds, reportId];
  },
  target: $selectedReportIds,
});

sample({
  clock: toggleSelectAll,
  source: [$userReports, $isSelectAllChecked] as const,
  fn: ([reports, isSelectAllChecked]) => {
    return isSelectAllChecked ? [] : reports.map((report) => report.id);
  },
  target: $selectedReportIds,
});

sample({
  clock: $selectedReportIds,
  source: $userReports,
  fn: (reports, selectedIds) => {
    if (reports.length === 0) return false;
    return selectedIds.length === reports.length;
  },
  target: $isSelectAllChecked,
});

sample({
  clock: clearSelection,
  fn: () => [],
  target: $selectedReportIds,
});

sample({
  clock: downloadSingleReport,
  source: $userReports,
  fn: (userReports, reportId) => ({
    reportId,
    title: userReports.find((r) => r.id === reportId)?.name,
  }),
  target: reportsApi.downloadReportFx,
});

// Handle single report download
sample({
  clock: reportsApi.downloadReportFx.doneData,
  target: handleFileDownloadFx,
});

// Use batch API for multiple operations or single download for one report
sample({
  clock: downloadSelectedReports,
  source: [$selectedReportIds, $userReports] as const,
  filter: ([selectedIds]) => selectedIds.length === 1,
  fn: ([selectedIds, userReports]) => {
    const reportId = selectedIds[0];
    return {
      reportId,
      title: userReports.find((r) => r.id === reportId)?.name,
    };
  },
  target: reportsApi.downloadReportFx,
});

sample({
  clock: downloadSelectedReports,
  source: $selectedReportIds,
  filter: (selectedIds) => selectedIds.length > 1,
  target: reportsApi.downloadMultipleReportsFx,
});

sample({
  clock: deleteSelectedReports,
  target: openDeleteConfirmDialog,
});

// Handle ZIP download
sample({
  clock: reportsApi.downloadMultipleReportsFx.doneData,
  target: handleZipDownloadFx,
});

// Dialog confirmation logic
sample({
  clock: openDeleteConfirmDialog,
  fn: () => true,
  target: $isDeleteConfirmDialogOpen,
});

sample({
  clock: closeDeleteConfirmDialog,
  fn: () => false,
  target: $isDeleteConfirmDialogOpen,
});

sample({
  clock: confirmDeleteSelectedReports,
  source: $selectedReportIds,
  target: reportsApi.deleteMultipleReportsFx,
});

sample({
  clock: confirmDeleteSelectedReports,
  fn: () => false,
  target: $isDeleteConfirmDialogOpen,
});

// Clear selection after successful operations
sample({
  clock: [
    reportsApi.downloadMultipleReportsFx.done,
    reportsApi.deleteMultipleReportsFx.done,
  ],
  target: clearSelection,
});

// Reload reports after delete
sample({
  clock: [
    reportsApi.deleteMultipleReportsFx.done,
    reportsApi.removeReportFx.done,
  ],
  target: reportsApi.loadUserReportsFx,
});

// Reset stores
$userReports.reset(MyReportsGate.close);
$selectedReportIds.reset(MyReportsGate.close);
$isSelectAllChecked.reset(MyReportsGate.close);
$isDeleteConfirmDialogOpen.reset(MyReportsGate.close);
$userReportsLimitStatus.reset(MyReportsGate.close);

sample({
  clock: reportsApi.deleteMultipleReportsFx.doneData,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Отчеты успешно удалены!",
  }),
  target: Notification.add,
});
