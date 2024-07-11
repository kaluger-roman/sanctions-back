import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { contactUsApi } from "api";
import { useStore, useUnit } from "effector-react";
import { contactUsModel } from "models";
import {
  changeEmail,
  changeMessage,
  changeName,
  changeOrganizationName,
  changePhoneNumber,
  submit,
} from "models/contact-us/contact-us.model";
import { theme } from "shared/theme";

const Input = (props: TextFieldProps & { isMd?: boolean }) => (
  <TextField
    {...props}
    required
    size={props.isMd ? "small" : "medium"}
    sx={{
      minWidth: "300px",
      flexBasis: props.isMd ? "100%" : "calc(50% - 4px)",
      ...props.sx,
    }}
  />
);

export const ContactUs = () => {
  const emailText = useStore(contactUsModel.$email);
  const organizationName = useStore(contactUsModel.$organizationName);
  const name = useStore(contactUsModel.$name);
  const phoneNumber = useStore(contactUsModel.$phoneNumber);
  const message = useStore(contactUsModel.$message);
  const emailError = useStore(contactUsModel.$emailError);
  const phoneError = useStore(contactUsModel.$phoneError);
  const isEmailEmpty = useStore(contactUsModel.isEmailEmpty);
  const isNameEmpty = useStore(contactUsModel.isNameEmpty);
  const isPhoneNumberEmpty = useStore(contactUsModel.isPhoneNumberEmpty);
  const isMessageEmpty = useStore(contactUsModel.isMessageEmpty);
  const pending = useUnit(contactUsApi.submitForm.pending);
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        p: 3,
        position: "relative",
        borderRadius: 4,
        background: alpha(theme.palette.grey[900], 0.8),
        maxWidth: 1200,
        height: "fit-content",
      }}
    >
      <Typography
        sx={{
          mb: 3,
          color: theme.palette.primary.main,
        }}
        variant="h3"
      >
        Свяжитесь с нами
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          background: theme.palette.secondary.light,
          padding: 2,
          borderRadius: 4,
        }}
      >
        <Input
          isMd={isMd}
          type="text"
          required={false}
          label="Наименование организации (для корпоративных клиентов)"
          value={organizationName}
          onChange={({ target }) => changeOrganizationName(target.value)}
        />
        <Input
          isMd={isMd}
          type="text"
          label="ФИО"
          value={name}
          onChange={({ target }) => changeName(target.value)}
        />
        <Input
          isMd={isMd}
          type="text"
          label="Email"
          error={!!emailError}
          helperText={emailError}
          value={emailText}
          onChange={({ target }) => changeEmail(target.value)}
        />
        <Input
          isMd={isMd}
          type="text"
          error={!!phoneError}
          helperText={phoneError}
          label="Номер телефона"
          value={phoneNumber}
          onChange={({ target }) => changePhoneNumber(target.value)}
        />

        <Input
          multiline
          label="Сообщение"
          value={message}
          onChange={({ target }) => changeMessage(target.value)}
          sx={{ width: "100%", maxWidth: "100%", flexBasis: "100%" }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          disabled={
            isEmailEmpty ||
            isNameEmpty ||
            isPhoneNumberEmpty ||
            isMessageEmpty ||
            pending
          }
          sx={{ mt: 2, ":disabled": { background: theme.palette.grey[600] } }}
          size="large"
          variant="contained"
          onClick={() => submit()}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
};
