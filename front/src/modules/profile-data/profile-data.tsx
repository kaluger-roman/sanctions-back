import {
  Alert,
  Box,
  Chip,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useUnit } from "effector-react";
import { profileModel } from "models";
import { ClientCategory } from "shared/billing";
import EditIcon from "@mui/icons-material/Edit";
import { theme } from "shared/theme";

const DataChip = ({
  label = "",
  value = "",
  placeholder = "Не указано",
  isEditable,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  isEditable?: boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      alignItems: "stretch",
      justifyContent: "center",
      width: "100%",
    }}
  >
    <Chip
      sx={{
        flexBasis: "50%",
        textAlign: "center",
        height: "auto",
        p: "6px",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
      label={label}
    />
    <Chip
      label={value || placeholder}
      variant="outlined"
      sx={{
        flexBasis: "50%",
        color: !value ? theme.palette.grey[500] : theme.palette.text.primary,
        textAlign: "center",
        height: "auto",
        p: "6px",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
    />
    <IconButton
      size="small"
      sx={{ visibility: isEditable ? "visible" : "hidden" }}
    >
      <EditIcon />
    </IconButton>
  </Box>
);

export const ProfileData = () => {
  const profile = useUnit(profileModel.$profile);
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  if (!profile) return null;

  return (
    <Box
      sx={{
        pl: 2,
        pr: 2,
        pt: isSm ? 2 : 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
        Профиль
      </Typography>
      {!profile.isConfirmed && (
        <Alert sx={{ mt: 1, mb: 2 }} severity="warning">
          Почта не подтверждена. Пожалуйста, перейдите по ссылке в письме. До
          подтверждения часть функционала может быть ограниччена.
        </Alert>
      )}
      <DataChip
        label="Категория клиента"
        value={
          profile.category === ClientCategory.private
            ? "Физическое лицо"
            : "Юридическое лицо"
        }
      />
      <DataChip label="Почта" value={profile.email} />

      {profile.category === ClientCategory.company && (
        <>
          <DataChip
            isEditable
            label="Наименование организации"
            value={profile.companyName}
          />
          <DataChip isEditable label="ИНН" value={profile.INN} />
          <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
            Контактное лицо
          </Typography>
        </>
      )}
      <DataChip isEditable label="Фамилия" value={profile.surname} />
      <DataChip isEditable label="Имя" value={profile.name} />
      <DataChip
        isEditable
        label="Отчество"
        value={profile.secondName}
        placeholder="Не указано"
      />
      <DataChip isEditable label="Телефон" value={profile.phone} />
    </Box>
  );
};
