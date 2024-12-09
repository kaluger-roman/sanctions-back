import { Box, Link, Typography } from "@mui/material";
import { theme } from "shared/theme";
import { Info } from "./constants";
import { DocumentFile } from "./document";
import { profileModel } from "models";
import { useUnit } from "effector-react";
import { TarrifKind } from "shared/billing";
import { PlaceholderRef } from "./placeholder";

export const References = () => {
  const currentTarrif = useUnit(profileModel.$currentTarrif);

  const isFree =
    !currentTarrif || currentTarrif?.tarrif.identifier === TarrifKind.free;

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        pt: 4,
        pb: 4,
        minHeight: "calc(100vh - 230px)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          minWidth: 300,
          margin: "auto",
          borderRadius: 4,
          p: 2,
          background: theme.palette.secondary.light,
        }}
      >
        <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
          Полезные ссылки и файлы
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: theme.palette.secondary.dark, mt: 2 }}
        >
          <b>Важно!</b> Подборка в первую очередь нацелена на анализ товаров и
          услуг! Выбрано самое необходимое!
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: theme.palette.primary.main, mt: 2 }}
          >
            Рекомендации по анализу товаров и услуг
          </Typography>
          {isFree ? (
            <PlaceholderRef count={1} name="Файлов" />
          ) : (
            <Box sx={{ width: "30%", mt: 2 }}>
              <DocumentFile header="Рекомендации" docSrc={""} />
            </Box>
          )}
        </Box>
        {Info.map((item) => (
          <Box key={item.country} sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: theme.palette.primary.main, mt: 2 }}
            >
              {item.country}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: theme.palette.secondary.dark, mt: 2, mb: 2 }}
            >
              Документы:
            </Typography>
            {isFree ? (
              <PlaceholderRef count={item.docs.length} name="Файлов" />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1,
                }}
              >
                {item.docs.map((doc) => (
                  <DocumentFile
                    key={doc.name}
                    header={doc.name}
                    docSrc={doc.src || ""}
                  />
                ))}
              </Box>
            )}
            {item.references.length > 0 && (
              <>
                {" "}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: theme.palette.secondary.dark, mt: 2, mb: 2 }}
                >
                  Ссылки:
                </Typography>
                {isFree ? (
                  <PlaceholderRef
                    count={item.references.length}
                    name="Ссылок"
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {item.references.map((ref) => (
                      <Box key={ref.name} sx={{ minWidth: 300 }}>
                        <Link target="_blank" href={ref.link}>
                          <Typography
                            variant="h6"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            {ref.name}
                          </Typography>
                        </Link>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
