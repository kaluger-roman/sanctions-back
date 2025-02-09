import { ClientCategory, TarrifKind } from "shared/billing";

export const REQUESTS_INFO =
  "Количество запросов выдается на период действия тарифа, если у вас не безлимитный тариф, то в дальнейшем есть возможность докупить запросы в личном кабинете";

export const TarrifNames: Record<string, string> = {
  [TarrifKind.free]: "Бесплатный",
  [TarrifKind.physBasic]: "Базовый",
  [TarrifKind.physUpper]: "Продвинутый",
  [TarrifKind.physPro]: "Про",
  [TarrifKind.jurBasic]: "Базовый",
  [TarrifKind.jurUpper]: "Продвинутый",
  [TarrifKind.jurPro]: "Про",
  [TarrifKind.demoPro]: "Демо Про",
};

export const TarrifCategories: Record<string, string> = {
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
