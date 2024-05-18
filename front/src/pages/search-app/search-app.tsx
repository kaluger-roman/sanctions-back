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
} from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { intersection, last, sortBy } from "lodash";
import { searchAppModel } from "models";
import {
  search,
  searchTypeChanged,
  selectedCountriesChanged,
  selectedRestrictionsChanged,
  searchTagsChanged,
  syncFilters,
} from "models/search-app/search-app";
import { MuiChipsInput } from "mui-chips-input";
import { SearchType, SearchTypeName } from "shared/search-type";
import { theme } from "shared/theme";
import { SearchTable } from "./search-table";
import { useState } from "react";

export const SearchApp = () => {
  const searchTags = useUnit(searchAppModel.$searchTags);
  const searchType = useUnit(searchAppModel.$searchType);
  const countries = useUnit(searchAppModel.$countries);
  const restrictions = useUnit(searchAppModel.$restrictions);
  const selectedRestrictions = useUnit(searchAppModel.$selectedRestrictions);
  const selectedCountries = useUnit(searchAppModel.$selectedCountries);
  const availableFilters = useUnit(searchAppModel.$availableFilters);
  const filtersSyncPending = useUnit(searchAppModel.$filtersSyncPending);

  const [currentTagValue, setCurrentTagValue] = useState("");

  const isAllAvailableSanctionsSelected =
    intersection(selectedRestrictions, availableFilters.restrictions).length ===
    availableFilters.restrictions.length;

  useGate(searchAppModel.SearchAppGate);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
            placeholder="Введите коды или текст поиска (через Enter)"
            sx={{ flexGrow: 1 }}
            value={searchTags}
            onChange={searchTagsChanged}
            inputValue={currentTagValue}
            name="searchTags"
            disableEdition
            onInput={(e) => {
              setCurrentTagValue((e.target as HTMLInputElement).value);
            }}
            onAddChip={() => setCurrentTagValue("")}
            onPaste={(e) => {
              e.preventDefault();
              const value = e.clipboardData.getData("text");

              const newTags = [
                ...searchTags,
                ...value.split(/(\r)?\n/g).filter(Boolean),
              ];

              if (newTags.length > 1) {
                searchTagsChanged(newTags);
                return setCurrentTagValue("");
              }

              setCurrentTagValue(value);
            }}
          />
          <Button
            disabled={!searchTags.length}
            variant="contained"
            onClick={() => search()}
          >
            Поиск
          </Button>
        </Box>

        <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Cтрана</InputLabel>
            <Select
              onClose={() => syncFilters()}
              multiple
              value={selectedCountries}
              onChange={({ target }) => {
                selectedCountriesChanged(
                  last(target.value) === "all"
                    ? countries.length === selectedCountries.length
                      ? []
                      : countries
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
                    countries.length !== selectedCountries.length
                  }
                  checked={countries.length === selectedCountries.length}
                />
                <ListItemText primary="Все страны" />
              </MenuItem>
              {countries.map((country) => (
                <MenuItem
                  key={country}
                  value={country}
                  disabled={
                    countries.indexOf(country) === -1 || filtersSyncPending
                  }
                >
                  <Checkbox checked={selectedCountries.indexOf(country) > -1} />
                  <ListItemText primary={country} />
                </MenuItem>
              ))}
            </Select>
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
              MenuProps={{ sx: { maxHeight: 600, width: 200 } }}
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
                        extWrap: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                    primary={restriction}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
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
            </Select>
          </FormControl>
        </Box>

        <SearchTable />
      </Box>
    </Box>
  );
};
