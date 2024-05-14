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
import { registerModel } from "../../../models/register";
import { AuthContainer, FormContainer, FormFields } from "../styles";
import { navigation } from "../../../shared/navigate";
import { Paths } from "../../../shared/paths";

export const Register = () => {
  const emailText = useUnit(registerModel.$emailText);
  const passwordText = useUnit(registerModel.$passwordText);
  const passwordConfirmText = useUnit(registerModel.$passwordConfirmText);
  const registerPending = useUnit(registerModel.$registerPending);
  const emailTextError = useUnit(registerModel.$emailTextError);
  const passwordTextError = useUnit(registerModel.$passwordTextError);
  const passwordConfirmTextError = useUnit(
    registerModel.$passwordConfirmTextError,
  );

  const actions = {
    registerClicked: useUnit(registerModel.registerClicked),
    emailTextChanged: useUnit(registerModel.emailTextChanged),
    passwordTextChanged: useUnit(registerModel.passwordTextChanged),
    passwordConfirmTextChanged: useUnit(
      registerModel.passwordConfirmTextChanged,
    ),
  };

  useGate(registerModel.PageGate);

  return (
    <Box sx={AuthContainer}>
      <Paper sx={FormContainer}>
        <Typography variant="h4">Регистрация</Typography>
        <Stack sx={FormFields}>
          <TextField
            name="email"
            label="Логин"
            value={emailText}
            onChange={({ target }) => actions.emailTextChanged(target.value)}
            error={Boolean(emailTextError)}
            helperText={emailTextError}
          />
          <TextField
            name="password"
            type="password"
            label="Пароль"
            value={passwordText}
            onChange={({ target }) => actions.passwordTextChanged(target.value)}
            error={Boolean(passwordTextError)}
            helperText={passwordTextError}
          />
          <TextField
            name="passwordX2"
            type="password"
            label="Повторите пароль"
            value={passwordConfirmText}
            onChange={({ target }) =>
              actions.passwordConfirmTextChanged(target.value)
            }
            error={Boolean(passwordConfirmTextError)}
            helperText={passwordConfirmTextError}
          />
          <Button
            endIcon={registerPending && <HourglassTopIcon />}
            variant="outlined"
            onClick={actions.registerClicked}
          >
            Зарегистрироваться
          </Button>
          <Chip
            clickable
            onClick={() => navigation.navigate(Paths.auth)}
            label="Авторизация"
          />
        </Stack>
      </Paper>
    </Box>
  );
};
