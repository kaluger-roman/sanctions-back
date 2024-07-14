import { adjustAppHeight } from "@master_kufa/client-tools";
import { SxProps } from "@mui/material";

export const Container: SxProps = {
  bgcolor: "grey.100",
  display: "flex",
  alignItems: "center",
};

export const NavigationContainer: SxProps = {
  height: "100%",
  overflow: "hidden",
  width: "100%",
  minHeight: adjustAppHeight(),
  display: "flex",
  flexDirection: "column",
  gap: 2,
};
