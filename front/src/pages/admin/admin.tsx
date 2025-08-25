import { useGate, useUnit } from "effector-react";
import { adminModel, appModel } from "models";
import { ManageSanctions } from "./manage-sanctions";
import { ManageCounterSanctions } from "./manage-counter-sanctions";
import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { TarrifManagement } from "./tarrif-management";
import { CounterSanctionTarrifManagement } from "./counter-sanction-tariff-management";
import { UserTariffsTable } from "./user-tariffs-table";
import { GrantTariffForm } from "./grant-tariff-form";
import { navigation } from "shared/navigate";
import { AdminPaths } from "shared/admin";
import { theme } from "shared/theme";

export const Admin = () => {
  const authorizationData = useUnit(appModel.$authorizationData);
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  useGate(adminModel.AdminGate);

  if (!authorizationData?.isAdmin) return <>You are not authorized as admin</>;

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        margin: 3,
        borderRadius: 4,
        p: 2,
      }}
    >
      <Tabs
        value={window.location?.pathname}
        onChange={(_, value) => navigation.navigate(value)}
        orientation={isSm ? "vertical" : "horizontal"}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
          "& .MuiButtonBase-root": isSm ? { maxWidth: "100%" } : undefined,
          "& .MuiTabs-indicator": isSm ? { left: 0 } : undefined,
        }}
      >
        <Tab label="Пользователи" value={AdminPaths.users} />
        <Tab label="Настройки" value={AdminPaths.preferences} />
        <Tab label="Данные" value={AdminPaths.data} />
      </Tabs>

      {window.location?.pathname === AdminPaths.users && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <GrantTariffForm />
          <UserTariffsTable />
        </Box>
      )}
      {window.location?.pathname === AdminPaths.preferences && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <TarrifManagement />
          <CounterSanctionTarrifManagement />
        </Box>
      )}
      {window.location?.pathname === AdminPaths.data && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ManageSanctions />
          <ManageCounterSanctions />
        </Box>
      )}
    </Box>
  );
};
