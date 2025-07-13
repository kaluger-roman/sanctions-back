import { Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { searchAppModel } from "models";
import { isSearchEmpty } from "shared/search";

export const EmptySearch = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);
  const isSearchHappened = useUnit(searchAppModel.$isSearchHappened);
  const searchTags = useUnit(searchAppModel.$searchTags);

  return (
    <>
      {isSearchHappened &&
        isSearchEmpty(searchResult) &&
        (searchTags.length ? (
          <Typography variant="body1">
            Совпадений с базой не обнаружено, товар несанкционный
          </Typography>
        ) : (
          <Typography variant="body1">
            Введите хотя бы один поисковый код / описание
          </Typography>
        ))}
    </>
  );
};
