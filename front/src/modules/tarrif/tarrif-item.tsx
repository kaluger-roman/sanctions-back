import { Box, Typography, Tooltip } from "@mui/material";
import { theme } from "shared/theme";
import { DataChip } from "./data-chip";
import { useUnit } from "effector-react";
import { profileModel } from "models";
import { TarrifKind } from "shared/billing";
import InfoIcon from "@mui/icons-material/Info";

import {
  CategoryNames,
  TarrifCategories,
  TarrifNames,
} from "pages/billing/constants";
import { UserTarrif } from "shared/profile";

const QuotaChip = ({
  label,
  count,
  limit,
  isUnlimited,
}: {
  label: string;
  count: number;
  limit: number | null;
  isUnlimited: boolean;
}) => {
  return (
    <DataChip
      label={label}
      value={
        <Box sx={{ display: "flex", gap: 1 }}>
          {!!limit && (
            <Typography
              variant="caption"
              sx={{
                color: count >= limit ? theme.palette.error.main : undefined,
                textDecoration: isUnlimited ? "line-through" : undefined,
              }}
            >
              {count}/{limit}
            </Typography>
          )}
          {isUnlimited && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.grey[500],
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              Безлимит
              {!!limit && (
                <Tooltip title="В списке неистекших оплаченных тарифов есть безлимитный">
                  <InfoIcon fontSize="inherit" />
                </Tooltip>
              )}
            </Typography>
          )}
        </Box>
      }
    />
  );
};

export const TarrifItem = ({ tarrif }: { tarrif: UserTarrif }) => {
  const currentTarrif = useUnit(profileModel.$currentTarrif);
  const { isUnlimitedDevices, isUnlimitedRequests } =
    useUnit(profileModel.$profile) || {};

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
      <QuotaChip
        label="Квота поисковых запросов"
        count={tarrif._count.searchRequest}
        limit={tarrif.tarrif.allowedRequests}
        isUnlimited={!!isUnlimitedRequests}
      />
      <QuotaChip
        label="Квота устройств"
        count={tarrif._count.devices}
        limit={tarrif.tarrif.allowedDevices}
        isUnlimited={!!isUnlimitedDevices}
      />
    </Box>
  );
};
