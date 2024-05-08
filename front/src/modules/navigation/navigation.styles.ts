import { SxProps } from "@mui/material";
import { theme } from "shared/theme";

export const NavigationContainer = ({ isSm }: { isSm: boolean }): SxProps => ({
  width: "100vw",
  height: "60px",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  gap: isSm ? 1 : 4,
  pr: 2,
  pl: 2,
  background: theme.palette.background.default,
});

export const LinksLargeContainer: SxProps = {
  display: "flex",
  gap: 1,
  justifySelf: "start",
  ml: "auto",
};

export const MediaLinksContainer = ({ isSm }: { isSm: boolean }): SxProps => ({
  height: "100%",
  display: "flex",
  gap: 2,
  padding: 2,
  ml: isSm ? "auto" : 0,
});

export const SmallMenuContainer = ({ isSm }: { isSm: boolean }): SxProps => ({
  display: "flex",
  gap: 1,
  justifySelf: "start",
  ml: isSm ? 0 : "auto",
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
