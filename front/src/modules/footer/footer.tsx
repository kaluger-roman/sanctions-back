import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { ReactComponent as VK } from "shared/icons/vk.svg";
import { ReactComponent as TG } from "shared/icons/telegram.svg";

export const Footer = () => (
  <Box
    sx={{
      mt: "auto",
      columnGap: 6,
      flexWrap: "wrap",
      rowGap: 4,
      justifyContent: "center",
    }}
    p={4}
    display="flex"
  >
    {(
      [
        [PlaceIcon, "2-я Пугачевская улица, дом 8, корпус 3"],
        [LocalPhoneIcon, "8 (499) 780-74-97"],
        [EmailIcon, "oao_master_ok@bk.ru"],
      ] as const
    ).map(([Icon, text]) => (
      <Box sx={{ display: "flex", gap: 1, width: "max-content" }}>
        <Icon />
        {text}
      </Box>
    ))}

    <Box sx={{ display: "flex", height: "24px", gap: 1, width: "max-content" }}>
      <Typography variant="body1" fontWeight="bold">
        Соцсети:{" "}
      </Typography>
      <VK height="100%" cursor="pointer" />
      <TG height="100%" cursor="pointer" />
    </Box>
  </Box>
);
