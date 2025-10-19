import { Box, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { theme } from "shared/theme";
import { TranslateSelector } from "./translate-selector";
import { ExpandDescriptionButton } from "./expand-description-button";
import { Lang } from "shared/search";
import { useUnit } from "effector-react";
import { searchAppModel } from "models";
import { SearchCategory } from "models/search-app/search-app";

const colorHighlight = (window as any).Highlight
  ? new (window as any).Highlight()
  : null;

if (colorHighlight) (CSS as any).highlights.set(`higlight`, colorHighlight);

export const DescriptionBlock = ({
  description,
  descriptionRussian,
  matchedWords,
}: {
  description: string;
  descriptionRussian?: string;
  matchedWords?: Array<string>;
}) => {
  const searchLanguage = useUnit(searchAppModel.$searchLanguage);
  const searchPending = useUnit(searchAppModel.$searchPending);
  const searchCategory = useUnit(searchAppModel.$searchCategory);
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState<Lang>(searchLanguage);
  const [isOverflow, setIsOverflow] = useState<boolean>(true);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxHeight = 198;
  const [availableHeight, setAvailableHeight] = useState<number>(maxHeight);
  const [isDescriptionOnScreen, setIsDescriptionOnScreen] = useState(false);
  const translatedDescription =
    searchCategory === SearchCategory.sanctions
      ? { [Lang.en]: description, [Lang.ru]: descriptionRussian }[lang] ??
        description
      : description;

  const toggleExpand = () => setExpanded((prev) => !prev);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (!searchPending) {
      setLang(searchLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPending]);

  useLayoutEffect(() => {
    if (!highlightRef.current) return;

    setIsOverflow(highlightRef.current.scrollHeight > maxHeight);
  }, [highlightRef]);

  // Observe table cell size changes when row height changes
  useLayoutEffect(() => {
    const container = containerRef.current;
    const textElement = highlightRef.current;
    if (!container || !textElement) return;

    // Find the table cell parent
    let tableCell = container.parentElement;
    while (tableCell && tableCell.tagName !== "TD") {
      tableCell = tableCell.parentElement;
    }

    if (!tableCell) return;

    const checkOverflow = async () => {
      // Skip if we're animating from user interaction
      if (!textElement || !tableCell) return;

      const cellHeight = tableCell.clientHeight;
      const newAvailableHeight = Math.max(maxHeight, cellHeight - 50);

      // Update available height without transition
      if (container) {
        container.style.transition = "none";
        setAvailableHeight(newAvailableHeight);

        // Force reflow
        void container.offsetHeight;
      }

      // Check if content overflows the new available height
      const newIsOverflow = textElement.scrollHeight > newAvailableHeight;

      setIsOverflow((prevOverflow) => {
        if (prevOverflow === newIsOverflow) return prevOverflow;

        // Auto-collapse if content now fits
        if (!newIsOverflow && expanded) {
          setExpanded(false);
        }

        return newIsOverflow;
      });
    };

    const resizeObserver = new ResizeObserver(checkOverflow);

    // Observe the table cell for size changes
    resizeObserver.observe(tableCell);

    // Initial check
    checkOverflow();

    return () => {
      resizeObserver.disconnect();
    };
  }, [expanded, maxHeight]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isDescriptionOnScreen) {
          setIsDescriptionOnScreen(true);
        }

        if (!entries[0].isIntersecting && isDescriptionOnScreen) {
          setIsDescriptionOnScreen(false);
        }
      },
      { threshold: [0] },
    );

    if (highlightRef.current) observer.observe(highlightRef.current);

    return () => {
      if (highlightRef.current) observer.unobserve(highlightRef.current);

      observer.disconnect();
    };
  }, [highlightRef, isDescriptionOnScreen]);

  useEffect(() => {
    const text = highlightRef.current?.firstChild;
    if (
      !(CSS as any).highlights ||
      !text ||
      !matchedWords ||
      !isDescriptionOnScreen
    )
      return;

    const ranges: Array<Range> = [];

    for (let word of matchedWords) {
      const regex = new RegExp(
        word.replaceAll(/[#-.]|[[-^]|[?|{}]/g, "\\$&"),
        "g",
      );
      const matches = Array.from(translatedDescription.matchAll(regex));

      for (let match of matches) {
        const range = new Range();

        range.setStart(text, match.index as number);
        range.setEnd(text, (match.index as number) + match[0].length);
        ranges.push(range);
        colorHighlight.add(range);
      }
    }

    return () => {
      ranges.forEach((range) => colorHighlight.delete(range));
    };
  }, [translatedDescription, matchedWords, isDescriptionOnScreen]);

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          maxHeight: expanded || !isOverflow ? "none" : availableHeight,
          transition: isFirstRender ? "none" : "max-height 0.3s ease",
        }}
      >
        <Typography
          ref={highlightRef}
          variant="body2"
          sx={{
            mr: 1,
            verticalAlign: "top",
            whiteSpace: "pre-wrap",
            "::highlight(higlight)": {
              background: theme.palette.primary.light,
            },
          }}
        >
          {translatedDescription}
        </Typography>
      </Box>
      {descriptionRussian && searchCategory === SearchCategory.sanctions ? (
        <TranslateSelector lang={lang} setLang={setLang} />
      ) : null}
      {isOverflow && (
        <ExpandDescriptionButton
          expanded={expanded}
          toggleExpand={toggleExpand}
        />
      )}
    </>
  );
};
