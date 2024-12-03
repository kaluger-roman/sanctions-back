import { Box, Typography, useMediaQuery, Link } from "@mui/material";
import { TarrifCategories } from "./constants";
import { BillingCard } from "modules";
import { ClientCategory, TarrifCard } from "shared/billing";
import { theme } from "shared/theme";
import { useGate } from "effector-react";
import { billingModel } from "models";
import { TARRIFS } from "./biling-cards.parts";
import { Paths } from "shared/paths";
import oferta from "../../modules/footer/Publichnaya_oferta.docx";
import { navigation } from "shared/navigate";

const BillingGroup = ({
  title,
  items,
}: {
  title: string;
  items: Array<TarrifCard>;
}) => {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        background: theme.palette.secondary.light,
        borderRadius: 4,
      }}
    >
      <Typography
        color="secondary.dark"
        variant="h3"
        sx={{ textAlign: "center" }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {items.map((item) => (
          <BillingCard key={item.kind} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export const Billing = () => {
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  useGate(billingModel.BillingGate);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 4, p: isMd ? 2 : 6 }}
    >
      <BillingGroup
        title="Для физических лиц"
        items={TARRIFS.filter(
          (x) => TarrifCategories[x.kind] === ClientCategory.private,
        )}
      />
      <BillingGroup
        title="Для юридических лиц"
        items={TARRIFS.filter(
          (x) => TarrifCategories[x.kind] === ClientCategory.company,
        )}
      />
      <Box
        sx={{
          p: 4,
          background: theme.palette.grey[300],
          borderRadius: 4,
        }}
      >
        <Typography
          fontWeight="bold"
          variant="h6"
          color={theme.palette.primary.dark}
        >
          Возможно произвести оплату на расчетный счет по реквизитам, указанным
          в{" "}
          <Link
            sx={{ cursor: "pointer" }}
            href={oferta}
            download="Публичная оферта"
          >
            публичной оферте
          </Link>
          ! Для осуществления платежа просьба написать на почту (
          <Link>goodsanctionsearch@gmail.com</Link>) или заполнить{" "}
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => navigation.navigate(Paths.contacts)}
          >
            заявку во вкладке «Контакты».
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
