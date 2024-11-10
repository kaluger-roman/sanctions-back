import { TableRow, TableCell, Typography } from "@mui/material";
import { theme } from "shared/theme";
import { CountryRows } from "./country-rows";
import { CategorySearchMath } from "shared/sanctions";
import { isEmpty } from "lodash";

export const CategoryRows = ({
  data,
  label,
}: {
  data: CategorySearchMath;
  label: string;
}) => {
  if (isEmpty(data)) return null;

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={5}
          sx={{
            background: theme.palette.grey[200],
            verticalAlign: "top",
          }}
        >
          <Typography textAlign="center" variant="h6" fontWeight="bold">
            {label}
          </Typography>
        </TableCell>
      </TableRow>
      <CountryRows data={data} />
    </>
  );
};
