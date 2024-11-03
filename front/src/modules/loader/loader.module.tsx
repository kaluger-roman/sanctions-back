import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { ErrorContainer } from "./loader.styles";
import { useUnit } from "effector-react";
import { appModel, billingModel, profileModel, searchAppModel } from "models";
import { recoverPasswordModel } from "models/recover";
import { registerConfirmModel } from "models/register";

export const Loader = () => {
  const isLoading = useUnit(appModel.$isLoading);
  const loadingProgress = useUnit(appModel.$loadingProgress);
  const searchAppPageOpened = useUnit(searchAppModel.SearchAppGate.status);
  const recoverPasswordOpened = useUnit(
    recoverPasswordModel.RecoverRequestPageGate.status,
  );
  const isBillingOpened = useUnit(billingModel.BillingGate.status);
  const registerConfirmOpened = useUnit(
    registerConfirmModel.RegisterConfirmPageGate.status,
  );
  const profileOpened = useUnit(profileModel.ProfileGate.status);

  if (
    !searchAppPageOpened &&
    !recoverPasswordOpened &&
    !registerConfirmOpened &&
    !isBillingOpened &&
    !profileOpened
  )
    return null;

  return (
    <Backdrop sx={ErrorContainer} open={isLoading}>
      <CircularProgress />
      {Boolean(loadingProgress) && (
        <Typography color={"primary.light"} align="center">
          {Math.round(loadingProgress * 100)}%
          <br />
        </Typography>
      )}
    </Backdrop>
  );
};
