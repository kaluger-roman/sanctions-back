import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { ReactComponent as VK } from "shared/icons/vk.svg";
import { ReactComponent as TG } from "shared/icons/telegram.svg";
import policies from "./Политики конфиденциальности.docx";
import { theme } from "shared/theme";
import LockIcon from "@mui/icons-material/Lock";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export const Footer = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        p: 3,

        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          gridTemplateColumns: isSm
            ? "1fr"
            : isMd
            ? "repeat(2, auto)"
            : "repeat(3, auto)",
          columnGap: 6,
          rowGap: 2,
          justifyItems: "start",
          alignItems: "center",
        }}
        display="grid"
      >
        {(
          [
            [CopyrightIcon, "2024, Все права защищены"],
            [PlaceIcon, "Работаем онлайн, основное местоположение – Москва"],
            [LocalPhoneIcon, "+7 (916) 823-21-98"],
            [EmailIcon, "goodsanctionsearch@gmail.com"],
            [
              LockIcon,
              <Link href={policies} download="Политика конфиденциальности.docx">
                <Typography variant="caption">
                  Политика конфиденциальности
                </Typography>
              </Link>,
            ],
            [
              ReceiptLongIcon,
              <Link href={policies} download="Публичная оферта">
                <Typography variant="caption">Публичная оферта</Typography>
              </Link>,
            ],
          ] as const
        ).map(([Icon, text]) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon sx={{ mr: 1 }} />
            <Typography variant="caption">{text}</Typography>
          </Box>
        ))}

        <Box
          sx={{
            display: "flex",
            height: "24px",
            gap: 1,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            Соцсети:{" "}
          </Typography>
          <VK height="100%" cursor="pointer" />
          <TG height="100%" cursor="pointer" />
        </Box>
      </Box>
    </Box>
  );
};
