import { TableRow, TableCell, Typography } from "@mui/material";
import { keys } from "lodash";
import React from "react";
import { theme } from "shared/theme";
import { TagRows } from "./tag-rows";
import { CategorySearchMath } from "shared/sanctions";
import { useUnit } from "effector-react";
import { searchAppModel } from "models";

export const CountryRows = ({ data }: { data: CategorySearchMath }) => {
  const countries = useUnit(searchAppModel.$countries);

  return (
    <>
      {keys(data).map((country) => (
        <React.Fragment key={country}>
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                background: theme.palette.grey[100],
                verticalAlign: "top",
              }}
            >
              <Typography textAlign="center" variant="body1" fontWeight="bold">
                {countries.find((item) => country === item)}
              </Typography>
            </TableCell>
          </TableRow>
          <TagRows data={data[country]} />
        </React.Fragment>
      ))}
    </>
  );
};
