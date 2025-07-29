import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { profileModel, appModel } from "models";
import { ProfileData, Tarrif, MyReports } from "modules";
import { navigation } from "shared/navigate";
import { Paths } from "shared/paths";
import { theme } from "shared/theme";

export const Profile = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("md"));
  const authorizationData = useUnit(appModel.$authorizationData);

  useGate(profileModel.ProfileGate);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: isSm ? "block" : "flex",
        margin: 3,
        borderRadius: 4,
        pt: 2,
        pb: 2,
      }}
    >
      <Tabs
        orientation={isSm ? "horizontal" : "vertical"}
        variant="scrollable"
        value={window.location?.pathname}
        onChange={(_, value) => navigation.navigate(value)}
        sx={{
          borderRight: isSm ? 0 : 1,
          borderBottom: isSm ? 1 : 0,
          borderColor: "divider",
          minWidth: isSm ? undefined : 125,
          width: isSm ? undefined : 125,
        }}
      >
        <Tab label="Профиль" value={Paths.profileMy} />
        <Tab label="Тариф" value={Paths.profileTariff} />
        <Tab label="Мои отчеты" value={Paths.profileReports} />
      </Tabs>

      {window.location?.pathname === Paths.profileMy && <ProfileData />}
      {window.location?.pathname === Paths.profileTariff && <Tarrif />}
      {window.location?.pathname === Paths.profileReports &&
        authorizationData?.isAdmin && <MyReports />}
    </Box>
  );
};
