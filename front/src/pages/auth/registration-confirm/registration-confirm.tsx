import { Box, Button, Typography } from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { registerConfirmModel } from "models/register";
import { useParams } from "react-router-dom";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";
import { theme } from "shared/theme";

export const RegistrationConfirm = () => {
  const token = useParams<{ token: string }>().token;

  const isSuccess = useUnit(registerConfirmModel.$isSuccess);
  const pending = useUnit(registerConfirmModel.$pending);

  useGate(registerConfirmModel.RegisterConfirmPageGate, token);

  if (pending) return null;

  return (
    <Box
      sx={{
        borderRadius: 4,
        p: 2,
        background: theme.palette.secondary.light,
        m: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 4,
        maxWidth: 600,
        minHeight: 300,
        width: "100%",
        mr: "auto",
        ml: "auto",
      }}
    >
      <Typography textAlign="center" variant="h4">
        {isSuccess ? "Учетная запись подтверждена!!!" : "Ошибка!"}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigation.navigate(Paths.auth)}
      >
        К авторизации
      </Button>
    </Box>
  );
};
