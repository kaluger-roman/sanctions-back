import {
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { theme } from "shared/theme";
import { DataChip } from "./data-chip";
import { useUnit } from "effector-react";
import { billingModel, profileModel } from "models";
import { AdditionalRequestsPaymentKind, TarrifKind } from "shared/billing";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";

import {
  CategoryNames,
  TarrifCategories,
  TarrifNames,
} from "pages/billing/constants";
import { UserTarrif } from "shared/profile";
import { useState } from "react";

const QuotaChip = ({
  label,
  count,
  limit,
  isUnlimited,
  additionalPayments,
  onAdditionalPayment,
}: {
  label: string;
  count: number;
  limit: number | null;
  isUnlimited: boolean;
  onAdditionalPayment?: (value: unknown) => void;
  additionalPayments?: Array<{
    label: string;
    value: unknown;
  }>;
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return (
    <DataChip
      label={label}
      value={
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
          {!isUnlimited && additionalPayments?.length && (
            <>
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: "10px" }} />}
                onClick={(e) => setAnchorEl(e.currentTarget as any)}
                sx={{
                  fontSize: "10px",
                  ".MuiButton-startIcon": { mr: 0 },
                  pt: 0,
                  pb: 0,
                  pr: 1,
                  pl: 1,
                }}
              >
                Докупить
              </Button>
              <Menu
                sx={{ mt: 0.5 }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
              >
                {additionalPayments?.map((payment) => (
                  <MenuItem
                    sx={{ fontSize: "14px" }}
                    onClick={() => onAdditionalPayment?.(payment.value)}
                  >
                    {payment.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
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
        label={`Квота поисковых запросов ${
          tarrif.additionalRequestsCount ? `(увеличена)` : ""
        }`}
        count={tarrif._count.searchRequest}
        limit={tarrif.tarrif.allowedRequests + tarrif.additionalRequestsCount}
        isUnlimited={!!isUnlimitedRequests}
        onAdditionalPayment={(kind) =>
          billingModel.createAddRequestsPayment(
            kind as AdditionalRequestsPaymentKind,
          )
        }
        additionalPayments={[
          {
            label: "+100 (2000руб)",
            value: AdditionalRequestsPaymentKind.additional100,
          },
          {
            label: "+200 (4000руб)",
            value: AdditionalRequestsPaymentKind.additional200,
          },
          {
            label: "+300 (6000руб)",
            value: AdditionalRequestsPaymentKind.additional300,
          },
        ]}
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
