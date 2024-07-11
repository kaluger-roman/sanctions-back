import { SxProps } from "@mui/material";
import { theme } from "shared/theme";

export const NavigationContainer = ({ isMd }: { isMd: boolean }): SxProps => ({
  width: "100vw",
  height: "60px",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  gap: isMd ? 1 : 2,
  pr: 2,
  pl: 2,
  background: theme.palette.background.default,
});

export const LinksLargeContainer: SxProps = {
  display: "flex",
  gap: 0.5,
  justifySelf: "start",
  ml: "auto",
};

export const MediaLinksContainer = ({ isMd }: { isMd: boolean }): SxProps => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  gap: 2,
  padding: 1,
  ml: isMd ? "auto" : 0,
});

export const SmallMenuContainer = ({ isMd }: { isMd: boolean }): SxProps => ({
  display: "flex",
  gap: 1,
  justifySelf: "start",
  ml: isMd ? 0 : "auto",
});

export const MenuPaperStyles: SxProps = {
  alignItems: "flex-end",
  p: 1,
  gap: 2,
  width: "260px",
  zIndex: 11,
};

export const LinksSmallContainer: SxProps = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  " button": { justifyContent: "flex-end" },
};
