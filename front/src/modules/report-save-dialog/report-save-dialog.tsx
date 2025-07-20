import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useUnit } from "effector-react";
import { reportsModel } from "models";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";

export const ReportSaveDialog = () => {
  const isOpen = useUnit(reportsModel.$isReportSaveDialogOpen);
  const currentReportId = useUnit(reportsModel.$currentReportId);
  const limitStatus = useUnit(reportsModel.$userReportsLimitStatus);

  const willDeleteOldest = limitStatus
    ? limitStatus.currentReportsCount >= limitStatus.maxUserReports
    : false;

  return (
    <Dialog
      open={isOpen && Boolean(currentReportId)}
      onClose={() => reportsModel.discardReport(currentReportId!)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Как вы хотите сохранить отчет?
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Отчет успешно сгенерирован. Выберите действие:
        </Typography>

        {willDeleteOldest && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              У вас достигнут лимит сохраненных отчетов (
              {limitStatus!.currentReportsCount}/{limitStatus!.maxUserReports}).
              При сохранении нового отчета в "Мои отчеты" самый старый будет
              автоматически удален.
            </Typography>
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ position: "relative" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={() =>
                reportsModel.saveReportToMyReports(currentReportId!)
              }
              sx={{ width: "100%" }}
            >
              Загрузить в мои отчеты
            </Button>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() =>
              reportsModel.downloadReportToComputer(currentReportId!)
            }
          >
            Загрузить на компьютер
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<CancelIcon />}
            onClick={() => reportsModel.discardReport(currentReportId!)}
          >
            Не сохранять
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
