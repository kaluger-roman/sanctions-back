import { useMediaQuery, Box, Typography, Button } from "@mui/material";
import { isEqual } from "lodash";
import { theme } from "shared/theme";
import { DataChip } from "./data-chip";

export const Tarrif = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        pl: 2,
        pr: 2,
        pt: isSm ? 2 : 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
        Тариф
      </Typography>

      <DataChip label="Дата последней покупки" />
      <DataChip label="Последний купленный тариф" />
      <DataChip label="Дата истечения доступа" />

      <Button
        sx={{ maxWidth: isSm ? undefined : "200px", mt: 2 }}
        fullWidth={isSm ? true : false}
        variant="contained"
      >
        Продлить доступ
      </Button>
    </Box>
  );
};
