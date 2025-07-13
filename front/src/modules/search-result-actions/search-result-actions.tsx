import { Button, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { reportsModel, searchAppModel, appModel } from "models";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { isSearchEmpty } from "shared/search";

export const SearchResultActions = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);
  const authorizationData = useUnit(appModel.$authorizationData);
  const hasResults = !isSearchEmpty(searchResult);
  const isAuthenticated = Boolean(authorizationData);
  const isAdmin = Boolean(authorizationData?.isAdmin);

  const isDisabled = !hasResults || !isAuthenticated;
  const tooltipTitle = !isAuthenticated
    ? "Операция доступна только зарегистрированным пользователям, пожалуйста, войдите в систему."
    : "";

  if (!hasResults || !isAdmin) return null;

  return (
    <Tooltip disableHoverListener={isAuthenticated} title={tooltipTitle}>
      <span>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          onClick={() => reportsModel.generateExcelReportClicked()}
          disabled={isDisabled}
        >
          Подготовить Excel-отчет
        </Button>
      </span>
    </Tooltip>
  );
};
