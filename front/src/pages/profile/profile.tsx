import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { profileModel } from "models";
import { ProfileData } from "modules";
import { theme } from "shared/theme";

export const Profile = () => {
  const tab = useUnit(profileModel.$tab);
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

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
        value={tab}
        onChange={(_, value) => profileModel.changeTab(value)}
        sx={{
          borderRight: isSm ? 0 : 1,
          borderBottom: isSm ? 1 : 0,
          borderColor: "divider",
        }}
      >
        <Tab label="Профиль" value="profile" />
        <Tab label="Тариф" value="tarrif" />
        <Tab label="Учетные данные" value="credentials" />
      </Tabs>

      {tab === "profile" && <ProfileData />}
    </Box>
  );
};
