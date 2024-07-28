import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { appModel } from "models";
import { recoverPasswordModel } from "models/recover";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";
import { theme } from "shared/theme";

export const RecoverRequest = () => {
  const email = useUnit(recoverPasswordModel.$email);
  const isConfirmApproved = useUnit(recoverPasswordModel.$isConfirmApproved);
  const authorizationData = useUnit(appModel.$authorizationData);

  useGate(recoverPasswordModel.RecoverRequestPageGate);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          p: 2,
          background: theme.palette.secondary.light,
          m: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
          maxWidth: 600,
          minHeight: 300,
          width: "100%",
          mr: "auto",
          ml: "auto",
        }}
      >
        <Typography
          color="primary.main"
          variant="h4"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Восстановление пароля
        </Typography>
        {authorizationData ? (
          <Typography variant="h5" textAlign="center">
            После подтверждения вы получите письмо на{" "}
            <b style={{ color: theme.palette.primary.main }}>
              {authorizationData.email}
            </b>{" "}
            для восстановления пароля
          </Typography>
        ) : (
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => recoverPasswordModel.changeEmail(e.target.value)}
          />
        )}
        <Button
          fullWidth
          disabled={!email && !authorizationData}
          onClick={() => recoverPasswordModel.recoverClicked()}
          variant="contained"
        >
          Восстановить
        </Button>

        <Dialog
          open={Boolean(isConfirmApproved)}
          onClose={() => navigation.navigate(Paths.auth)}
        >
          <DialogTitle>Запрос принят</DialogTitle>
          <DialogContent>
            <DialogContentText>
              На указанный Email отправлено письмо с инструкциями по
              восстановлению
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigation.navigate(Paths.auth)}>
              Вернуться к авторизации
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
