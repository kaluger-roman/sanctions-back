import { Box, Paper, Table, TableBody } from "@mui/material";
import { useUnit } from "effector-react";
import { searchAppModel } from "models";
import { theme } from "shared/theme";
import { TableHeader } from "./components/table-head";
import { EmptySearch } from "./components/empty-search";
import { CategoryRows } from "./components/category-rows";
import { isSearchEmpty } from "./search-table.helpers";

export const SearchTable = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);

  return (
    <Box sx={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <EmptySearch />
      {!isSearchEmpty(searchResult) && (
        <Table
          component={Paper}
          sx={{
            "& th": {
              fontWeight: "bold",
              fontSize: "18px",
              background: theme.palette.grey[300],
            },
            td: {
              border: "none",
            },
            "tr:not(:last-child),th": {
              borderBottom: `1px solid ${theme.palette.grey[900]}`,
            },
          }}
        >
          <TableHeader />
          <TableBody>
            <CategoryRows data={searchResult.code} label="Совпадение по коду" />
            <CategoryRows
              data={searchResult.description}
              label="Совпадение по описанию"
            />

            <CategoryRows
              data={searchResult.codeAddition}
              label="Возможное дополнение кода"
            />
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
