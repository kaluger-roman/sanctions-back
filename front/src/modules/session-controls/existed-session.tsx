import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { authModel, autoLogoutModel } from "models";

export const ExistedSessionAuth = () => {
  const isSessionAlreadyExistsConfirmShowed = useUnit(
    autoLogoutModel.$isSessionAlreadyExistsConfirmShowed,
  );
  const sessionExistsLimit = useUnit(autoLogoutModel.$sessionExistsLimit);

  return (
    <Modal
      disableAutoFocus
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      open={isSessionAlreadyExistsConfirmShowed}
      onClose={() => autoLogoutModel.sessionAlreadyExistsConfirmShowed(false)}
    >
      <Paper sx={{ width: 400, p: 2 }}>
        <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
          <Typography variant="h5">Авторизация с другого устройства</Typography>
          <Typography variant="body1">
            Превышено количество разрешенных активных сессий (
            {sessionExistsLimit}). При продолжении сессия на другом устройстве
            будет завершена. Вы хотите продолжить?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={() =>
                autoLogoutModel.sessionAlreadyExistsConfirmShowed(false)
              }
              variant="contained"
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                autoLogoutModel.sessionAlreadyExistsConfirmShowed(false);
                authModel.authClicked({ forceLogin: true });
              }}
              variant="outlined"
            >
              Войти
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};
