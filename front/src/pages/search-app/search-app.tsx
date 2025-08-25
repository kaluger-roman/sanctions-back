import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
  useMediaQuery,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { intersection, last, sortBy } from "lodash";
import { profileModel, searchAppModel, appModel } from "models";
import {
  search,
  searchTypeChanged,
  selectedCountriesChanged,
  selectedRestrictionsChanged,
  selectedSourceDocumentOriginsChanged,
  searchTagsChanged,
  syncFilters,
  searchLanguageChanged,
  queryFormatChanged,
  searchCategoryChanged,
  SearchCategory,
} from "models/search-app/search-app";
import { SearchType, SearchTypeName } from "shared/search-type";
import { theme } from "shared/theme";
import { SearchTable } from "./search-table";
import { SearchAppMetadata } from "modules/search-app-metadata";
import { ReportSaveDialog, QueryFormatInput } from "modules";
import PaidIcon from "@mui/icons-material/Paid";
import LockIcon from "@mui/icons-material/Lock";
import { TarrifKind } from "shared/billing";
import { Lang, LANG_NAMES } from "shared/search";
import { WebAnalytics } from "components";
import { SearchResultActions } from "modules";

export const SearchApp = () => {
  const searchTags = useUnit(searchAppModel.$searchTags);
  const searchType = useUnit(searchAppModel.$searchType);
  const searchCategory = useUnit(searchAppModel.$searchCategory);
  const countries = useUnit(searchAppModel.$countries);
  const allowedCountries = useUnit(searchAppModel.$allowedCountries);
  const restrictions = useUnit(searchAppModel.$restrictions);
  const counterSanctionsRestrictions = useUnit(
    searchAppModel.$counterSanctionsRestrictions,
  );
  const searchLanguage = useUnit(searchAppModel.$searchLanguage);
  const queryFormat = useUnit(searchAppModel.$queryFormat);
  const sourceDocumentOrigins = useUnit(searchAppModel.$sourceDocumentOrigins);
  const counterSanctionsSourceDocuments = useUnit(
    searchAppModel.$counterSanctionsSourceDocuments,
  );
  const selectedRestrictions = useUnit(searchAppModel.$selectedRestrictions);
  const selectedSourceDocumentOrigins = useUnit(
    searchAppModel.$selectedSourceDocumentOrigins,
  );
  const selectedCounterSanctionsRestrictions = useUnit(
    searchAppModel.$selectedCounterSanctionsRestrictions,
  );
  const selectedCounterSanctionsSourceDocuments = useUnit(
    searchAppModel.$selectedCounterSanctionsSourceDocuments,
  );
  const selectedCountries = useUnit(searchAppModel.$selectedCountries);
  const availableFilters = useUnit(searchAppModel.$availableFilters);
  const availableCounterSanctionsFilters = useUnit(
    searchAppModel.$availableCounterSanctionsFilters,
  );
  const allowedCounterSanctionSources = useUnit(
    searchAppModel.$allowedCounterSanctionSources,
  );
  const filtersSyncPending = useUnit(searchAppModel.$filtersSyncPending);
  const currentTarrif = useUnit(profileModel.$currentTarrif);
  const tooManyTagsError = useUnit(searchAppModel.$tooManyTagsError);
  const maxWebViewTagsCount = useUnit(searchAppModel.$maxWebViewTagsCount);
  const authorizationData = useUnit(appModel.$authorizationData);

  const isFree =
    !currentTarrif || currentTarrif?.tarrif.identifier === TarrifKind.free;
  const isSm = useMediaQuery(theme.breakpoints.down("md"));
  const isAdmin = authorizationData?.isAdmin || false;

  // Выбираем данные в зависимости от категории поиска
  const isSanctions = searchCategory === SearchCategory.sanctions;
  const currentRestrictions = isSanctions
    ? restrictions
    : counterSanctionsRestrictions;
  const currentSourceDocuments = isSanctions
    ? sourceDocumentOrigins
    : counterSanctionsSourceDocuments;

  const currentSelectedRestrictions = isSanctions
    ? selectedRestrictions
    : selectedCounterSanctionsRestrictions;
  const currentSelectedSourceDocuments = isSanctions
    ? selectedSourceDocumentOrigins
    : selectedCounterSanctionsSourceDocuments;

  const availableRestrictionsArray = isSanctions
    ? availableFilters.restrictions
    : availableCounterSanctionsFilters.restrictions;
  const availableSourceDocumentsArray = isSanctions
    ? availableFilters.sourceDocumentOrigins
    : availableCounterSanctionsFilters.sourceDocuments;

  const isAllAvailableSanctionsSelected =
    intersection(currentSelectedRestrictions, availableRestrictionsArray)
      .length === availableRestrictionsArray.length;

  const isAllAvailableSourceDocumentOriginsSelected = isSanctions
    ? intersection(
        currentSelectedSourceDocuments,
        availableSourceDocumentsArray,
      ).length === availableSourceDocumentsArray.length
    : intersection(
        currentSelectedSourceDocuments,
        allowedCounterSanctionSources,
      ).length === allowedCounterSanctionSources.length;

  useGate(searchAppModel.SearchAppGate);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        m: 4,
      }}
    >
      <WebAnalytics />
      <Tabs
        value={searchCategory}
        onChange={(_, value) => {
          searchCategoryChanged(value as SearchCategory);
        }}
        aria-label="Search type tabs"
        orientation={isSm ? "vertical" : "horizontal"}
        sx={{
          maxWidth: 1200,
          borderRight: isSm ? 1 : 0,
          borderBottom: isSm ? 0 : 1,
          mb: 2,
          borderColor: "divider",
          width: "100%",
          alignItems: isSm ? "flex-start" : "center",
          justifyContent: isSm ? "flex-start" : "center",
          button: {
            maxWidth: "none",
            textAlign: "center",
          },
        }}
      >
        <Tab
          label="Международные ограничения против РФ и Беларуси"
          value={SearchCategory.sanctions}
        />
        <Tooltip title={!isAdmin ? "В разработке." : ""} arrow placement="top">
          <span>
            <Tab
              label="Контрсанкции РФ по товарам"
              value={SearchCategory.counterSanctions}
              disabled={!isAdmin}
              sx={{
                "&.Mui-disabled": {
                  color: theme.palette.text.disabled,
                  cursor: "not-allowed",
                },
              }}
            />
          </span>
        </Tooltip>
      </Tabs>
      <Box
        sx={{
          ml: "auto",
          mr: "auto",
          borderRadius: 3,
          p: 2,
          background: theme.palette.secondary.light,
          width: "100%",
          maxWidth: 1200,
          flexDirection: "column",
          display: "flex",
          gap: 2,
        }}
      >
        <QueryFormatInput
          queryFormat={queryFormat}
          onFormatChange={queryFormatChanged}
          searchTags={searchTags}
          onSearchTagsChange={searchTagsChanged}
        />

        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 2,
            flexDirection: isSm ? "column" : "row",
          }}
        >
          {isSanctions && (
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
              fullWidth
            >
              <InputLabel>Cтрана</InputLabel>
              <Select
                sx={{
                  flexGrow: 1,
                  maxWidth:
                    isFree && allowedCountries.length !== countries.length
                      ? "calc(100% - 40px)"
                      : "100%",
                }}
                onClose={() => syncFilters()}
                multiple
                value={selectedCountries}
                onChange={({ target }) => {
                  selectedCountriesChanged(
                    last(target.value) === "all"
                      ? allowedCountries.length === selectedCountries.length
                        ? []
                        : allowedCountries
                      : (target.value as Array<string>),
                  );
                }}
                input={<OutlinedInput label="Cтрана" />}
                renderValue={(selected) => selected.join(", ")}
              >
                <MenuItem value={"all"}>
                  <Checkbox
                    disabled={filtersSyncPending}
                    indeterminate={
                      selectedCountries.length > 0 &&
                      allowedCountries.length !== selectedCountries.length
                    }
                    checked={
                      allowedCountries.length === selectedCountries.length
                    }
                  />
                  <ListItemText primary="Все страны" />
                </MenuItem>
                {sortBy(countries, (x) => !allowedCountries.includes(x)).map(
                  (country) => {
                    const notAllowed = allowedCountries.indexOf(country) === -1;
                    return (
                      <MenuItem
                        key={country}
                        value={country}
                        disabled={notAllowed || filtersSyncPending}
                      >
                        <Checkbox
                          checked={selectedCountries.indexOf(country) > -1}
                        />
                        {notAllowed && (
                          <PaidIcon
                            sx={{
                              position: "absolute",
                              left: 6,
                              fontSize: 16,
                            }}
                          />
                        )}
                        <ListItemText primary={country} />
                      </MenuItem>
                    );
                  },
                )}
              </Select>
              {isFree && allowedCountries.length !== countries.length && (
                <Tooltip
                  enterTouchDelay={0}
                  title="Часть списков доступна только в платных тарифах"
                >
                  <LockIcon
                    sx={{ color: theme.palette.grey[800], fontSize: 28 }}
                  />
                </Tooltip>
              )}
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel>Ограничения</InputLabel>
            <Select
              onClose={() => syncFilters()}
              multiple
              value={currentSelectedRestrictions}
              onChange={({ target }) => {
                const newValue =
                  last(target.value as string) === "all"
                    ? isAllAvailableSanctionsSelected
                      ? []
                      : availableRestrictionsArray
                    : (target.value as Array<string>);

                if (isSanctions) {
                  selectedRestrictionsChanged(newValue);
                } else {
                  searchAppModel.selectedCounterSanctionsRestrictionsChanged(
                    newValue,
                  );
                }
              }}
              input={<OutlinedInput label="Ограничения" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{ sx: { maxHeight: 600 } }}
            >
              <MenuItem key="all" value={"all"}>
                <Checkbox
                  disabled={filtersSyncPending}
                  indeterminate={
                    currentSelectedRestrictions.length > 0 &&
                    !isAllAvailableSanctionsSelected
                  }
                  checked={isAllAvailableSanctionsSelected}
                />
                <ListItemText primary="Все ограничения" />
              </MenuItem>
              {sortBy(currentRestrictions, (a) =>
                availableRestrictionsArray.includes(a) ? -1 : 1,
              ).map((restriction) => (
                <MenuItem
                  disabled={
                    availableRestrictionsArray.indexOf(restriction) === -1 ||
                    filtersSyncPending
                  }
                  key={restriction}
                  value={restriction}
                >
                  <Checkbox
                    checked={currentSelectedRestrictions.includes(restriction)}
                  />
                  <ListItemText
                    primaryTypographyProps={{
                      title: restriction,
                      sx: {
                        whiteSpace: "normal",
                      },
                    }}
                    primary={restriction}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
            fullWidth
          >
            <InputLabel>Источник</InputLabel>
            <Select
              sx={{
                flexGrow: 1,
                maxWidth:
                  !isSanctions &&
                  isFree &&
                  allowedCounterSanctionSources.length !==
                    counterSanctionsSourceDocuments.length
                    ? "calc(100% - 40px)"
                    : "100%",
              }}
              onClose={() => syncFilters()}
              multiple
              value={currentSelectedSourceDocuments}
              onChange={({ target }) => {
                const newValue =
                  last(target.value as string) === "all"
                    ? isAllAvailableSourceDocumentOriginsSelected
                      ? []
                      : isSanctions
                      ? availableSourceDocumentsArray
                      : allowedCounterSanctionSources
                    : (target.value as Array<string>);

                if (isSanctions) {
                  selectedSourceDocumentOriginsChanged(newValue);
                } else {
                  searchAppModel.selectedCounterSanctionsSourceDocumentsChanged(
                    newValue,
                  );
                }
              }}
              input={<OutlinedInput label="Источник" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{ sx: { maxHeight: 600 } }}
            >
              <MenuItem key="all" value={"all"}>
                <Checkbox
                  disabled={filtersSyncPending}
                  indeterminate={
                    currentSelectedSourceDocuments.length > 0 &&
                    !isAllAvailableSourceDocumentOriginsSelected
                  }
                  checked={isAllAvailableSourceDocumentOriginsSelected}
                />
                <ListItemText primary="Все источники" />
              </MenuItem>
              {sortBy(currentSourceDocuments, (a) =>
                isSanctions
                  ? availableSourceDocumentsArray.includes(a)
                    ? -1
                    : 1
                  : !allowedCounterSanctionSources.includes(a)
                  ? 1
                  : -1,
              ).map((sourceDocumentOrigin) => {
                const notAllowed = isSanctions
                  ? availableSourceDocumentsArray.indexOf(
                      sourceDocumentOrigin,
                    ) === -1
                  : allowedCounterSanctionSources.indexOf(
                      sourceDocumentOrigin,
                    ) === -1;

                return (
                  <MenuItem
                    disabled={notAllowed || filtersSyncPending}
                    key={sourceDocumentOrigin}
                    value={sourceDocumentOrigin}
                  >
                    <Checkbox
                      checked={currentSelectedSourceDocuments.includes(
                        sourceDocumentOrigin,
                      )}
                    />
                    {!isSanctions && notAllowed && (
                      <PaidIcon
                        sx={{
                          position: "absolute",
                          left: 6,
                          fontSize: 16,
                        }}
                      />
                    )}
                    <ListItemText
                      primaryTypographyProps={{
                        title: sourceDocumentOrigin,
                        sx: {
                          whiteSpace: "normal",
                        },
                      }}
                      primary={sourceDocumentOrigin}
                    />
                  </MenuItem>
                );
              })}
            </Select>
            {!isSanctions &&
              isFree &&
              allowedCounterSanctionSources.length !==
                counterSanctionsSourceDocuments.length && (
                <Tooltip
                  enterTouchDelay={0}
                  title="Часть источников доступна только в платных тарифах"
                >
                  <LockIcon
                    sx={{ color: theme.palette.grey[800], fontSize: 28 }}
                  />
                </Tooltip>
              )}
          </FormControl>

          <FormControl required fullWidth>
            <InputLabel>Тип поиска</InputLabel>
            <Select
              multiple
              value={searchType}
              onChange={({ target }) =>
                searchTypeChanged(target.value as Array<SearchType>)
              }
              input={<OutlinedInput label="Тип поиска" />}
              renderValue={(selected) =>
                selected
                  .map((type) => SearchTypeName[type as SearchType])
                  .join(", ")
              }
            >
              <MenuItem value="code">
                <Checkbox checked={searchType.includes("code")} />
                <ListItemText primary={SearchTypeName.code} />
              </MenuItem>
              <MenuItem value="description">
                <Checkbox checked={searchType.includes("description")} />
                <ListItemText primary={SearchTypeName.description} />
              </MenuItem>
              <MenuItem value="codeAddition">
                <Checkbox checked={searchType.includes("codeAddition")} />
                <ListItemText primary={SearchTypeName.codeAddition} />
              </MenuItem>
            </Select>
          </FormControl>

          {isSanctions && (
            <FormControl fullWidth>
              <InputLabel>Язык</InputLabel>
              <Select
                value={searchLanguage}
                onChange={({ target }) =>
                  searchLanguageChanged(target.value as Lang)
                }
                input={<OutlinedInput label="Язык" />}
              >
                {Object.values(Lang).map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {LANG_NAMES[lang]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            sx={{
              maxWidth: isSm ? "100%" : 400,
              minWidth: 150,
              ml: "auto",
              width: isSm ? "100%" : "auto",
            }}
            variant="contained"
            onClick={() => setTimeout(() => search(), 0)}
            onTouchEnd={() =>
              setTimeout(() => {
                search();
              }, 0)
            }
          >
            Поиск
          </Button>
        </Box>
        <SearchResultActions />
        {tooManyTagsError && (
          <Alert variant="outlined" severity="warning">
            Запрос слишком объемный (более {maxWebViewTagsCount} тегов), для
            выгрузки результата используйте Excel-отчет
          </Alert>
        )}
        <SearchTable />
      </Box>
      <SearchAppMetadata />
      <ReportSaveDialog />
    </Box>
  );
};
