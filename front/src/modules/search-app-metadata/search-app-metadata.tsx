import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  US,
  EU,
  GB,
  AU,
  KR,
  CN,
  JP,
  TW,
  CH,
} from "country-flag-icons/react/3x2";
import DownloadIcon from "@mui/icons-material/Download";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EmailIcon from "@mui/icons-material/Email";
import { theme } from "shared/theme";
import Instruction from "./instruction.pdf";
import { navigation } from "shared/navigate";
import { News } from "./news";
import { Paths } from "shared/paths";
import presentation from "./GoodSanctionCheck.pdf";
import presentationImage from "./presentation.jpg";
import GradeIcon from "@mui/icons-material/Grade";

const ACTUAL_DATES: Array<{
  country: string;
  date: string;
  flag: React.ReactElement;
}> = [
  { country: "ЕС", date: "20.05.2025", flag: <EU /> },
  { country: "Великобритания", date: "24.04.2025", flag: <GB /> },
  { country: "США", date: "04.02.2025", flag: <US /> },
  { country: "Южная Корея", date: "09.09.2024", flag: <KR /> },
  { country: "Австралия", date: "08.04.2024", flag: <AU /> },
  { country: "Китай", date: "01.12.2024", flag: <CN /> },
  { country: "Япония", date: "10.01.2025", flag: <JP /> },
  { country: "Тайвань", date: "05.11.2024", flag: <TW /> },
  { country: "Швейцария", date: "19.03.2025", flag: <CH /> },
];

export const SearchAppMetadata = () => {
  const isPresentationCheckpoint = useMediaQuery(theme.breakpoints.down(1000));

  return (
    <Box sx={{ maxWidth: 1200, mr: "auto", ml: "auto", position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box
            sx={{
              flexBasis: isPresentationCheckpoint
                ? undefined
                : `calc(50% - 8px)`,
              background: theme.palette.secondary.dark,
              borderRadius: 4,
              color: theme.palette.grey[200],
              p: 2,
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Уважаемые Пользователи!
            </Typography>
            <br />
            <Typography variant="body1">
              Рады представить Вам{" "}
              <b>
                самую полную и удобную Платформу для оценки санкционного риска
                по товарам и услугам - GoodSanctionCheck!
              </b>
            </Typography>
            <List>
              {[
                "Более 35000 товаров в базе",
                "Самая широкая и детализированная разметка всех ограничений",
                "Полный разбор санкционных ограничений ЕС, США, Великобритании и иных стран",
                "Удобный интерфейс и возможность быстрого анализа",
              ].map((item) => (
                <ListItem key={item}>
                  <ListItemIcon>
                    <GradeIcon sx={{ color: theme.palette.grey[200] }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            sx={{
              minHeight: "300px",
              background: `url(${presentationImage})`,
              position: "relative",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              flexBasis: isPresentationCheckpoint
                ? undefined
                : `calc(50% - 8px)`,
              borderRadius: 4,
            }}
          >
            <Button
              size="large"
              sx={{
                color: theme.palette.background.paper,
                position: "absolute",
                right: 4,
                top: 4,
              }}
              download
              href={presentation}
              startIcon={<CloudDownloadIcon sx={{ fontSize: "30px" }} />}
            >
              Скачать презентацию
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            background: theme.palette.grey[300],
            borderRadius: 4,
            p: 2,
          }}
        >
          <b>Для начала работы необходимо:</b>
          <br />
          <br />
          1.{" "}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => navigation.navigate(Paths.register)}
          >
            <b>Зарегистрироваться</b>
          </Link>{" "}
          <br />
          2. Подтвердить почту (в некоторых случаях она попадает в папку «Спам»)
          <br />
          3.{" "}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => navigation.navigate(Paths.billing)}
          >
            <b>Оплатить</b>
          </Link>{" "}
          любой из имеющихся тарифов любым удобным способом <br />
          4. Начать пользоваться! При наличии вопросов или желании{" "}
          <b>получить демо-доступ</b> можете смело обращаться по форме на сайте,
          по почте (<Link>goodsanctionsearch@gmail.com</Link>) или напрямую
          написать в Telegram ({" "}
          <Link href="https://t.me/GoodSanctionSearch">
            https://t.me/GoodSanctionSearch
          </Link>
          ).
        </Box>
      </Box>
      <Box sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h6">Списки актуальны на текущий день!</Typography>
        <Typography variant="body1">Дата обновления:</Typography>
        <List sx={{ display: "flex", flexWrap: "wrap" }}>
          {ACTUAL_DATES.map((item) => (
            <ListItem
              key={item.country}
              sx={{ gap: 2, width: "min-content", mr: 8 }}
            >
              <ListItemIcon sx={{ height: "40px" }}>{item.flag}</ListItemIcon>
              <ListItemText primary={item.country} secondary={`${item.date}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      <News />
      <Box
        sx={{
          borderRadius: 3,
          background: theme.palette.secondary.light,
          p: 2,
        }}
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
            Мы с удовольствием рассмотрим и ответим на вашу заявку, а также
            внесем изменения, которые будут учитывать Ваши пожелания!
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
};
