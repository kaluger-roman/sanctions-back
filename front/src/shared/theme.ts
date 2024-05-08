import { createTheme } from "@mui/material";
import Jost from "./fonts/Jost.ttf";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#604fff",
      light: "#e6a6ff",
      dark: "#330e41",
    },
    secondary: {
      main: "#e5c0f4",
      light: "#f1dbfa",
      dark: "#293761",
    },
  },
  typography: {
    fontFamily: "Jost",
    fontSize: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Jost';
          src: local('Jost'), local('Jost.ttf'), url(${Jost}) format('truetype');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
      `,
    },
  },
});
