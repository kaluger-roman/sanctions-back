import { Tooltip, IconButton, Box } from "@mui/material";
import { TarrifCard, TarrifKind } from "shared/billing";
import { DEVICE_INFO, REQUESTS_INFO } from "./constants";
import InfoIcon from "@mui/icons-material/Info";

export const RequestInfoTooltip = () => (
  <Tooltip enterTouchDelay={0} title={REQUESTS_INFO}>
    <IconButton size="small" sx={{ p: "2px" }}>
      <InfoIcon sx={{ fontSize: 20 }} />
    </IconButton>
  </Tooltip>
);

export const DeviceInfoTooltip = () => (
  <Tooltip enterTouchDelay={0} title={DEVICE_INFO}>
    <IconButton size="small" sx={{ p: "2px" }}>
      <InfoIcon sx={{ fontSize: 20 }} />
    </IconButton>
  </Tooltip>
);

export const TARRIFS: Array<TarrifCard> = [
  {
    durationTitle: "1 месяц",
    description: "Подойдет, если вы не ведете проверки на постоянной основе",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      <Box>
        300 запросов в месяц <RequestInfoTooltip />
      </Box>,
      <Box>
        3 устройств для доступа <DeviceInfoTooltip />
      </Box>,
    ],
    price: 6500,
    kind: TarrifKind.physBasic,
  },
  {
    durationTitle: "6 месяцев",
    description:
      "Оптимальный вариант, если хотите с нами работать, но не уверены как часто будете использовать проверки",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      <Box>
        Неограниченное число запросов <RequestInfoTooltip />
      </Box>,
      <Box>
        3 устройств для доступа <DeviceInfoTooltip />
      </Box>,
      "Экономия 17%",
    ],
    price: 32500,
    kind: TarrifKind.physUpper,
  },
  {
    durationTitle: "12 месяцев",
    description:
      "Подойдет для пользователей, готовых вести долгосрочное сотрудничество",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      <Box>
        Неограниченное число запросов <RequestInfoTooltip />
      </Box>,
      <Box>
        3 устройств для доступа <DeviceInfoTooltip />
      </Box>,
      "Экономия 25%",
    ],
    price: 58500,
    kind: TarrifKind.physPro,
  },
  {
    durationTitle: "1 месяц",
    description: "Подойдет, если вы не ведете проверки на постоянной основе",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      <Box>
        1000 запросов в месяц <RequestInfoTooltip />
      </Box>,
      <Box>
        Неограниченное число устройств для доступа <DeviceInfoTooltip />
      </Box>,
    ],
    price: 15000,
    kind: TarrifKind.jurBasic,
  },
  {
    durationTitle: "6 месяцев",
    description:
      "Оптимальный вариант, если хотите с нами работать, но не уверены как часто будете использовать проверки",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      <Box>
        Неограниченное число запросов <RequestInfoTooltip />
      </Box>,
      <Box>
        Неограниченное число устройств для доступа <DeviceInfoTooltip />
      </Box>,
      "Экономия 17%",
    ],
    price: 75000,
    kind: TarrifKind.jurUpper,
  },
  {
    durationTitle: "12 месяцев",
    description:
      "Подойдет для пользователей, готовых вести долгосрочное сотрудничество",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      <Box>
        Неограниченное число запросов <RequestInfoTooltip />
      </Box>,
      <Box>
        Неограниченное число устройств для доступа <DeviceInfoTooltip />
      </Box>,
      "Экономия 25%",
    ],
    price: 135000,
    kind: TarrifKind.jurPro,
  },
];
