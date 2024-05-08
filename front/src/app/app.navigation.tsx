import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useInitNavigation } from "../shared/navigate";

import { Box, Stack } from "@mui/material";
import { useGate, useUnit } from "effector-react";
import { Container, NavigationContainer } from "./app.styles";
import { socket } from "@master_kufa/client-tools";
import { appModel } from "models/app";
import { Paths } from "shared/paths";
import { Footer, Navigation } from "modules";
import { Contacts, Main, SearchApp } from "pages";
import { CompanyClients } from "pages/clients";
import { useEffect } from "react";
import { ManageSanctions } from "pages/manage-sanctions";
import { blockedSocketLoaderPages } from "./app.constants";

export const AppNavigation = () => {
  useInitNavigation();
  useGate(appModel.AppGate);
  const location = useLocation();
  const isConnected = useUnit(socket.$isConnected);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (
    !isConnected &&
    blockedSocketLoaderPages.some((x) => location.pathname.startsWith(x))
  )
    return null;

  return (
    <Stack sx={Container}>
      <Box sx={NavigationContainer}>
        <Navigation />
        <Routes>
          <Route path="/">
            <Route element={<Navigate replace to={Paths.main} />} index />
            <Route path={Paths.root}>
              <Route element={<Navigate replace to={Paths.main} />} index />

              <Route path={Paths.main} element={<Main />} />
              <Route
                path={Paths.servicesCompanies}
                element={<CompanyClients isCorporate />}
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
