import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { isEmpty, keys } from "lodash";
import { searchAppModel } from "models";
import React from "react";
import { theme } from "shared/theme";

export const SearchTable = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);
  const isSearchHappened = useUnit(searchAppModel.$isSearchHappened);
  const countries = useUnit(searchAppModel.$countries);

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "scroll" }}>
      {isSearchHappened && isEmpty(searchResult) && (
        <Typography variant="body1">Поиск не дал результатов</Typography>
      )}

      {!isEmpty(searchResult) && (
        <Table
          component={Paper}
          sx={{
            "& th": {
              fontWeight: "bold",
              fontSize: "18px",
              background: theme.palette.grey[300],
              overflow: "scroll",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Поисковый Тег</TableCell>
              <TableCell>Санкционный код</TableCell>
              <TableCell>Источник ограничения</TableCell>
              <TableCell>Тип ограничений</TableCell>
              <TableCell>Описание</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys(searchResult).map((country) => (
              <React.Fragment key={country}>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      background: theme.palette.grey[200],
                      verticalAlign: "top",
                    }}
                  >
                    <Typography
                      textAlign="center"
                      variant="h6"
                      fontWeight="bold"
                    >
                      {countries.find((item) => country === item)}
                    </Typography>
                  </TableCell>
                </TableRow>
                {keys(searchResult[country]).map((tag) => (
                  <React.Fragment key={tag}>
                    <TableRow>
                      <TableCell
                        rowSpan={searchResult[country][tag].length + 1}
                        sx={{
                          background: theme.palette.grey[100],
                          verticalAlign: "top",
                          fontWeight: "bold",
                        }}
                      >
                        {tag}
                      </TableCell>
                    </TableRow>

                    {searchResult[country][tag].map((item) => (
                      <TableRow key={tag + country + item.id}>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          {item.code}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <Link href="#">{item.sourceDocument}</Link>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          {item.restriction}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          {item.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
