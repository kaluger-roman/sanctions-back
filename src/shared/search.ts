export enum Lang {
  en = "en",
  ru = "ru",
}

export const LANG_NAMES: Record<Lang, string> = {
  [Lang.en]: "Английский",
  [Lang.ru]: "Русский",
};

export const DESCRIPTION_FIELD: Record<Lang, string> = {
  [Lang.en]: "description",
  [Lang.ru]: "descriptionRussian",
};
