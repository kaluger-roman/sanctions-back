import { TableRow, TableCell, Link } from "@mui/material";
import { useEffect, useRef } from "react";
import { Sanction } from "shared/sanctions";
import { theme } from "shared/theme";

const colorHighlight = (window as any).Highlight
  ? new (window as any).Highlight()
  : null;

if (colorHighlight) (CSS as any).highlights.set(`higlight`, colorHighlight);

export const DataRow = ({
  code,
  sourceDocument,
  restriction,
  description,
  matchedWords,
  isLast,
}: Sanction & { isLast: boolean }) => {
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = highlightRef.current?.firstChild;
    if (!(CSS as any).highlights || !text || !matchedWords) return;

    for (let word of matchedWords) {
      const regex = new RegExp(
        word.replaceAll(/(^[^0-9a-zA-Zа-яА-Я]+)|([^0-9a-zA-Zа-яА-Я]+$)/g, ""),
        "g",
      );
      const matches = Array.from(description.matchAll(regex));

      for (let match of matches) {
        const range = new Range();

        range.setStart(text, match.index as number);
        range.setEnd(text, (match.index as number) + match[0].length);
        colorHighlight.add(range);
      }
    }

    return () => {
      colorHighlight.clear();
    };
  }, [description, matchedWords]);

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
        <Link href="#">{sourceDocument}</Link>
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>{restriction}</TableCell>
      <TableCell
        ref={highlightRef}
        sx={{
          verticalAlign: "top",
          "::highlight(higlight)": {
            background: theme.palette.primary.light,
          },
        }}
      >
        {description}
      </TableCell>
    </TableRow>
  );
};
