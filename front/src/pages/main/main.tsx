import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import MainBackImage from "./images/back-image.jpg";
import SanctionsImage from "./images/sanctions.jpg";
import GlobalisationImage from "./images/globalisation.jpeg";
import { theme } from "shared/theme";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate } from "react-router";
import { Paths } from "shared/paths";
import { HightlightPluses } from "components";
import { adjustAppHeight } from "@master_kufa/client-tools";

const ServicesCard = ({
  title,
  description,
  imgPath,
  path,
}: {
  title: string;
  description?: string;
  imgPath?: string;
  path: string;
}) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ flexGrow: 1 }}>
      <CardActionArea>
        {imgPath && <CardMedia component="img" height="160" image={imgPath} />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={() => navigate(path)} size="small" color="primary">
          Подробнее
        </Button>
      </CardActions>
    </Card>
  );
};

export const Main = () => (
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
      }}
    >
      <img
        src={MainBackImage}
        style={{
          position: "absolute",
          width: "100%",
          objectFit: "cover",
          height: "100%",
        }}
      />
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
        variant="h2"
        sx={{
          position: "relative",
          textAlign: "center",
          color: theme.palette.primary.main,
          mr: 5,
          ml: 5,
          mt: 4,
        }}
      >
        All the right moves, all the right decisions
      </Typography>
      <Box
        sx={{
          position: "relative",
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
          <b>Рады приветствовать Вас на Нашем портале!</b>
          <br /> <br />
          Мы <b>новая, динамично развивающаяся</b> компания в сфере оказания
          консультационных услуг и предоставлении программных продуктов,
          связанных <b>с оценкой и анализом санкционного риска.</b> <br />{" "}
          <br /> Наша команда состоит из людей, который прошли весь путь с
          начала введения обширных санкций со стороны иностранных государств,
          находясь у истоков{" "}
          <b>
            составления политик и подходов по минимизации санкционных рисков
          </b>{" "}
          в крупнейших европейских и национальных банковских структурах и
          компаниях. <br /> <br />
          Мы ставим перед собой амбициозную задачу{" "}
          <b>
            облегчить нашим клиентам ведение ВЭД путем тщательного анализа
            санкционного риска
          </b>{" "}
          на каждом из этапов.
        </Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          mr: 2,
          ml: 2,
          mt: 4,
          mb: 4,
        }}
      >
        {[
          "Полный спектр услуг по сопровождению платежей в части санкционного комплаенса",
          "Услуги по составлению санкционного профиля компании, сделки",
          "Помощь в поиске наиболее доступного и наименее рискового способа оплаты и доставки товаров",
          "Иные услуги, связанные с оценкой и уменьшением санкционного риска",
          "Самый полный и наиболее продвинутый онлайн-ресурс, который позволяет узнать действующие импортно-экспортные ограничения в отношении товаров",
        ].map((text) => (
          <Box
            key={text}
            sx={{
              textAlign: "center",
              minWidth: "200px",
              maxWidth: "300px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
              borderRadius: 2,
              background: alpha(theme.palette.secondary.dark, 0.6),
              color: theme.palette.secondary.light,
              p: 2,
            }}
          >
            <ThumbUpIcon sx={{ justifySelf: "flex-start", mb: "auto" }} />
            <Typography sx={{ mb: "auto" }} variant="body1">
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
    <Box
      sx={{
        p: 4,
        maxWidth: "1620px",
        mr: "auto",
        ml: "auto",
      }}
    >
      <Box
        sx={{
          p: 4,
          background: alpha(theme.palette.secondary.main, 0.5),
          borderRadius: 4,
        }}
      >
        <Typography
          sx={{
            mb: 4,
            color: theme.palette.primary.main,
          }}
          variant="h3"
        >
          Услуги
        </Typography>

        <ServicesCard
          path={Paths.search_app}
          title="Поисковик"
          description="Поиск товаров по санкционным ограничениям"
          imgPath={SanctionsImage}
        />
        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            width: "100%",
            justifyItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          <ServicesCard
            path={Paths.servicesCompanies}
            title="Юридическим лицам"
          />
          <ServicesCard
            path={Paths.servicesCompanies}
            title="Индивидуальным предпринимателям"
          />
          <ServicesCard path={Paths.servicesPrivate} title="Физическим лицам" />
        </Box>
      </Box>
    </Box>
    <Box sx={{ position: "relative" }}>
      <img
        src={GlobalisationImage}
        style={{
          position: "absolute",
          width: "100%",
          objectFit: "cover",
          height: "100%",
          filter: "blur(5px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.grey[900],
          opacity: 0.8,
        }}
      />
      <Box sx={{ p: 8, position: "relative" }}>
        <Typography
          sx={{
            mb: 4,
            color: theme.palette.primary.main,
          }}
          variant="h3"
        >
          Почему мы?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {[
            <>
              <HightlightPluses>Более пяти лет опыта</HightlightPluses> в
              банковском комплаенс и{" "}
              <HightlightPluses>более 3 лет опыта</HightlightPluses> в сфере
              санкционного права
            </>,
            <>
              Оперативное предоставление{" "}
              <HightlightPluses>наиболее верного решения</HightlightPluses> on
              case-by-case basis
            </>,
            <>
              Необходимые и достаточные шаги для{" "}
              <HightlightPluses>
                получения положительного результата и экономии вашего бюджета
              </HightlightPluses>
            </>,
          ].map((text, inx) => (
            <Box
              key={inx}
              sx={{
                background: theme.palette.secondary.dark,
                borderRadius: 4,
                p: 2,
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: theme.palette.secondary.light }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);
