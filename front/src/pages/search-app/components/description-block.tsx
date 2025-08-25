import { Box, Collapse, Typography } from "@mui/material";
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
  descriptionRussian: string;
  matchedWords: Array<string>;
}) => {
  const searchLanguage = useUnit(searchAppModel.$searchLanguage);
  const searchPending = useUnit(searchAppModel.$searchPending);
  const searchCategory = useUnit(searchAppModel.$searchCategory);
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState<Lang>(searchLanguage);
  const [isOverflow, setIsOverflow] = useState<boolean>(true);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const maxHeight = 198;
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
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Collapse
          in={!isOverflow || expanded}
          collapsedSize={isOverflow ? maxHeight : undefined}
          timeout={isFirstRender ? 0 : 300}
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
        </Collapse>
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
