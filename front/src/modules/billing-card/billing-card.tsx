import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Tarrif } from "shared/billing";
import { theme } from "shared/theme";

export const BillingCard = ({ item }: { item: Tarrif }) => (
  <Card
    sx={{
      maxWidth: "400px",
      minWidth: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "secondary.dark",
    }}
  >
    <CardActionArea
      sx={{ flexGrow: 1, display: "flex", alignItems: "flex-start" }}
      disableRipple
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        <Typography sx={{ mb: 1 }} variant="h4">
          {item.durationTitle}
        </Typography>
        <Typography sx={{ mb: 3 }} variant="body1">
          {item.description}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {item.features.map((feature) => (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: theme.palette.primary.main,
              }}
              variant="body2"
            >
              <CheckIcon />
              {feature}
            </Typography>
          ))}
        </Box>
        <Typography
          fontWeight="bold"
          textAlign="center"
          variant="h4"
          color="secondary.dark"
          sx={{
            mt: 3,
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб.
        </Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button size="large" variant="contained" fullWidth>
        Купить!
      </Button>
    </CardActions>
  </Card>
);
