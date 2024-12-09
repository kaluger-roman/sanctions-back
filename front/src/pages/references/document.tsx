import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { theme } from "shared/theme";
import TopicIcon from "@mui/icons-material/Topic";

const onDownload = (src: string, name: string) => {
  const link = document.createElement("a");
  link.download = `${name}.pdf`;
  link.href = src;
  link.click();
};

export const DocumentFile = ({
  header,
  docSrc,
}: {
  header: string;
  docSrc: string;
}) => (
  <Card
    sx={{
      flexGrow: 1,
      flexBasis: "30%",
      minWidth: "280px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <CardActionArea>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TopicIcon sx={{ fontSize: "40px" }} />
        <Typography variant="h6" component="div">
          {header}
        </Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button
        onClick={() => onDownload(docSrc, header)}
        sx={{
          color: theme.palette.primary.main,
          fontSize: "24px",
        }}
      >
        Скачать
      </Button>
    </CardActions>
  </Card>
);
