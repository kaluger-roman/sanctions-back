import { BrowserRouter } from "react-router-dom";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { AppNavigation } from "./app.navigation";
import { ThemeProvider } from "@emotion/react";
import { theme } from "shared/theme";
import { CssBaseline } from "@mui/material";
import { AutoLogout, Loader, PermanentNotifications } from "modules";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*  not move notifications to browser router, effector store initialize incorrectly, should be at top */}
      <Notification.Component />
      <Confirm.Component />

      <Loader />
      <BrowserRouter>
        <AppNavigation />
      </BrowserRouter>
      <PermanentNotifications />
      <AutoLogout />
    </ThemeProvider>
  );
};
