import { useGate, useUnit } from "effector-react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { registerModel } from "../../../models/register";
import { AuthContainer, FormContainer, FormFields } from "../styles";
import { navigation } from "../../../shared/navigate";
import { Paths } from "../../../shared/paths";
import { ClientCategory } from "shared/billing";

export const Register = () => {
  const clientCategory = useUnit(registerModel.$clientCategory);
  const emailText = useUnit(registerModel.$emailText);
  const passwordText = useUnit(registerModel.$passwordText);
  const passwordConfirmText = useUnit(registerModel.$passwordConfirmText);
  const registerPending = useUnit(registerModel.$registerPending);
  const emailTextError = useUnit(registerModel.$emailTextError);
  const passwordTextError = useUnit(registerModel.$passwordTextError);
  const passwordConfirmTextError = useUnit(
    registerModel.$passwordConfirmTextError,
  );
  const name = useUnit(registerModel.$name);
  const surname = useUnit(registerModel.$surname);
  const secondName = useUnit(registerModel.$secondName);
  const phone = useUnit(registerModel.$phone);
  const companyName = useUnit(registerModel.$companyName);
  const INN = useUnit(registerModel.$INN);
  const INNError = useUnit(registerModel.$INNError);
  const companyNameError = useUnit(registerModel.$companyNameError);
  const phoneError = useUnit(registerModel.$phoneError);
  const nameError = useUnit(registerModel.$nameError);
  const surnameError = useUnit(registerModel.$surnameError);
  const isRegisterStarted = useUnit(registerModel.$isRegisterStarted);

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
          <ToggleButtonGroup
            sx={{ mb: 2 }}
            color="primary"
            fullWidth
            value={clientCategory}
            exclusive
            onChange={(_, value) =>
              value && registerModel.changeclientCategory(value)
            }
          >
            <ToggleButton value={ClientCategory.private}>
              Физическое лицо
            </ToggleButton>
            <ToggleButton value={ClientCategory.company}>
              Юридическое лицо
            </ToggleButton>
          </ToggleButtonGroup>
          {clientCategory === ClientCategory.company && (
            <>
              <TextField
                name="companyName"
                required
                label="Наименование организации"
                value={companyName}
                error={Boolean(companyNameError)}
                helperText={companyNameError}
                onChange={({ target }) =>
                  registerModel.changeCompanyName(target.value)
                }
              />
              <TextField
                required
                name="INN"
                label="ИНН"
                value={INN}
                error={Boolean(INNError)}
                helperText={INNError}
                onChange={({ target }) => registerModel.changeINN(target.value)}
              />
              <Typography sx={{ mt: 2 }} variant="h6">
                Контактное лицо
              </Typography>
            </>
          )}
          <TextField
            required
            name="surname"
            error={Boolean(surnameError)}
            helperText={surnameError}
            label="Фамилия"
            value={surname}
            onChange={({ target }) => registerModel.changeSurname(target.value)}
          />
          <TextField
            required
            name="name"
            error={Boolean(nameError)}
            helperText={nameError}
            label="Имя"
            value={name}
            onChange={({ target }) => registerModel.changeName(target.value)}
          />
          <TextField
            name="secondName"
            label="Отчество"
            value={secondName}
            onChange={({ target }) =>
              registerModel.changeSecondName(target.value)
            }
          />
          <TextField
            required
            name="phone"
            label="Номер телефона"
            error={Boolean(phoneError)}
            helperText={phoneError}
            value={phone}
            onChange={({ target }) => registerModel.changePhone(target.value)}
          />
          <TextField
            required
            sx={{ mt: 2 }}
            name="email"
            label="Email"
            value={emailText}
            onChange={({ target }) => actions.emailTextChanged(target.value)}
            error={Boolean(emailTextError)}
            helperText={emailTextError}
          />
          <TextField
            required
            name="password"
            type="password"
            label="Пароль"
            value={passwordText}
            onChange={({ target }) => actions.passwordTextChanged(target.value)}
            error={Boolean(passwordTextError)}
            helperText={passwordTextError}
          />
          <TextField
            required
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
            sx={{ mt: 2 }}
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
      <Dialog
        open={isRegisterStarted}
        onClose={() => navigation.navigate(Paths.auth)}
      >
        <DialogTitle>Пользователь создан</DialogTitle>
        <DialogContent>
          <DialogContentText>
            На указанный Email отправлено письмо для подтверждения регистрации
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigation.navigate(Paths.auth)}>
            Вернуться к авторизации
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
