import { Paths } from "shared/paths";
import { LinkOption } from "./navigation.types";

export const NAME_MAPPING: Array<LinkOption> = [
  { name: "Главная", path: Paths.main },
  {
    name: "Услуги",
    subLinks: [
      { name: "Корпоративным клиентам", path: Paths.servicesCompanies },
      { name: "Частным клиентам", path: Paths.servicesPrivate },
    ],
  },
  {
    name: "Контакты",
    path: Paths.contacts,
  },
  {
    name: "Полезные ссылки и файлы",
    path: Paths.references,
  },
  { name: "Поисковое приложение", path: Paths.search_app },
];
