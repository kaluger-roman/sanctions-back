import { Box, Button, TextField, Typography } from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { recoverPasswordModel } from "models/recover";
import { useParams } from "react-router-dom";
import { theme } from "shared/theme";

export const RecoverConfirm = () => {
  const token = useParams<{ token: string }>().token;
  const newPassword = useUnit(recoverPasswordModel.$newPassword);
  const newPasswordError = useUnit(recoverPasswordModel.$newPasswordError);
  const confirmPasswordError = useUnit(
    recoverPasswordModel.$confirmPasswordError,
  );
  const confirmPassword = useUnit(recoverPasswordModel.$confirmPassword);

  useGate(recoverPasswordModel.RecoverConfirmPageGate, token);

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
        <TextField
          fullWidth
          label="Новый пароль"
          value={newPassword}
          type="password"
          onChange={(e) =>
            recoverPasswordModel.changeNewPassword(e.target.value)
          }
          error={Boolean(newPasswordError)}
          helperText={newPasswordError || " "}
        />
        <TextField
          fullWidth
          type="password"
          label="Повторите новый пароль"
          value={confirmPassword}
          onChange={(e) =>
            recoverPasswordModel.changeConfirmPassword(e.target.value)
          }
          error={Boolean(confirmPasswordError)}
          helperText={confirmPasswordError || " "}
        />
        <Button
          fullWidth
          onClick={() => recoverPasswordModel.recoverConfirmClicked()}
          variant="contained"
        >
          Сменить пароль
        </Button>
      </Box>
    </Box>
  );
};
