import { Button, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { reportsModel, searchAppModel, appModel } from "models";
import { SearchCategory } from "models/search-app/search-app";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { isSearchEmpty, isCounterSanctionSearchEmpty } from "shared/search";

export const SearchResultActions = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);
  const counterSanctionSearchResult = useUnit(
    searchAppModel.$counterSanctionSearchResult,
  );
  const searchCategory = useUnit(searchAppModel.$searchCategory);
  const authorizationData = useUnit(appModel.$authorizationData);
  const tooManyTagsError = useUnit(searchAppModel.$tooManyTagsError);

  const isSanctions = searchCategory === SearchCategory.sanctions;
  const hasResults = isSanctions
    ? !isSearchEmpty(searchResult)
    : !isCounterSanctionSearchEmpty(counterSanctionSearchResult);

  const isAuthenticated = Boolean(authorizationData);
  const isDisabled = (!hasResults && !tooManyTagsError) || !isAuthenticated;
  const tooltipTitle = !isAuthenticated
    ? "Операция доступна только зарегистрированным пользователям, пожалуйста, войдите в систему."
    : "";

  if (!hasResults && !tooManyTagsError) return null;

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
