import { TableRow, TableCell, Typography } from "@mui/material";
import { theme } from "shared/theme";
import { CountryRows } from "./country-rows";
import { CategorySearchMath } from "shared/sanctions";
import { isEmpty } from "lodash";

export const CategoryRows = ({
  data,
  label,
  isCounterSanctions = false,
}: {
  data: CategorySearchMath;
  label: string;
  isCounterSanctions?: boolean;
}) => {
  if (isEmpty(data)) return null;

  const colSpan = isCounterSanctions ? 6 : 5;

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={colSpan}
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
      <CountryRows data={data} isCounterSanctions={isCounterSanctions} />
    </>
  );
};
