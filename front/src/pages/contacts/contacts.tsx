import { Box, Typography, alpha, useMediaQuery } from "@mui/material";
import { theme } from "shared/theme";
import CitySrc from "./images/city.jpg";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { adjustAppHeight } from "@master_kufa/client-tools";
import { ContactUs } from "modules";
import { useGate } from "effector-react";
import { contactUsModel } from "models";

export const Contacts = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  useGate(contactUsModel.PageGate);
  return (
    <Box
      sx={{
        position: "relative",
        gap: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: `calc(${adjustAppHeight()} - 60px)`,
      }}
    >
      <img
        src={CitySrc}
        style={{
          position: "absolute",
          objectFit: "cover",
          minHeight: `calc(${adjustAppHeight()} - 40px)`,
          height: "calc(100% + 20px)",
          filter: "blur(5px)",
          width: "calc(100% + 20px)",
          marginLeft: "-10px",
          marginTop: "-10px",
        }}
      />
      <Box
        sx={{
          gap: 2,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          position: "relative",
          p: 3,
        }}
      >
        <Box
          sx={{
            p: 3,
            position: "relative",
            borderRadius: 4,
            background: alpha(theme.palette.grey[900], 0.8),
            flexGrow: 1,
            flexBasis: "50%",
            maxWidth: 1200,
            height: "fit-content",
          }}
        >
          <Typography
            sx={{
              mb: 1,
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
                [
                  "Адрес",
                  PlaceIcon,
                  "Работаем онлайн, основное местоположение – Москва",
                ],
                ["Телефон", LocalPhoneIcon, "+7 (916) 823-21-98"],
                ["Почта", EmailIcon, "goodsanctionsearch@gmail.com"],
              ] as const
            ).map(([Label, Icon, text]) => (
              <>
                <Typography
                  variant={isSm ? "body1" : "h6"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  {Label}
                </Typography>
                <Typography
                  variant={isSm ? "body2" : "h6"}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    mt: 1,
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
        <ContactUs />
      </Box>
    </Box>
  );
};
