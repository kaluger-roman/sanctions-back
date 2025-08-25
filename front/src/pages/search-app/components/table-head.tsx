import { TableRow, TableCell, TableHead } from "@mui/material";

export const TableHeader = ({
  isCounterSanctions = false,
}: {
  isCounterSanctions?: boolean;
}) => (
  <TableHead>
    <TableRow>
      <TableCell>Поисковый Тег</TableCell>
      <TableCell>Санкционный код</TableCell>
      <TableCell>Источник ограничения</TableCell>
      <TableCell>Тип ограничений</TableCell>
      {isCounterSanctions && <TableCell>Исключение</TableCell>}
      <TableCell>Описание</TableCell>
    </TableRow>
  </TableHead>
);
