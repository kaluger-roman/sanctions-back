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
} from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { intersection, last, sortBy, trim } from "lodash";
import { profileModel, searchAppModel } from "models";
import {
  search,
  searchTypeChanged,
  selectedCountriesChanged,
  selectedRestrictionsChanged,
  selectedSourceDocumentOriginsChanged,
  searchTagsChanged,
  syncFilters,
  searchLanguageChanged,
} from "models/search-app/search-app";
import { MuiChipsInput } from "mui-chips-input";
import { SearchType, SearchTypeName } from "shared/search-type";
import { theme } from "shared/theme";
import { SearchTable } from "./search-table";
import { SearchAppMetadata } from "modules/search-app-metadata";
import PaidIcon from "@mui/icons-material/Paid";
import LockIcon from "@mui/icons-material/Lock";
import { TarrifKind } from "shared/billing";
import { Lang, LANG_NAMES } from "shared/search";

export const SearchApp = () => {
  const searchTags = useUnit(searchAppModel.$searchTags);
  const searchType = useUnit(searchAppModel.$searchType);
  const countries = useUnit(searchAppModel.$countries);
  const allowedCountries = useUnit(searchAppModel.$allowedCountries);
  const restrictions = useUnit(searchAppModel.$restrictions);
  const searchLanguage = useUnit(searchAppModel.$searchLanguage);
  const sourceDocumentOrigins = useUnit(searchAppModel.$sourceDocumentOrigins);
  const selectedRestrictions = useUnit(searchAppModel.$selectedRestrictions);
  const selectedSourceDocumentOrigins = useUnit(
    searchAppModel.$selectedSourceDocumentOrigins,
  );
  const selectedCountries = useUnit(searchAppModel.$selectedCountries);
  const availableFilters = useUnit(searchAppModel.$availableFilters);
  const filtersSyncPending = useUnit(searchAppModel.$filtersSyncPending);
  const currentTarrif = useUnit(profileModel.$currentTarrif);

  const isFree =
    !currentTarrif || currentTarrif?.tarrif.identifier === TarrifKind.free;
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const isAllAvailableSanctionsSelected =
    intersection(selectedRestrictions, availableFilters.restrictions).length ===
    availableFilters.restrictions.length;

  const isAllAvailableSourceDocumentOriginsSelected =
    intersection(
      selectedSourceDocumentOrigins,
      availableFilters.sourceDocumentOrigins,
    ).length === availableFilters.sourceDocumentOrigins.length;

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
        <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
          <MuiChipsInput
            addOnBlur
            placeholder="Коды или описание (через Enter)"
            sx={{ flexGrow: 1 }}
            value={searchTags}
            onChange={searchTagsChanged}
            name="searchTags"
            onPaste={(e) => {
              e.preventDefault();
              const value = e.clipboardData.getData("text");

              const newTags = [
                ...searchTags,
                ...value
                  .split(/(\r)?\n/g)
                  .map(trim)
                  .filter(Boolean),
              ];

              searchTagsChanged(newTags);
            }}
          />
          {!isSm && (
            <Button
              variant="contained"
              onClick={() => setTimeout(() => search(), 0)}
            >
              Поиск
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 2,
            flexDirection: isSm ? "column" : "row",
          }}
        >
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
                  checked={allowedCountries.length === selectedCountries.length}
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
                          sx={{ position: "absolute", left: 6, fontSize: 16 }}
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

          <FormControl fullWidth>
            <InputLabel>Ограничения</InputLabel>
            <Select
              onClose={() => syncFilters()}
              multiple
              value={selectedRestrictions}
              onChange={({ target }) => {
                selectedRestrictionsChanged(
                  last(target.value as string) === "all"
                    ? isAllAvailableSanctionsSelected
                      ? []
                      : availableFilters.restrictions
                    : (target.value as Array<string>),
                );
              }}
              input={<OutlinedInput label="Ограничения" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{ sx: { maxHeight: 600 } }}
            >
              <MenuItem key="all" value={"all"}>
                <Checkbox
                  disabled={filtersSyncPending}
                  indeterminate={
                    selectedRestrictions.length > 0 &&
                    !isAllAvailableSanctionsSelected
                  }
                  checked={isAllAvailableSanctionsSelected}
                />
                <ListItemText primary="Все ограничения" />
              </MenuItem>
              {sortBy(restrictions, (a) =>
                availableFilters.restrictions.includes(a) ? -1 : 1,
              ).map((restriction) => (
                <MenuItem
                  disabled={
                    availableFilters.restrictions.indexOf(restriction) === -1 ||
                    filtersSyncPending
                  }
                  key={restriction}
                  value={restriction}
                >
                  <Checkbox
                    checked={selectedRestrictions.includes(restriction)}
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

          <FormControl fullWidth>
            <InputLabel>Источник</InputLabel>
            <Select
              onClose={() => syncFilters()}
              multiple
              value={selectedSourceDocumentOrigins}
              onChange={({ target }) => {
                selectedSourceDocumentOriginsChanged(
                  last(target.value as string) === "all"
                    ? isAllAvailableSourceDocumentOriginsSelected
                      ? []
                      : availableFilters.sourceDocumentOrigins
                    : (target.value as Array<string>),
                );
              }}
              input={<OutlinedInput label="Источник" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{ sx: { maxHeight: 600 } }}
            >
              <MenuItem key="all" value={"all"}>
                <Checkbox
                  disabled={filtersSyncPending}
                  indeterminate={
                    selectedSourceDocumentOrigins.length > 0 &&
                    !isAllAvailableSourceDocumentOriginsSelected
                  }
                  checked={isAllAvailableSourceDocumentOriginsSelected}
                />
                <ListItemText primary="Все источники" />
              </MenuItem>
              {sortBy(sourceDocumentOrigins, (a) =>
                availableFilters.sourceDocumentOrigins.includes(a) ? -1 : 1,
              ).map((sourceDocumentOrigin) => (
                <MenuItem
                  disabled={
                    availableFilters.sourceDocumentOrigins.indexOf(
                      sourceDocumentOrigin,
                    ) === -1 || filtersSyncPending
                  }
                  key={sourceDocumentOrigin}
                  value={sourceDocumentOrigin}
                >
                  <Checkbox
                    checked={selectedSourceDocumentOrigins.includes(
                      sourceDocumentOrigin,
                    )}
                  />
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
              ))}
            </Select>
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

          {isSm && (
            <Button
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
          )}
        </Box>

        <SearchTable />
      </Box>
      <SearchAppMetadata />
    </Box>
  );
};
