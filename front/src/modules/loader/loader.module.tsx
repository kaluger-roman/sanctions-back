import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { ErrorContainer } from "./loader.styles";
import { useUnit } from "effector-react";
import { appModel } from "models";

export const Loader = () => {
  const isLoading = useUnit(appModel.$isLoading);
  const loadingProgress = useUnit(appModel.$loadingProgress);

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
