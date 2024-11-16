import { Box, Typography } from "@mui/material";
import { theme } from "shared/theme";
import ArticleIcon from "@mui/icons-material/Article";

export const News = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      background: theme.palette.grey[300],
      borderRadius: 4,
      p: 2,
      mb: 4,
      color: theme.palette.secondary.dark,
    }}
  >
    <Typography
      variant="h5"
      sx={{ borderBottom: `1px solid ${theme.palette.secondary.dark}`, pb: 1 }}
    >
      Новости
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 2,
        maxHeight: "300px",
        overflow: "auto",
        pr: 2,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.secondary.dark,
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: theme.palette.grey[300],
        },
      }}
    >
      {[
        {
          date: "Coming soon",
          text: "Добавление поиска по ограничениям, связанным с оказанием услуг (английская и русская версии); добавление новых стран: Япония и Тайвань; поиск по контрасанкциям России.",
        },
        {
          date: "10.11.2024",
          text: "Добавление новой возможности по поиску: теперь при вводе кода ТНВЭД можно увидеть возможное дополнение до санкционного кода (если Вы знаете, например, только 4 цифры, сервис найдет и укажет вам, есть ли санкционные коды, которые начинаются с введенных Вами (находится в фильтре по «Типу поиска», по умолчанию включен и результат отображается в соответствующей графе).",
        },
        {
          date: "05.10.2024",
          text: "Добавление новой страны: Австралия с учетом последних актуальных изменений.",
        },
        {
          date: "10.09.2024",
          text: "Обновление списков по Южной Корее.",
        },
      ].map((item) => (
        <>
          <Box key={item.text} sx={{ display: "flex" }}>
            <ArticleIcon sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight="bold">
              {item.date}
            </Typography>
          </Box>
          <Typography sx={{ textAlign: "justify", flexGrow: 1 }}>
            {item.text}
          </Typography>
        </>
      ))}
    </Box>
  </Box>
);
