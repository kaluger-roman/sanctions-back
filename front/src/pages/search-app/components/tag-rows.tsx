import { TableRow, TableCell } from "@mui/material";
import { keys } from "lodash";
import React from "react";
import { theme } from "shared/theme";
import { DataRow } from "./data-row";
import { CountrySearchMatch } from "shared/sanctions";

export const TagRows = ({ data }: { data: CountrySearchMatch }) => (
  <>
    {keys(data).map((tag) => (
      <React.Fragment key={tag}>
        <TableRow>
          <TableCell
            rowSpan={data[tag].length + 1}
            sx={{
              background: theme.palette.grey[50],
              verticalAlign: "top",
              fontWeight: "bold",
            }}
          >
            {tag}
          </TableCell>
        </TableRow>

        {data[tag].map((item) =>
          item.id === "uplimit" ? (
            <TableCell colSpan={4} sx={{ color: theme.palette.grey[500] }}>
              Возможных дополнений более 10, конкретизируйте ваш код ТНВЭД
            </TableCell>
          ) : (
            <DataRow key={tag + item.id} {...item} />
          ),
        )}
      </React.Fragment>
    ))}
  </>
);
