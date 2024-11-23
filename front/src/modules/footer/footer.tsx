import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { ReactComponent as VK } from "shared/icons/vk.svg";
import { ReactComponent as TG } from "shared/icons/telegram.svg";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import policies from "./Politika_obrabotki_personalnykh_dannykh.docx";
import policies1 from "./Soglasie_na_obrabotku_PD.docx";
import oferta from "./Publichnaya_oferta.docx";
import { theme } from "shared/theme";
import LockIcon from "@mui/icons-material/Lock";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HandshakeIcon from "@mui/icons-material/Handshake";

export const Footer = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));
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
          display: "flex",
          flexDirection: "column",
          columnGap: 3,
          rowGap: 3,
          justifyItems: "start",
          alignItems: "flex-start",
          flexWrap: "wrap",

          height: isSm ? 540 : isMd ? 300 : isLg ? 170 : 110,
        }}
      >
        {(
          [
            [CopyrightIcon, "2024, Все права защищены"],
            [PermIdentityIcon, "ИП Авдеев Дмитрий Александрович"],
            [BookmarkIcon, "ИНН: 771540131275"],
            [BookmarkIcon, "ОГРНИП: 324774600705838"],
            [
              LockIcon,
              <Link
                href={policies}
                download="Политика обработки персональных данных.docx"
              >
                <Typography variant="caption">
                  Политика обработки персональных данных
                </Typography>
              </Link>,
            ],
            [
              HandshakeIcon,
              <Link
                href={policies1}
                download="Согласие на обработку персональных данных.docx"
              >
                <Typography variant="caption">
                  Согласие на обработку персональных данных
                </Typography>
              </Link>,
            ],
            [
              ReceiptLongIcon,
              <Link href={oferta} download="Публичная оферта">
                <Typography variant="caption">Публичная оферта</Typography>
              </Link>,
            ],
            [PlaceIcon, "Работаем онлайн, основное местоположение – Москва"],
            [EmailIcon, "goodsanctionsearch@gmail.com"],
          ] as const
        ).map(([Icon, text], inx) => (
          <Box
            key={inx}
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: 280,
              minHeight: 40,
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
