import { TarrifKind } from "./types";

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
  [TarrifKind.physBasic]: "Физ. лицо",
  [TarrifKind.physUpper]: "Физ. лицо",
  [TarrifKind.physPro]: "Физ. лицо",
  [TarrifKind.jurBasic]: "Юр. лицо",
  [TarrifKind.jurUpper]: "Юр. лицо",
  [TarrifKind.jurPro]: "Юр. лицо",
};
