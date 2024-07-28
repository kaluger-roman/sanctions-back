import {
  Typography,
  Box,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useUnit } from "effector-react";
import { profileModel } from "models";
import { DataChip } from "./data-chip";
import { theme } from "shared/theme";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";

export const ChangePassword = () => {
  const isChangePasswordActive = useUnit(profileModel.$isChangePasswordActive);
  const newPassword = useUnit(profileModel.$newPassword);
  const newPasswordRepeat = useUnit(profileModel.$newPasswordRepeat);
  const oldPassword = useUnit(profileModel.$oldPassword);
  const newPasswordError = useUnit(profileModel.$newPasswordError);
  const newPasswordRepeatError = useUnit(profileModel.$newPasswordRepeatError);
  const profile = useUnit(profileModel.$profile);
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  if (!profile) return null;

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
        Учетные данные
      </Typography>
      <DataChip
        label="Последняя смена пароля"
        value={
          profile.lastPasswordChangeTime &&
          new Date(profile.lastPasswordChangeTime).toLocaleDateString()
        }
        isEditSpacePreserve={false}
      />
      <Box sx={{ mt: 2 }}>
        {isChangePasswordActive ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <TextField
                type="password"
                label="Старый пароль"
                variant="outlined"
                fullWidth
                value={oldPassword}
                onChange={(e) => profileModel.changeOldPassword(e.target.value)}
              />
              <TextField
                type="password"
                label="Новый пароль"
                variant="outlined"
                fullWidth
                value={newPassword}
                error={!!newPasswordError}
                helperText={newPasswordError}
                onChange={(e) => profileModel.changeNewPassword(e.target.value)}
              />
              <TextField
                type="password"
                label="Повторите новый пароль"
                variant="outlined"
                fullWidth
                value={newPasswordRepeat}
                error={!!newPasswordRepeatError}
                helperText={newPasswordRepeatError}
                onChange={(e) =>
                  profileModel.changeNewPasswordRepeat(e.target.value)
                }
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                fullWidth={isSm ? true : false}
                sx={{ maxWidth: isSm ? undefined : "190px" }}
                onClick={() => profileModel.saveClicked()}
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth={isSm ? true : false}
                sx={{ maxWidth: isSm ? undefined : "190px" }}
                onClick={() => profileModel.toggleChangePassword()}
              >
                Отмена
              </Button>

              <Button
                variant="text"
                size="small"
                fullWidth={isSm ? true : false}
                sx={{
                  maxWidth: isSm ? undefined : "190px",
                  ml: isSm ? 0 : "auto",
                }}
                onClick={() =>
                  navigation.navigate(Paths.recoverPasswordRequest)
                }
              >
                Забыли пароль?
              </Button>
            </Box>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="large"
            sx={{ maxWidth: isSm ? undefined : "200px" }}
            onClick={() => profileModel.toggleChangePassword()}
            fullWidth={isSm ? true : false}
          >
            Сменить пароль
          </Button>
        )}
      </Box>
    </>
  );
};
