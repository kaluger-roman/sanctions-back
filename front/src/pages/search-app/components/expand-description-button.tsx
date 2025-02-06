import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { alpha, Box, IconButton } from "@mui/material";
import { theme } from "shared/theme";

export const ExpandDescriptionButton = ({
  expanded,
  toggleExpand,
}: {
  expanded: boolean;
  toggleExpand: () => void;
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 4,
        right: 4,
        background: expanded
          ? undefined
          : `linear-gradient(to top, ${alpha(
              theme.palette.background.paper,
              0.9,
            )} 60%, ${alpha(
              theme.palette.background.paper,
              0.5,
            )} 90%, transparent 100%)`,
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
  );
};
