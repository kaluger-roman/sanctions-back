import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useInitNavigation } from "../shared/navigate";

import { Box, Stack } from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { Container, NavigationContainer } from "./app.styles";
import { socket } from "@master_kufa/client-tools";
import { appModel } from "models/app";
import { Paths } from "shared/paths";
import { Footer, Navigation } from "modules";
import {
  Auth,
  Billing,
  Contacts,
  Main,
  Profile,
  Register,
  SearchApp,
} from "pages";
import { CompanyClients } from "pages/clients";
import { useEffect } from "react";
import { ManageSanctions } from "pages/manage-sanctions";
import { RecoverRequest } from "pages/auth/recover-request";
import { RecoverConfirm, RegistrationConfirm } from "pages/auth";

export const AppNavigation = () => {
  useInitNavigation();

  useGate(appModel.AppGate);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Stack sx={Container}>
      <Box sx={NavigationContainer}>
        <Navigation />
        <Routes>
          <Route path="/">
            <Route element={<Navigate replace to={Paths.main} />} index />
            <Route path={Paths.root}>
              <Route index path={Paths.auth} element={<Auth />} />
              <Route path={Paths.register} element={<Register />} />
              <Route
                path={Paths.registrationConfirm}
                element={<RegistrationConfirm />}
              />
              <Route element={<Navigate replace to={Paths.main} />} index />

              <Route path={Paths.main} element={<Main />} />
              <Route
                path={Paths.servicesCompanies}
                element={<CompanyClients isCorporate />}
              />
              <Route path={Paths.billing} element={<Billing />} />
              <Route path={Paths.profile} element={<Profile />} />
              <Route
                path={Paths.recoverPasswordRequest}
                element={<RecoverRequest />}
              />
              <Route
                path={Paths.recoverPasswordConfirm}
                element={<RecoverConfirm />}
              />
              <Route
                path={Paths.servicesPrivate}
                element={<CompanyClients />}
              />
              <Route path={Paths.search_app} element={<SearchApp />} />
              <Route path={Paths.contacts} element={<Contacts />} />
              <Route
                path={Paths.resetSanctionsDatabase}
                element={<ManageSanctions />}
              />
            </Route>
          </Route>
        </Routes>
        {location.pathname !== Paths.contacts && <Footer />}
      </Box>
    </Stack>
  );
};
