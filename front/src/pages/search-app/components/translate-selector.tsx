import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
} from "@mui/material";
import { Lang } from "shared/search";

export const TranslateSelector = ({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (value: Lang) => void;
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 4,
        right: 4,
      }}
    >
      <ToggleButtonGroup
        size="small"
        value={lang}
        exclusive
        orientation="vertical"
        onChange={(_, value) => value && setLang(value)}
        sx={{
          "& .MuiButtonBase-root": {
            p: "2px",
          },
        }}
      >
        <ToggleButton value={Lang.en}>
          <Typography fontWeight="bold" sx={{ fontSize: 8 }}>
            ENG
          </Typography>
        </ToggleButton>

        <ToggleButton value={Lang.ru}>
          <Typography fontWeight="bold" sx={{ fontSize: 8 }}>
            РУС
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
