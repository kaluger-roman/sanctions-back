import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Button,
  Chip,
  FormControlLabel,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useGate, useUnit } from "effector-react";
import { myReportsModel } from "models";
import { reportsApi } from "api";

export const MyReports = () => {
  useGate(myReportsModel.MyReportsGate);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    userReports,
    selectedReportIds,
    selectedCount,
    hasSelection,
    isSelectAllChecked,
    pending,
    isDeleteConfirmDialogOpen,
  } = useUnit({
    userReports: myReportsModel.$userReports,
    selectedReportIds: myReportsModel.$selectedReportIds,
    selectedCount: myReportsModel.$selectedCount,
    hasSelection: myReportsModel.$hasSelection,
    isSelectAllChecked: myReportsModel.$isSelectAllChecked,
    pending: reportsApi.loadUserReportsFx.pending,
    isDeleteConfirmDialogOpen: myReportsModel.$isDeleteConfirmDialogOpen,
  });

  const {
    toggleReportSelection,
    toggleSelectAll,
    downloadSelectedReports,
    downloadSingleReport,
    openDeleteConfirmDialog,
    closeDeleteConfirmDialog,
    confirmDeleteSelectedReports,
  } = myReportsModel;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      timeZone: "UTC",
      year: "numeric",
      month: isMobile ? "short" : "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: isMobile ? undefined : "short",
    });
  };

  const isSelected = (reportId: string) => selectedReportIds.includes(reportId);

  if (pending) return null;

  return (
    <Box sx={{ pl: 2, pr: 2, width: "100%", maxWidth: 800 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: isMobile ? 0 : 1,
        }}
      >
        <Typography sx={{ mb: 0, mt: 2 }} variant="h6">
          Мои отчеты
        </Typography>
      </Box>

      {userReports.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          У вас пока нет сохраненных отчетов.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              mb: isMobile ? 0 : 2,
              ml: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: isMobile ? 1 : 0,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSelectAllChecked}
                  onChange={() => toggleSelectAll()}
                  indeterminate={hasSelection && !isSelectAllChecked}
                  size={isMobile ? "small" : "medium"}
                />
              }
              label="Выбрать все"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: isMobile ? "0.875rem" : "1rem",
                },
              }}
            />

            {hasSelection && (
              <Chip
                label={`Выбрано: ${selectedCount}`}
                color="primary"
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>

          <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell padding={isMobile ? "checkbox" : "checkbox"} />
                  <TableCell>
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      fontWeight="medium"
                    >
                      Название
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      fontWeight="medium"
                    >
                      Дата создания
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: isMobile ? 48 : 67 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {userReports.map((report) => (
                  <TableRow
                    key={report.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => toggleReportSelection(report.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(report.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReportSelection(report.id);
                        }}
                        size={isMobile ? "small" : "medium"}
                      />
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>
                      <Typography
                        variant={isMobile ? "body2" : "body2"}
                        fontWeight="medium"
                        sx={{
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          lineHeight: isMobile ? 1.2 : 1.43,
                        }}
                      >
                        {report.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>
                      <Typography
                        variant={isMobile ? "caption" : "body2"}
                        color="text.secondary"
                        sx={{
                          fontSize: isMobile ? "0.7rem" : "0.875rem",
                          lineHeight: isMobile ? 1.2 : 1.43,
                        }}
                      >
                        {formatDate(report.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: isMobile ? 0.5 : 1 }}>
                      <Tooltip title="Скачать отчет">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSingleReport(report.id);
                          }}
                          sx={{
                            padding: isMobile ? "4px" : "8px",
                          }}
                        >
                          <DownloadIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {hasSelection && (
            <Box
              sx={{
                mt: isMobile ? 2 : 3,
                display: "flex",
                gap: isMobile ? 1 : 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                variant="contained"
                startIcon={
                  <DownloadIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                }
                onClick={() => downloadSelectedReports()}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "6px 12px" : "8px 16px",
                }}
              >
                Скачать выбранные ({selectedCount})
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: isMobile ? 16 : 20 }} />}
                onClick={() => openDeleteConfirmDialog()}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "6px 12px" : "8px 16px",
                }}
              >
                Удалить выбранные ({selectedCount})
              </Button>
            </Box>
          )}

          <Dialog
            open={isDeleteConfirmDialogOpen}
            onClose={() => closeDeleteConfirmDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Подтверждение удаления"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Вы уверены, что хотите удалить выбранные отчеты? Это действие
                необратимо.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => closeDeleteConfirmDialog()}
                color="primary"
                variant="outlined"
                size="small"
              >
                Отмена
              </Button>
              <Button
                onClick={() => confirmDeleteSelectedReports()}
                color="error"
                variant="contained"
                size="small"
              >
                Удалить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};
