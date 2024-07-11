import { Box, Typography, useMediaQuery } from "@mui/material";
import { TARRIFS_COMPANY, TARRIFS_PRIVATE } from "./constants";
import { BillingCard } from "modules";
import { Tarrif } from "shared/billing";
import { theme } from "shared/theme";

const BillingGroup = ({
  title,
  items,
}: {
  title: string;
  items: Array<Tarrif>;
}) => (
  <Box
    sx={{
      p: 4,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "center",
      background: theme.palette.secondary.light,
      borderRadius: 4,
    }}
  >
    <Typography
      color="secondary.dark"
      variant="h3"
      sx={{ textAlign: "center" }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {items.map((item) => (
        <BillingCard item={item} />
      ))}
    </Box>
  </Box>
);

export const Billing = () => {
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: isMd ? 2 : 6 }}
    >
      <BillingGroup title="Для физических лиц" items={TARRIFS_PRIVATE} />
      <BillingGroup title="Для юридических лиц" items={TARRIFS_COMPANY} />
    </Box>
  );
};
