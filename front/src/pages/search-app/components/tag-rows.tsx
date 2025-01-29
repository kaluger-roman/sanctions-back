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

        {data[tag].map((item, inx) =>
          ["uplimit_code_addition", "uplimit_description"].includes(
            item.id as any,
          ) ? (
            <TableCell colSpan={4} sx={{ color: theme.palette.grey[500] }}>
              {item.id === "uplimit_code_addition"
                ? "Возможных дополнений более 10 (показаны первые 10), конкретизируйте ваш код ТНВЭД"
                : item.id === "uplimit_description"
                ? "Совпадений по описанию более 75 (показаны первые 75), конкретизируйте поисковый запрос"
                : ""}
            </TableCell>
          ) : (
            <DataRow
              key={tag + item.id}
              {...item}
              isLast={inx === data[tag].length - 1}
            />
          ),
        )}
      </React.Fragment>
    ))}
  </>
);
