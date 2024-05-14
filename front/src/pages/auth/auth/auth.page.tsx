import { useGate, useUnit } from "effector-react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { PasswordStyles } from "./auth.styles";
import { authModel } from "../../../models";
import { AuthContainer, FormContainer, FormFields } from "../styles";
import { navigation } from "../../../shared/navigate";
import { Paths } from "../../../shared/paths";

export const Auth = () => {
  const emailText = useUnit(authModel.$emailText);
  const passwordText = useUnit(authModel.$passwordText);
  const isEmptyFields = useUnit(authModel.$isEmptyFields);
  const authPending = useUnit(authModel.$authPending);

  const actions = {
    authClicked: useUnit(authModel.authClicked),
    emailTextChanged: useUnit(authModel.emailTextChanged),
    passwordTextChanged: useUnit(authModel.passwordTextChanged),
  };

  useGate(authModel.PageGate);

  return (
    <Box sx={AuthContainer}>
      <Paper sx={FormContainer}>
        <Typography variant="h4">Авторизация</Typography>
        <Stack sx={FormFields}>
          <TextField
            type="text"
            label="Почта"
            value={emailText}
            onChange={({ target }) => actions.emailTextChanged(target.value)}
          />
          <TextField
            type="text"
            InputProps={{ sx: PasswordStyles }}
            label="Пароль"
            value={passwordText}
            onChange={({ target }) => actions.passwordTextChanged(target.value)}
          />
          <Button
            endIcon={authPending && <HourglassTopIcon />}
            disabled={isEmptyFields}
            variant="outlined"
            onClick={actions.authClicked}
          >
            Вход
          </Button>
          <Chip
            clickable
            onClick={() => navigation.navigate(Paths.register)}
            label="Регистрация"
          />
        </Stack>
      </Paper>
    </Box>
  );
};
