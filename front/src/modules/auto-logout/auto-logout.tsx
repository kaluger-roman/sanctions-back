import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { appModel, autoLogoutModel } from "models";

export const AutoLogout = () => {
  const isAutoLogoutConfirmShowed = useUnit(
    autoLogoutModel.$isAutoLogoutConfirmShowed,
  );
  const logoutConfirmLeftTime = useUnit(autoLogoutModel.$logoutConfirmLeftTime);
  const authorizationData = useUnit(appModel.$authorizationData);

  return (
    <Modal
      disableAutoFocus
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      open={isAutoLogoutConfirmShowed}
      onClose={() => autoLogoutModel.autoLogoutConfirmShowed(false)}
    >
      <Paper sx={{ width: 400, p: 2 }}>
        {authorizationData ? (
          <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
            <Typography variant="h5">Выход</Typography>
            <Typography variant="body1">
              Вы слишком долго бездействовали (1 час), выход из аккаунта будет
              осуществлен автоматически через {logoutConfirmLeftTime} секунд.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                onClick={() => autoLogoutModel.autoLogoutConfirmShowed(false)}
                variant="contained"
              >
                Остаться
              </Button>
              <Button
                onClick={() => {
                  autoLogoutModel.autoLogoutConfirmShowed(false);
                  appModel.LogOut();
                }}
                variant="outlined"
              >
                Выйти
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
            <Typography variant="h5">Выход</Typography>
            <Typography variant="body1">
              Ваша сессия была завершена из-за длительного бездействия, войдите
              в аккаунт повторно
            </Typography>
            <Button
              onClick={() => autoLogoutModel.autoLogoutConfirmShowed(false)}
              variant="contained"
            >
              Хорошо
            </Button>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};
