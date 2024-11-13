import { TableRow, TableCell, Link } from "@mui/material";
import { Sanction } from "shared/sanctions";
import { theme } from "shared/theme";

export const DataRow = ({
  code,
  sourceDocument,
  restriction,
  description,
  isLast,
}: Sanction & { isLast: boolean }) => (
  <TableRow
    sx={{
      borderBottomColor: isLast
        ? "inherit"
        : `${theme.palette.grey[300]} !important`,
    }}
  >
    <TableCell sx={{ verticalAlign: "top" }}>{code}</TableCell>
    <TableCell sx={{ verticalAlign: "top" }}>
      <Link href="#">{sourceDocument}</Link>
    </TableCell>
    <TableCell sx={{ verticalAlign: "top" }}>{restriction}</TableCell>
    <TableCell sx={{ verticalAlign: "top" }}>{description}</TableCell>
  </TableRow>
);
