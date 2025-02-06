import { Box, Stack, Typography, alpha } from "@mui/material";
import { theme } from "shared/theme";
import OfficeBackImage from "./images/office.jpg";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import { adjustAppHeight } from "@master_kufa/client-tools";

export const CompanyClients = ({ isCorporate }: { isCorporate?: boolean }) => (
  <Box>
    <Stack
      sx={{
        minHeight: `calc(${adjustAppHeight()} - 60px)`,
        height: "fit-content",
        width: "100%",
        position: "relative",
        cursor: "default",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundAttachment: "fixed",

        backgroundImage: `url(${OfficeBackImage})`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.grey[900],
          opacity: 0.8,
        }}
      />
      <Typography
        variant="h3"
        sx={{
          position: "relative",
          textAlign: "center",
          color: theme.palette.primary.main,
          mr: 4,
          ml: 4,
          mt: 4,
        }}
      >
        {isCorporate ? "Корпоративным" : "Частным"} клиентам
      </Typography>
      <Box
        sx={{
          zIndex: 1,
          p: 2,
          background: alpha(theme.palette.secondary.light, 0.6),
          borderRadius: 4,
          maxWidth: "1200px",
          mr: 2,
          ml: 2,
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.palette.primary.dark, textAlign: "center" }}
        >
          <b>Уважаемые клиенты!</b>
          <br /> <br />В последнее время каждый из нас так или иначе сталкивался
          с таким термином как <b>«санкции»</b>, это слово стало практически
          неотъемлемой частью нашей жизни. Компании в России стали все чаще и
          чаще сталкиваться с проблемами покупки различных товаров иностранного
          производства, так как многие компании разрывают отношения и приходится
          искать <b>новые пути</b>, а большинство банков попало под ограничения
          и больше не могут вести свою деятельность так, как это было ранее.
          <br />
          <br />
          Однако в текущем мире по-прежнему можно и нужно продолжать вести свою
          деятельность и развиваться. Именно для этого и была создана наша
          компания. Мы ставим перед собой задачу{" "}
          <b>
            развеять любую неопределенность в ведении бизнеса в условиях
            санкций, дать четкие и действенные рекомендации
          </b>
          , какие необходимо предпринять шаги, чтобы Ваш бизнес продолжал вести
          непрерывную и прибыльную деятельность.
        </Typography>
      </Box>

      <Typography
        variant="h3"
        sx={{
          position: "relative",
          textAlign: "center",
          color: theme.palette.primary.main,
          mr: 5,
          ml: 5,
          mt: 8,
        }}
      >
        Оказывамые услуги
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          p: 4,
        }}
        position="relative"
      >
        {(isCorporate
          ? [
              "Cоставление санкционного профиля компании в рамках международных и российских ограничений",
              "Cопровождение международных сделок по покупке/продаже товаров, услуг, долей компании и тд с целью минимизации санкционного риска",
              "Анализ возможности получения финансирования в различных банках РФ по международному проекту (открытие кредитной, фаткоринговой линии и тд)",
              "Помощь в открытии расчетных счетов в различных валютах в кредитных организациях РФ",
              "Анализ валютных контрактов и различных документарных продуктов по сделке",
              "Анализ правовых и репутационных рисков в случае совершения того или иного действия",
              "Также наш опыт построения compliance в кредитных организациях помогает нам с нуля построить санкционный комплаенс в организации",
            ]
          : [
              "Консультации по возможности покупки/продажи того или иного актива (товар, недвижимость, услуга) у иностранного контрагента",
              "Помощь в открытии валютных счетов и проведении расчетов",
              "Консультирование по вопросам санкций",
            ]
        ).map((text, inx) => (
          <Box
            key={inx}
            sx={{
              background: theme.palette.secondary.dark,
              borderRadius: 4,
              p: 2,
              flexGrow: 1,
              textAlign: "center",
              maxWidth: "300px",
              alignItems: "center",
              display: "flex",
              color: theme.palette.secondary.light,
              flexDirection: "column",
            }}
          >
            <MiscellaneousServicesIcon fontSize="large" />
            <Typography sx={{ mt: "auto", mb: "auto" }} variant="h6">
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        sx={{
          position: "relative",
          textAlign: "center",
          m: 4,
          color: theme.palette.primary.dark,
          p: 2,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.secondary.main, 0.7),
        }}
        variant="h6"
      >
        Мы занимаемся описанными выше услугами и не только! Напишите нам, если
        Вас интересует любой вопрос связанный с санкциями, мы дадим
        высококвалифицированный и четкий ответ в кратчайшие сроки.
      </Typography>
    </Stack>
  </Box>
);
