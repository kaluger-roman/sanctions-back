import {
  Box,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { QUERY_FORMAT_NAMES } from "../pages/search-app/search-app.constants";
import { QueryFormat } from "../shared/search/types";
import { ExcelFileDropZone } from "./excel-file-drop-zone";
import { trim } from "lodash";

type QueryFormatInputProps = {
  queryFormat: QueryFormat;
  onFormatChange: (format: QueryFormat) => void;
  searchTags: string[];
  onSearchTagsChange: (tags: string[]) => void;
};

export const QueryFormatInput = ({
  queryFormat,
  onFormatChange,
  searchTags,
  onSearchTagsChange,
}: QueryFormatInputProps) => {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormLabel component="legend">Формат запроса:</FormLabel>
        <RadioGroup
          row
          value={queryFormat}
          onChange={(e) => onFormatChange(e.target.value as QueryFormat)}
        >
          {Object.values(QueryFormat).map((format) => (
            <FormControlLabel
              key={format}
              value={format}
              control={<Radio size="small" />}
              label={QUERY_FORMAT_NAMES[format]}
            />
          ))}
        </RadioGroup>
      </Box>
      <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
        {queryFormat === QueryFormat.searchString && (
          <MuiChipsInput
            addOnBlur
            placeholder="Коды или описание (через Enter)"
            sx={{ flexGrow: 1 }}
            value={searchTags}
            onChange={onSearchTagsChange}
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
              onSearchTagsChange(newTags);
            }}
          />
        )}
        {queryFormat === QueryFormat.excelFile && <ExcelFileDropZone />}
      </Box>
    </Box>
  );
};
