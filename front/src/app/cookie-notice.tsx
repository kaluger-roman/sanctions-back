import { Snackbar, Box, Typography, Link, Button } from "@mui/material";
import { useState } from "react";

export const CoockieNotice = () => {
  const [cookies, setCookies] = useState(false);

  return (
    <Snackbar
      open={!cookies}
      onClose={() => setCookies(true)}
      message={
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Typography variant="body1">
            Данный сайт собирает cookie и использует аналогичные технологии.{" "}
            <Link>Узнать подробнее.</Link>
          </Typography>
          <Button variant="outlined" onClick={() => setCookies(true)}>
            <Typography variant="body1" onClick={() => setCookies(true)}>
              Согласен
            </Typography>
          </Button>
        </Box>
      }
    />
  );
};
