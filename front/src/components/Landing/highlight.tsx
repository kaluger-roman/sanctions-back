import { Typography } from "@mui/material";
import { theme } from "shared/theme";

export const HightlightPluses = ({ children }: { children: string }) => (
  <Typography
    variant="h6"
    display="inline"
    color={theme.palette.primary.light}
    fontWeight="bold"
  >
    {children}
  </Typography>
);
