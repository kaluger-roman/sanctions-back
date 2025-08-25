import { Box, Paper, Table, TableBody } from "@mui/material";
import { useUnit } from "effector-react";
import { searchAppModel } from "models";
import { SearchCategory } from "models/search-app/search-app";
import { theme } from "shared/theme";
import { TableHeader } from "./components/table-head";
import { EmptySearch } from "./components/empty-search";
import { CategoryRows } from "./components/category-rows";
import { isEmpty } from "lodash";

const isResultEmpty = (result: any) => {
  if (!result) return true;
  return Object.values(result).every((category: any) => isEmpty(category));
};

export const SearchTable = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);
  const counterSanctionSearchResult = useUnit(
    searchAppModel.$counterSanctionSearchResult,
  );
  const searchCategory = useUnit(searchAppModel.$searchCategory);

  const isSanctions = searchCategory === SearchCategory.sanctions;
  const currentResult = isSanctions
    ? searchResult
    : counterSanctionSearchResult;

  return (
    <Box sx={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <EmptySearch />
      {!isResultEmpty(currentResult) && (
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
          <TableHeader isCounterSanctions={!isSanctions} />
          <TableBody>
            {isSanctions ? (
              <>
                <CategoryRows
                  data={searchResult.code}
                  label="Совпадение по коду"
                  isCounterSanctions={false}
                />
                <CategoryRows
                  data={searchResult.description}
                  label="Совпадение по описанию"
                  isCounterSanctions={false}
                />
                <CategoryRows
                  data={searchResult.codeAddition}
                  label="Возможное дополнение кода"
                  isCounterSanctions={false}
                />
              </>
            ) : (
              <>
                <CategoryRows
                  data={counterSanctionSearchResult.code as any}
                  label="Совпадение по коду"
                  isCounterSanctions={true}
                />
                <CategoryRows
                  data={counterSanctionSearchResult.description as any}
                  label="Совпадение по описанию"
                  isCounterSanctions={true}
                />
                <CategoryRows
                  data={counterSanctionSearchResult.codeAddition as any}
                  label="Возможное дополнение кода"
                  isCounterSanctions={true}
                />
              </>
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
