import { Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { searchAppModel } from "models";
import { SearchCategory } from "models/search-app/search-app";
import { isSearchEmpty, isCounterSanctionSearchEmpty } from "shared/search";

export const EmptySearch = () => {
  const searchResult = useUnit(searchAppModel.$searchResult);
  const counterSanctionSearchResult = useUnit(
    searchAppModel.$counterSanctionSearchResult,
  );
  const searchCategory = useUnit(searchAppModel.$searchCategory);
  const isSearchHappened = useUnit(searchAppModel.$isSearchHappened);
  const searchTags = useUnit(searchAppModel.$searchTags);

  const isSanctions = searchCategory === SearchCategory.sanctions;
  const currentResultIsEmpty = isSanctions
    ? isSearchEmpty(searchResult)
    : isCounterSanctionSearchEmpty(counterSanctionSearchResult);

  return (
    <>
      {isSearchHappened &&
        currentResultIsEmpty &&
        (searchTags.length ? (
          <Typography variant="body1">
            {isSanctions
              ? "Совпадений с базой не обнаружено, товар несанкционный"
              : "Совпадений с базой контрсанкций не обнаружено"}
          </Typography>
        ) : (
          <Typography variant="body1">
            Введите хотя бы один поисковый код / описание
          </Typography>
        ))}
    </>
  );
};
