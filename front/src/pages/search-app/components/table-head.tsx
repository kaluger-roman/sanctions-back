import { TableRow, TableCell, TableHead } from "@mui/material";

export const TableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell>Поисковый Тег</TableCell>
      <TableCell>Санкционный код</TableCell>
      <TableCell>Источник ограничения</TableCell>
      <TableCell>Тип ограничений</TableCell>
      <TableCell>Описание</TableCell>
    </TableRow>
  </TableHead>
);
