import {
  useMediaQuery,
  Box,
  Typography,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { theme } from "shared/theme";
import { DataChip } from "./data-chip";
import { navigation } from "shared/navigate";
import { useUnit } from "effector-react";
import { profileModel } from "models";
import { TarrifKind } from "shared/billing";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  CategoryNames,
  TarrifCategories,
  TarrifNames,
} from "pages/billing/constants";
import { UserTarrif } from "shared/profile";

const TarrifItem = ({ tarrif }: { tarrif: UserTarrif }) => {
  const currentTarrif = useUnit(profileModel.$currentTarrif);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        overflow: "hidden",
        pb: 3,
        pt: 3,
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <DataChip
        label={`${
          currentTarrif === tarrif
            ? "Текущий"
            : new Date(tarrif.start).getTime() > new Date().getTime()
            ? "Предоплаченный"
            : "Завершенный"
        } тариф`}
        value={TarrifNames[tarrif.tarrif.identifier]}
      />
      {tarrif.tarrif.identifier !== TarrifKind.free && (
        <DataChip
          label="Тип"
          value={
            (CategoryNames as any)[
              TarrifCategories[tarrif.tarrif.identifier]
            ] || TarrifCategories[tarrif.tarrif.identifier]
          }
        />
      )}
      <DataChip
        label="Начало действия"
        value={
          tarrif.start &&
          new Date(tarrif.start).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }
        placeholder="Бессрочно"
      />
      <DataChip
        label="Конец действия"
        value={
          tarrif.end &&
          new Date(tarrif.end).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }
        placeholder="Бессрочно"
      />
    </Box>
  );
};

export const Tarrif = () => {
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const profile = useUnit(profileModel.$profile);
  const currentTarrif = useUnit(profileModel.$currentTarrif);

  const history = profile?.tarrifs.filter(
    (x) => x.end && new Date(x.end).getTime() < new Date().getTime(),
  );
  const relevant = profile?.tarrifs.filter(
    (x) => x.end && new Date(x.end).getTime() > new Date().getTime(),
  );

  return (
    <Box
      sx={{
        pl: 2,
        pr: 2,
        pt: isSm ? 2 : 0,
        width: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
        Тариф
      </Typography>
      {currentTarrif?.tarrif.identifier === TarrifKind.free ? (
        <>
          <TarrifItem tarrif={currentTarrif} />
        </>
      ) : (
        <>
          <Alert sx={{ mb: 2 }} severity="success">
            У вас уже есть активный тариф, в случае продления доступа, новый
            тариф будет активирован после окончания текущего
          </Alert>
          {relevant?.map((tarrif, inx) => (
            <TarrifItem key={inx} tarrif={tarrif} />
          ))}
        </>
      )}

      <Accordion
        sx={{
          mt: 4,
          border: "none",
          "&.Mui-expanded": { mt: 4 },
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography>История</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {history?.length ? (
            history.map((tarrif, inx) => (
              <TarrifItem key={inx} tarrif={tarrif} />
            ))
          ) : (
            <Typography
              color={theme.palette.grey[500]}
              variant="body2"
              sx={{ mb: 1, mt: 2 }}
            >
              Тут будут отображены завершенные тарифы
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Button
        sx={{ maxWidth: isSm ? undefined : "200px", mt: 2 }}
        fullWidth={isSm ? true : false}
        variant="contained"
        onClick={() => {
          navigation.navigate("/billing");
        }}
      >
        {currentTarrif?.tarrif.identifier === TarrifKind.free
          ? "Оформить"
          : "Продлить"}{" "}
        доступ
      </Button>
    </Box>
  );
};
