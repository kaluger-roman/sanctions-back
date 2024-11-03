import { Box, Typography, Button, Alert, useMediaQuery } from "@mui/material";
import { useUnit } from "effector-react";
import { billingModel } from "models";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";
import { AlertStyles } from "./styles";
import { theme } from "shared/theme";

export const BillingExpiredNotice = () => {
  const isTarrifSoonExpireNotification = useUnit(
    billingModel.$isTarrifSoonExpireNotification,
  );

  const isSm = useMediaQuery(theme.breakpoints.down(580));

  if (!isTarrifSoonExpireNotification) return null;

  return (
    <Alert severity="success" sx={AlertStyles}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isSm ? 1 : 4,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">Ваш тариф скоро истечет!</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isSm ? 1 : 2,

            flexBasis: isSm ? "115px" : undefined,
          }}
        >
          <Button
            variant="contained"
            sx={{ width: 115 }}
            size={isSm ? "small" : undefined}
            onClick={() => {
              billingModel.tarrifSoonExpiredNoticeChanged(false);
              navigation.navigate(Paths.profileTariff);
            }}
          >
            <Typography variant="body1">Просмотр</Typography>
          </Button>
          <Button
            sx={{ width: 115 }}
            size={isSm ? "small" : undefined}
            variant="outlined"
            onClick={() => {
              billingModel.tarrifSoonExpiredNoticeChanged(false);
            }}
          >
            <Typography variant="body1">Закрыть</Typography>
          </Button>
        </Box>
      </Box>
    </Alert>
  );
};
