import { Box } from "@mui/material";
import { CoockieNotice } from "./cookie-notice";
import { BillingNotice } from "./billing-notice";
import { BillingExpiredNotice } from "./billing-expired-notice";

export const PermanentNotifications = () => (
  <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        position: "fixed",
        left: 0,
        bottom: 0,
      }}
    >
      <BillingExpiredNotice />
      <BillingNotice />
      <CoockieNotice />
    </Box>
  </>
);
