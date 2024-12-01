import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { US, EU, GB, AU, KR, CN } from "country-flag-icons/react/3x2";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import { theme } from "shared/theme";
import Instruction from "./instruction.pdf";
import { navigation } from "shared/navigate";
import { News } from "./news";
import { Paths } from "shared/paths";

const ACTUAL_DATES: Array<{
  country: string;
  date: string;
  flag: React.ReactElement;
}> = [
  { country: "ЕС", date: "24.06.2024", flag: <EU /> },
  { country: "Великобритания", date: "28.05.2024", flag: <GB /> },
  { country: "США", date: "18.06.2024", flag: <US /> },
  { country: "Южная Корея", date: "09.09.2024", flag: <KR /> },
  { country: "Австралия", date: "08.04.2024", flag: <AU /> },
  { country: "Китай", date: "01.12.2024", flag: <CN /> },
];

export const SearchAppMetadata = () => (
  <Box sx={{ maxWidth: 1200, mr: "auto", ml: "auto", position: "relative" }}>
    <Box
      sx={{
        mt: 4,
        p: 2,
        borderRadius: 4,
        background: theme.palette.grey[300],
      }}
    >
      <Typography variant="body1">
        Уважаемые Пользователи!
        <br /> <br /> Данный сервис по-прежнему предоставляет полный доступ ко
        всем функциям бесплатно! Однако просим Вас{" "}
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => navigation.navigate(Paths.register)}
        >
          <b>зарегистрироваться</b>
        </Link>{" "}
        на сайте (окно в правом верхнем углу), чтобы мы не потеряли друг друга и
        всегда оставались на связи. При наличии любых вопросов можете смело
        обращаться по{" "}
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => navigation.navigate(Paths.contacts)}
        >
          форме на сайте
        </Link>
        , по почте (<Link>goodsanctionsearch@gmail.com</Link>) или напрямую
        написать в Telegram (
        <Link href="https://t.me/GoodSanctionSearch">
          https://t.me/GoodSanctionSearch
        </Link>
        ).
      </Typography>
    </Box>
    <Box sx={{ pt: 4, pb: 4 }}>
      <Typography variant="h6">Списки актуальны на текущий день!</Typography>
      <Typography variant="body1">Дата обновления:</Typography>
      <List sx={{ display: "flex", flexWrap: "wrap" }}>
        {ACTUAL_DATES.map((item) => (
          <ListItem sx={{ gap: 2, width: "min-content", mr: 8 }}>
            <ListItemIcon sx={{ height: "40px" }}>{item.flag}</ListItemIcon>
            <ListItemText primary={item.country} secondary={`${item.date}`} />
          </ListItem>
        ))}
      </List>
    </Box>
    <News />
    <Box
      sx={{ borderRadius: 3, background: theme.palette.secondary.light, p: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 4,
          justifyContent: "space-between",
          gap: 4,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" sx={{ flexBasis: "350px", flexGrow: 1 }}>
          Остались вопросы или предложения по улучшению сервиса?
        </Typography>

        <Box>
          <Button
            href={Instruction}
            download="Instruction_Good_Sanctions_Check.pdf"
            sx={{ width: "200px", height: "max-content" }}
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Инструкция
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 4,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" sx={{ flexBasis: "350px", flexGrow: 1 }}>
          Мы с удовольствием рассмотрим и ответим на вашу заявку, а также внесем
          изменения, которые будут учитывать Ваши пожелания!
        </Typography>
        <Box>
          <Button
            sx={{ width: "200px" }}
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            onClick={() => navigation.navigate("contacts")}
          >
            Связаться с нами
          </Button>
        </Box>
      </Box>
    </Box>
  </Box>
);
