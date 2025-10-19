import { TableRow, TableCell, TableHead, Tooltip, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
      {isCounterSanctions && (
        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Исключение
            <Tooltip
              title={
                "По части товаров могут присутствовать не все исключения. Полный список исключений необходимо смотреть в первоисточнике"
              }
            >
              <InfoOutlinedIcon
                fontSize="small"
                color="action"
                aria-label="информация об исключениях"
              />
            </Tooltip>
          </Box>
        </TableCell>
      )}
      <TableCell>Описание</TableCell>
    </TableRow>
  </TableHead>
);
