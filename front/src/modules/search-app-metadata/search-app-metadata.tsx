import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { US, EU, GB } from "country-flag-icons/react/3x2";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import { theme } from "shared/theme";
import Instruction from "./instruction.pdf";
import { navigation } from "shared/navigate";

const ACTUAL_DATES: Array<{
  country: string;
  date: string;
  flag: React.ReactElement;
}> = [
  { country: "ЕС", date: "24.06.2024", flag: <EU /> },
  { country: "Великобритания", date: "28.05.2024", flag: <GB /> },
  { country: "США", date: "18.06.2024", flag: <US /> },
];

export const SearchAppMetadata = () => (
  <Box sx={{ maxWidth: 1200, mr: "auto", ml: "auto", position: "relative" }}>
    <Box sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h6">Списки актуальны на следующие даты:</Typography>
      <List sx={{ display: "flex", flexWrap: "wrap" }}>
        {ACTUAL_DATES.map((item) => (
          <ListItem sx={{ gap: 2, width: "min-content", mr: 8 }}>
            <ListItemIcon>{item.flag}</ListItemIcon>
            <ListItemText primary={item.country} secondary={`${item.date}`} />
          </ListItem>
        ))}
      </List>
    </Box>
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
