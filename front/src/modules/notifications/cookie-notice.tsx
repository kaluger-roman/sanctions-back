import { Box, Typography, Link, Button, Alert } from "@mui/material";
import { useState } from "react";
import { AlertStyles } from "./styles";

const COOCKIE_AGREEMENT_FLAG = "COOCKIE_AGREEMENT_FLAG";

export const CoockieNotice = () => {
  const [cookies, setCookies] = useState(
    localStorage.getItem(COOCKIE_AGREEMENT_FLAG) === "true",
  );

  const acceptCookies = () => {
    localStorage.setItem(COOCKIE_AGREEMENT_FLAG, "true");

    setCookies(true);
  };

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
          onClick={acceptCookies}
        >
          <Typography variant="body1" onClick={acceptCookies}>
            Согласен
          </Typography>
        </Button>
      </Box>
    </Alert>
  );
};
