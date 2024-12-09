import { Box, Typography } from "@mui/material";
import { theme } from "shared/theme";
import LockIcon from "@mui/icons-material/Lock";

export const PlaceholderRef = ({
  count,
  name,
}: {
  count: number;
  name: string;
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: theme.palette.grey[500],
          mt: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <LockIcon />
        {count} {name}. Подробный просмотр доступен только для пользователей с
        купленной подпиской.
      </Typography>
    </Box>
  );
};
