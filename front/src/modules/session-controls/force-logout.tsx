import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { autoLogoutModel } from "models";
import { FORCE_LOGOUT_REASON } from "models/auth/types";

export const ForceLogout = () => {
  const isForceLogoutConfirmShowed = useUnit(
    autoLogoutModel.$isForceLogoutConfirmShowed,
  );
  const sessionExistsLimit = useUnit(autoLogoutModel.$sessionExistsLimit);

  return (
    <Modal
      disableAutoFocus
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      open={!!isForceLogoutConfirmShowed}
      onClose={() => autoLogoutModel.sessionAlreadyExistsConfirmShowed(false)}
    >
      <Paper sx={{ width: 400, p: 2 }}>
        <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
          <Typography variant="h5">
            {isForceLogoutConfirmShowed === FORCE_LOGOUT_REASON.NEW_SESSION &&
              "Вход с другого устройства"}
            {isForceLogoutConfirmShowed === FORCE_LOGOUT_REASON.INACTIVITY &&
              "Сессия завершена"}
          </Typography>
          <Typography variant="body1">
            {isForceLogoutConfirmShowed === FORCE_LOGOUT_REASON.NEW_SESSION &&
              `Был осуществлен вход с другого устройства. Превышено количество разрешенных активных сессий (${sessionExistsLimit}). Ваша сессия завершена.`}
            {isForceLogoutConfirmShowed === FORCE_LOGOUT_REASON.INACTIVITY &&
              "Ваша сессия была завершена из-за длительного бездействия, войдите в аккаунт повторно"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={() => autoLogoutModel.forceLogoutShowed(null)}
              variant="outlined"
            >
              Хорошо
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};
