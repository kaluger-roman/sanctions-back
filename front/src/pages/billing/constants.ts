import { ClientCategory, TarrifCard, TarrifKind } from "shared/billing";

export const TarrifNames = {
  [TarrifKind.free]: "Бесплатный",
  [TarrifKind.physBasic]: "Базовый",
  [TarrifKind.physUpper]: "Продвинутый",
  [TarrifKind.physPro]: "Про",
  [TarrifKind.jurBasic]: "Базовый",
  [TarrifKind.jurUpper]: "Продвинутый",
  [TarrifKind.jurPro]: "Про",
};

export const TarrifCategories = {
  [TarrifKind.free]: "Бесплатный",
  [TarrifKind.physBasic]: ClientCategory.private,
  [TarrifKind.physUpper]: ClientCategory.private,
  [TarrifKind.physPro]: ClientCategory.private,
  [TarrifKind.jurBasic]: ClientCategory.company,
  [TarrifKind.jurUpper]: ClientCategory.company,
  [TarrifKind.jurPro]: ClientCategory.company,
};

export const CategoryNames = {
  [ClientCategory.private]: "Физическое лицо",
  [ClientCategory.company]: "Юридическое лицо",
};

export const TARRIFS: Array<TarrifCard> = [
  {
    durationTitle: "1 месяц",
    description: "Подойдет, если вы не ведете проверки на постоянной основе",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      "300 запросов в месяц",
      "3 устройств для доступа",
    ],
    price: 5000,
    kind: TarrifKind.physBasic,
  },
  {
    durationTitle: "6 месяцев",
    description:
      "Оптимальный вариант, если хотите с нами работать, но не уверены как часто будете использовать проверки",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      "Неограниченное число запросов",
      "3 устройств для доступа",
      "Экономия 17%",
    ],
    price: 25000,
    kind: TarrifKind.physUpper,
  },
  {
    durationTitle: "12 месяцев",
    description:
      "Подойдет для пользователей, готовых вести долгосрочное сотрудничество",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      "Неограниченное число запросов",
      "3 устройств для доступа",
      "Экономия 25%",
    ],
    price: 45000,
    kind: TarrifKind.physPro,
  },
  {
    durationTitle: "1 месяц",
    description: "Подойдет, если вы не ведете проверки на постоянной основе",
    features: [
      "Полный доступ ко всем спискам",
      "Поддержка 24/7",
      "1000 запросов в месяц",
      "Неограниченное число устройств для доступа",
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
      "Неограниченное число запросов",
      "Неограниченное число устройств для доступа",
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
      "Неограниченное число запросов",
      "Неограниченное число устройств для доступа",
      "Экономия 25%",
    ],
    price: 135000,
    kind: TarrifKind.jurPro,
  },
];
