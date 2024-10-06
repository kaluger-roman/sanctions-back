import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Link,
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
          <b>Good Sanction Check</b> – онлайн-проект, созданный энтузиастами с{" "}
          <b>
            многолетним опытом в сфере комплаенса и санкционного консалтинга.
          </b>
          <br /> <br /> Нашей основной задачей является предоставление
          консультаций и программных продуктов для <b>упрощения ведения ВЭД</b>{" "}
          как юридическим, так и физическим лицам. <br /> <br />
          Доверяя нашему опыту, приобретенному в процессе создания внутренних
          бизнес-процессов и методологий оценки санкционных рисков для
          крупнейших европейских и российских банковских структур и частных
          компаний, вы легко сможете{" "}
          <b>
            минимизировать влияние санкций на свой бизнес и избежать
            значительных финансовых затрат во время торговли с иностранными
            контрагентами.
          </b>
        </Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: 1200,
          mr: 2,
          ml: 2,
          mt: 4,
          mb: 4,
        }}
      >
        {[
          "Полный спектр услуг по сопровождению отдельных контрактов/платежей в части оценки санкционного риска сделки on case-by-case basis",
          "Услуги по составлению санкционного профиля компании, с указанием возможных действий для уменьшения санкционных рисков",
          "Помощь в поиске наиболее доступного способа оплаты и доставки товаров до места назначения",
          <>
            Постоянно обновляемая, простая для использования и наиболее полная
            база данных для{" "}
            <Link href={Paths.search_app}>поиска санкционных товаров</Link>, с
            возможностью разработки и предоставления решения под ключ для ваших
            внутренних систем проверки
          </>,
        ].map((text, inx) => (
          <Box
            key={inx}
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
    </Box>
  </Box>
);
