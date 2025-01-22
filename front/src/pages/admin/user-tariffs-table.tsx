import React, { useState } from "react";
import { useUnit } from "effector-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { grantTarrifModel } from "models";
import { theme } from "shared/theme";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CategoryNames,
  TarrifCategories,
  TarrifNames,
} from "pages/billing/constants";
import { TarrifKind } from "shared/billing";

export const UserTariffsTable = () => {
  const userTariffs = useUnit(grantTarrifModel.$userTariffs);
  const [deletePrompt, setDeletePrompt] = useState<number | null>(null);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Тарифы пользователей</Typography>
      <Typography
        variant="caption"
        sx={{ mb: 2, color: theme.palette.grey[600] }}
      >
        Отображены неистекшие тарифы
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell>Тариф</TableCell>
            <TableCell>Дата начала</TableCell>
            <TableCell>Дата окончания</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {userTariffs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="caption">
                    Нет активных тарифов
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
          {userTariffs.map((user) => (
            <React.Fragment key={user.user.email}>
              {user.tariffs.map((tariff, index) => (
                <TableRow key={index}>
                  {index === 0 && (
                    <TableCell rowSpan={user.tariffs.length}>
                      {user.user.email} ({CategoryNames[user.user.category]})
                    </TableCell>
                  )}
                  <TableCell>
                    {TarrifNames[tariff.tarrif.identifier]}
                    {` - ${
                      CategoryNames[
                        TarrifCategories[
                          tariff.tarrif.identifier
                        ] as keyof typeof CategoryNames
                      ] || "Все"
                    }`}
                  </TableCell>
                  <TableCell>
                    {tariff.start
                      ? new Date(tariff.start).toLocaleDateString("ru-RU", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          timeZoneName: "short",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {tariff.end
                      ? new Date(tariff.end).toLocaleDateString("ru-RU", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          timeZoneName: "short",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {index === user.tariffs.length - 1 &&
                    tariff.tarrif.identifier !== TarrifKind.free ? (
                      <IconButton onClick={() => setDeletePrompt(tariff.id)}>
                        <DeleteIcon />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={deletePrompt !== null}
        onClose={() => setDeletePrompt(null)}
      >
        <DialogTitle>Подтверждение удаления тарифа</DialogTitle>

        <DialogActions>
          <Button onClick={() => setDeletePrompt(null)}>Отмена</Button>
          <Button
            onClick={() => {
              grantTarrifModel.deleteUserTariff(deletePrompt!);
              setDeletePrompt(null);
            }}
            autoFocus
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
