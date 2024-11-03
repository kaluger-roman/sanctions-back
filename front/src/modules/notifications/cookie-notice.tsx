import { Box, Typography, Link, Button, Alert } from "@mui/material";
import { useState } from "react";
import { AlertStyles } from "./styles";

export const CoockieNotice = () => {
  const [cookies, setCookies] = useState(false);

  if (cookies) return null;

  return (
    <Alert severity="info" sx={AlertStyles}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Typography variant="body1">
          Данный сайт собирает cookie и использует аналогичные технологии.{" "}
          <Link>Узнать подробнее.</Link>
        </Typography>
        <Button
          sx={{ minWidth: "100px" }}
          variant="outlined"
          onClick={() => setCookies(true)}
        >
          <Typography variant="body1" onClick={() => setCookies(true)}>
            Согласен
          </Typography>
        </Button>
      </Box>
    </Alert>
  );
};
