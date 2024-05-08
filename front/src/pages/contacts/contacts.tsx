import { Box, Typography, alpha, useMediaQuery } from "@mui/material";
import { theme } from "shared/theme";
import CitySrc from "./images/city.jpg";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { adjustAppHeight } from "@master_kufa/client-tools";

export const Contacts = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `calc(${adjustAppHeight()} - 60px)`,
      }}
    >
      <img
        src={CitySrc}
        style={{
          position: "absolute",
          objectFit: "cover",
          height: `calc(${adjustAppHeight()} - 40px)`,
          filter: "blur(5px)",
          width: "calc(100% + 20px)",
          marginLeft: "-10px",
          marginTop: "-10px",
        }}
      />
      <Box
        sx={{
          p: 4,
          position: "relative",
          borderRadius: 4,
          maxWidth: "1200px",
          background: alpha(theme.palette.grey[900], 0.8),
          mr: 2,
          ml: 2,
        }}
      >
        <Typography
          sx={{
            mb: 4,
            color: theme.palette.primary.main,
          }}
          variant="h3"
        >
          Контакты
        </Typography>
        <Box
          sx={{
            color: theme.palette.secondary.light,
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            columnGap: 2,
          }}
        >
          {(
            [
              ["Адрес", PlaceIcon, "2-я Пугачевская улица, дом 8, корпус 3"],
              ["Телефон", LocalPhoneIcon, "8 (499) 780-74-97"],
              ["Почта", EmailIcon, "oao_master_ok@bk.ru"],
            ] as const
          ).map(([Label, Icon, text]) => (
            <>
              <Typography
                variant={isSm ? "body1" : "h5"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                {Label}
              </Typography>
              <Typography
                variant={isSm ? "body1" : "h5"}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  mt: 2,
                  wordBreak: "break-word",
                }}
              >
                <Icon />
                {text}
              </Typography>
            </>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
