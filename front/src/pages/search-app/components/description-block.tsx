import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { IconButton, Box, Collapse, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { theme } from "shared/theme";

const colorHighlight = (window as any).Highlight
  ? new (window as any).Highlight()
  : null;

if (colorHighlight) (CSS as any).highlights.set(`higlight`, colorHighlight);

export const DescriptionBlock = ({
  description,
  matchedWords,
}: {
  description: string;
  matchedWords: Array<string>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState<boolean>(true);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const maxHeight = 198;
  const [isDescriptionOnScreen, setIsDescriptionOnScreen] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

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
      const matches = Array.from(description.matchAll(regex));

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
  }, [description, matchedWords, isDescriptionOnScreen]);

  return (
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
          {description}
        </Typography>
      </Collapse>
      {isOverflow && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            background: expanded
              ? undefined
              : "linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent)",
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            pointerEvents: "none",
          }}
        >
          <IconButton
            onClick={toggleExpand}
            color="primary"
            size="small"
            sx={{ pointerEvents: "auto", padding: 0 }}
          >
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
