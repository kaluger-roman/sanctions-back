import { theme } from "shared/theme";

export const AlertStyles = {
  background: theme.palette.grey[800],
  color: theme.palette.grey[200],
  alignItems: "center",
  maxWidth: 600,

  "& .MuiAlert-message": {
    width: "100%",
  },
};
