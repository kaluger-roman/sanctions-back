import BIS_export_control_Items_Dual_use from "./files/BIS_export_control_Items_Dual-use.pdf";
import BIS_High_Priority_Items from "./files/BIS_High_Priority_Items.pdf";
import BIS_Russia_and_Belarus_restrictions_list_of_goods from "./files/BIS_Russia_and_Belarus_restrictions_list_of_goods.pdf";
import China_export_control_items from "./files/China_export_control_items.pdf";
import determination_items_to_section_11_a_ii_EO14024 from "./files/determination_items_to_section_11_a_ii_EO14024.pdf";
import EU_common_military_list from "./files/EU_common_military_list.pdf";
import EU_dual_use_items from "./files/EU_dual-use_items.pdf";
import EU_high_priority_items from "./files/EU_high_priority_items.pdf";
import Export_Sanctioned_goods_to_Russia from "./files/Export_Sanctioned_goods_to_Russia.pdf";
import FAQ_po_ogranicheniam_ES_protiv_RF from "./files/FAQ_po_ogranicheniam_ES_protiv_RF.pdf";
import Import_Sanctioned_goods_from_Russia from "./files/Import_Sanctioned_goods_from_Russia.pdf";
import ogranichenia_ES_po_Belarusi_EU_765_2006 from "./files/ogranichenia_ES_po_Belarusi_EU_765_2006.pdf";
import ogranichenia_ES_po_RF_EU_833_2014 from "./files/ogranichenia_ES_po_RF_EU_833_2014.pdf";
import ogranichenia_po_importu_exportu_EO14068 from "./files/ogranichenia_po_importu_exportu_EO14068.pdf";
import ogranichenia_po_importu_v_SShA_EO14066 from "./files/ogranichenia_po_importu_v_SShA_EO14066.pdf";
import ogranichenia_po_novym_territoriam_RF_EU_263_2022 from "./files/ogranichenia_po_novym_territoriam_RF_EU_263_2022.pdf";
import osnovnoy_zakon_kotory_vvodit_ogranichenia_EU_Exit_Regulations_2019 from "./files/osnovnoy_zakon_kotory_vvodit_ogranichenia_EU_Exit_Regulations_2019.pdf";
import Price_cap_determination from "./files/Price_cap_determination.pdf";
import spisok_tovarov_zapreschennykh_exportu_iz_Korei_v_RF from "./files/spisok_tovarov_zapreschennykh_exportu_iz_Korei_v_RF.pdf";
import Spisok_tovarov_zapreschennykh_k_exportu_iz_Yaponii_v_RF from "./files/Spisok_tovarov_zapreschennykh_k_exportu_iz_Yaponii_v_RF.pdf";
import UK_common_military_list__dual_use from "./files/UK_common_military_list__dual-use.pdf";
import UK_High_Priority_Items from "./files/UK_High_Priority_Items.pdf";
import zakon_po_programme_kotorogo_v_osnovnom_vnosyat_lits_EO14024 from "./files/zakon_po_programme_kotorogo_v_osnovnom_vnosyat_lits_EO14024.pdf";

export const Info: Array<{
  country: string;
  docs: Array<{ name: string; src?: string }>;
  references: Array<{ name: string; link?: string }>;
}> = [
  {
    country: "ЕС",
    docs: [
      {
        name: "Ограничения ЕС против РФ EU 833/2014",
        src: ogranichenia_ES_po_RF_EU_833_2014,
      },
      {
        name: "Ограничения ЕС против Беларуси EU 765/2006",
        src: ogranichenia_ES_po_Belarusi_EU_765_2006,
      },
      {
        name: "Ограничения ЕС по новым территориям РФ EU 263/2022",
        src: ogranichenia_po_novym_territoriam_RF_EU_263_2022,
      },

      {
        name: "FAQ по ограничениям ЕС против РФ",
        src: FAQ_po_ogranicheniam_ES_protiv_RF,
      },
      {
        name: "EU common military list",
        src: EU_common_military_list,
      },
      {
        name: "EU dual-use items",
        src: EU_dual_use_items,
      },
      {
        name: "EU high priority items",
        src: EU_high_priority_items,
      },
    ],
    references: [
      {
        name: "Ссылка на официальный журнал, где публикуются все-все обновления",
        link: "https://eur-lex.europa.eu/oj/direct-access.html",
      },
      {
        name: "Больше ограничений со стороны ЕС по РФ",
        link: "https://eur-lex.europa.eu/EN/legal-content/summary/eu-restrictive-measures-in-view-of-russia-s-invasion-of-ukraine.html",
      },
      {
        name: "Поиск по EU asset freeze",
        link: "https://www.sanctionsmap.eu/#/main",
      },
      {
        name: "Неплохой источник по отслеживанию новых вводимых ограничений со стороны ЕС",
        link: "https://www.ashurst.com/en/insights/eu-sanctions/",
      },
    ],
  },
  {
    country: "США",
    docs: [
      {
        name: "Ограничения по импорту/экспорту EO14068",
        src: ogranichenia_po_importu_exportu_EO14068,
      },
      {
        name: "Ограничения по импорту EO14066",
        src: ogranichenia_po_importu_v_SShA_EO14066,
      },
      {
        name: "Determination items to section 11(a)(ii) EO14024",
        src: determination_items_to_section_11_a_ii_EO14024,
      },
      {
        name: "Закон, по программе которого в основном вносят лиц EO14024",
        src: zakon_po_programme_kotorogo_v_osnovnom_vnosyat_lits_EO14024,
      },
      {
        name: "Price cap determination",
        src: Price_cap_determination,
      },
      {
        name: "BIS High Priority Items",
        src: BIS_High_Priority_Items,
      },
      {
        name: "BIS export control Items (Dual-use)",
        src: BIS_export_control_Items_Dual_use,
      },
      {
        name: "BIS Russia and Belarus restrictions (list of goods)",
        src: BIS_Russia_and_Belarus_restrictions_list_of_goods,
      },
    ],
    references: [
      {
        name: "Отслеживание последний изменений и обновлений со стороны OFAC",
      },
      {
        name: "Основная программа, по которой вводятся ограничения",
        link: "https://ofac.treasury.gov/sanctions-programs-and-country-information/russian-harmful-foreign-activities-sanctions",
      },
      {
        name: "Поиск по SDN лицам",
        link: "https://sanctionslist.ofac.treas.gov/Home/index.html",
      },
      {
        name: "Если вы не знаете свой код, можно попробовать найти примерный на этом сайте (просто вводите ключевые слова и доп пояснения, который просит сайт)",
        link: "https://uscensus.prod.3ceonline.com/#!#current-question-pos",
      },
    ],
  },
  {
    country: "Великобритания",
    docs: [
      {
        name: "Основной закон, который вводит ограничения EU Exit Regulations 2019",
        src: osnovnoy_zakon_kotory_vvodit_ogranichenia_EU_Exit_Regulations_2019,
      },
      {
        name: "UK High Priority Items",
        src: UK_High_Priority_Items,
      },
      {
        name: "UK common military list + dual-use",
        src: UK_common_military_list__dual_use,
      },
    ],
    references: [
      {
        name: "Поиск по UK asset freeze",
        link: "https://sanctionssearchapp.ofsi.hmtreasury.gov.uk/",
      },
    ],
  },
  {
    country: "Япония",
    docs: [
      {
        name: "Список товаров, запрещенных к экспорту из Японии в РФ",
        src: Spisok_tovarov_zapreschennykh_k_exportu_iz_Yaponii_v_RF,
      },
    ],
    references: [],
  },
  {
    country: "Южная Корея",
    docs: [
      {
        name: "Список товаров, запрещенных к экспорту из Южной Кореи в РФ",
        src: spisok_tovarov_zapreschennykh_exportu_iz_Korei_v_RF,
      },
    ],
    references: [],
  },
  {
    country: "Австралия",
    docs: [
      {
        name: "Export Sanctioned goods to Russia",
        src: Export_Sanctioned_goods_to_Russia,
      },
      {
        name: "Import Sanctioned goods from Russia",
        src: Import_Sanctioned_goods_from_Russia,
      },
    ],
    references: [
      {
        name: "Подробнее об ограничения со стороны Австралии и текущих режимах",
        link: "https://www.dfat.gov.au/international-relations/security/sanctions/sanctions-regimes/russia-sanctions-regime",
      },
    ],
  },
  {
    country: "Китай",
    docs: [
      {
        name: "China export control items",
        src: China_export_control_items,
      },
    ],
    references: [],
  },
];
