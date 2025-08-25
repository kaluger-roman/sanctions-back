import { TableRow, TableCell, Link } from "@mui/material";
import { Sanction } from "shared/sanctions";
import { CounterSanction } from "shared/counter-sanctions";
import { theme } from "shared/theme";
import { DescriptionBlock } from "./description-block";

type DataRowProps = (Sanction | CounterSanction) & {
  isLast: boolean;
  isCounterSanctions?: boolean;
};

export const DataRow = (props: DataRowProps) => {
  const {
    code,
    sourceDocument,
    restriction,
    description,
    matchedWords,
    isLast,
    isCounterSanctions = false,
  } = props;

  // Обрабатываем различные поля в зависимости от типа
  const sourceLink = "sourceLink" in props ? props.sourceLink : undefined;
  const descriptionRussian =
    "descriptionRussian" in props ? props.descriptionRussian : "";
  const exception = "exception" in props ? props.exception : "";

  return (
    <TableRow
      sx={{
        borderBottomColor: isLast
          ? "inherit"
          : `${theme.palette.grey[300]} !important`,
      }}
    >
      <TableCell sx={{ verticalAlign: "top" }}>{code}</TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        <Link target="_blank" href={sourceLink || "#"}>
          {sourceDocument}
        </Link>
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>{restriction}</TableCell>
      {isCounterSanctions && (
        <TableCell sx={{ verticalAlign: "top" }}>{exception}</TableCell>
      )}
      <TableCell sx={{ position: "relative", width: "50%", minWidth: 250 }}>
        <DescriptionBlock
          matchedWords={matchedWords}
          description={description}
          descriptionRussian={descriptionRussian}
        />
      </TableCell>
    </TableRow>
  );
};
