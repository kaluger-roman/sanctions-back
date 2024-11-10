import { TableRow, TableCell, Link } from "@mui/material";
import { Sanction } from "shared/sanctions";

export const DataRow = ({
  code,
  sourceDocument,
  restriction,
  description,
}: Sanction) => (
  <TableRow>
    <TableCell sx={{ verticalAlign: "top" }}>{code}</TableCell>
    <TableCell sx={{ verticalAlign: "top" }}>
      <Link href="#">{sourceDocument}</Link>
    </TableCell>
    <TableCell sx={{ verticalAlign: "top" }}>{restriction}</TableCell>
    <TableCell sx={{ verticalAlign: "top" }}>{description}</TableCell>
  </TableRow>
);
