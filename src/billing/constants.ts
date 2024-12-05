import { AdditionalRequestsPaymentKind, TarrifKind } from "./types";

export const TarrifNames = {
  [TarrifKind.free]: "Бесплатный",
  [TarrifKind.physBasic]: "Базовый",
  [TarrifKind.physUpper]: "Продвинутый",
  [TarrifKind.physPro]: "Про",
  [TarrifKind.jurBasic]: "Базовый",
  [TarrifKind.jurUpper]: "Продвинутый",
  [TarrifKind.jurPro]: "Про",
  [TarrifKind.demoPro]: "Демо Про",
};

export const TarrifCategories = {
  [TarrifKind.free]: "Бесплатный",
  [TarrifKind.physBasic]: "Физ. лицо",
  [TarrifKind.physUpper]: "Физ. лицо",
  [TarrifKind.physPro]: "Физ. лицо",
  [TarrifKind.jurBasic]: "Юр. лицо",
  [TarrifKind.jurUpper]: "Юр. лицо",
  [TarrifKind.jurPro]: "Юр. лицо",
};

export const AdditionalPayments = {
  [AdditionalRequestsPaymentKind.additional100]: {
    price: 2000,
    amount: 100,
  },
  [AdditionalRequestsPaymentKind.additional200]: {
    price: 4000,
    amount: 200,
  },
  [AdditionalRequestsPaymentKind.additional300]: {
    price: 6000,
    amount: 300,
  },
};

export const UserTarrifsInclude = {
  select: {
    _count: {
      select: { searchRequest: true, devices: true },
    },
    start: true,
    end: true,
    additionalRequestsCount: true,
    tarrif: {
      select: {
        identifier: true,
        allowedRequests: true,
        allowedDevices: true,
        allowedCountries: true,
      },
    },
  },
  orderBy: {
    end: "asc",
  },
} as const;
