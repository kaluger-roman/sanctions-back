import { useGate, useUnit } from "effector-react";
import { adminModel, appModel } from "models";
import { ManageSanctions } from "./manage-sanctions";
import { Box } from "@mui/material";
import { TarrifManagement } from "./tarrif-management";

export const Admin = () => {
  const authorizationData = useUnit(appModel.$authorizationData);

  useGate(adminModel.AdminGate);

  if (!authorizationData?.isAdmin) return <>You are not authorized as admin</>;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 4 }}>
      <ManageSanctions />
      <TarrifManagement />
    </Box>
  );
};
