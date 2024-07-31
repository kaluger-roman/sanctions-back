import { Alert, Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useUnit } from "effector-react";
import { profileModel } from "models";
import { ClientCategory } from "shared/billing";
import { theme } from "shared/theme";
import { DataChip } from "./data-chip";
import { ChangePassword } from "./change-password";
import { isEqual } from "lodash";
import { required, validateINN, validatePhone } from "shared/auth.helpers";

export const ProfileData = () => {
  const profile = useUnit(profileModel.$profile);
  const initialProfile = useUnit(profileModel.$initialProfile);
  const editErrorKeys = useUnit(profileModel.$editErrorKeys);

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
      {profile.isConfirmed ? (
        <Alert sx={{ mt: 1, mb: 2 }} severity="success">
          Почта подтверждена.
        </Alert>
      ) : (
        <Alert sx={{ mt: 1, mb: 2 }} severity="warning">
          Почта не подтверждена. Пожалуйста, перейдите по ссылке в письме. До
          подтверждения часть функционала может быть ограниччена.
        </Alert>
      )}
      <DataChip
        id="category"
        label="Категория клиента"
        value={
          profile.category === ClientCategory.private
            ? "Физическое лицо"
            : "Юридическое лицо"
        }
      />
      <DataChip id="email" label="Почта" value={profile.email} />

      {profile.category === ClientCategory.company && (
        <>
          <DataChip
            id="companyName"
            isEditable
            label="Наименование организации"
            value={profile.companyName}
            validate={required}
            onChange={(value) =>
              profileModel.changeProfileField({ field: "companyName", value })
            }
          />
          <DataChip
            id="INN"
            isEditable
            label="ИНН"
            value={profile.INN}
            validate={validateINN}
            onChange={(value) =>
              profileModel.changeProfileField({ field: "INN", value })
            }
          />
          <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
            Контактное лицо
          </Typography>
        </>
      )}
      <DataChip
        id="surname"
        isEditable
        validate={required}
        label="Фамилия"
        value={profile.surname}
        onChange={(value) =>
          profileModel.changeProfileField({ field: "surname", value })
        }
      />
      <DataChip
        id="name"
        onChange={(value) =>
          profileModel.changeProfileField({ field: "name", value })
        }
        isEditable
        validate={required}
        label="Имя"
        value={profile.name}
      />
      <DataChip
        id="secondName"
        isEditable
        onChange={(value) =>
          profileModel.changeProfileField({ field: "secondName", value })
        }
        validate={required}
        label="Отчество"
        value={profile.secondName}
        placeholder="Не указано"
      />
      <DataChip
        id="phone"
        onChange={(value) =>
          profileModel.changeProfileField({ field: "phone", value })
        }
        validate={validatePhone}
        isEditable
        label="Телефон"
        value={profile.phone}
      />
      <Button
        disabled={isEqual(profile, initialProfile) || !!editErrorKeys.length}
        sx={{ maxWidth: isSm ? undefined : "200px", mt: 2 }}
        fullWidth={isSm ? true : false}
        variant="contained"
        onClick={() => profileModel.saveProfileClicked()}
      >
        Сохранить
      </Button>
      <ChangePassword />
    </Box>
  );
};
