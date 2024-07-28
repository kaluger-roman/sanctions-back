import { Box, Chip, IconButton } from "@mui/material";
import { theme } from "shared/theme";
import EditIcon from "@mui/icons-material/Edit";

export const DataChip = ({
  label = "",
  value = "",
  placeholder = "Не указано",
  isEditable,
  isEditSpacePreserve = true,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  isEditable?: boolean;
  isEditSpacePreserve?: boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      alignItems: "stretch",
      justifyContent: "center",
      width: "100%",
    }}
  >
    <Chip
      sx={{
        flexBasis: "50%",
        textAlign: "center",
        height: "auto",
        p: "6px",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
      label={label}
    />
    <Chip
      label={value || placeholder}
      variant="outlined"
      sx={{
        flexBasis: "50%",
        color: !value ? theme.palette.grey[500] : theme.palette.text.primary,
        textAlign: "center",
        height: "auto",
        p: "6px",
        "& .MuiChip-label": {
          display: "block",
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
    />
    <IconButton
      size="small"
      sx={{
        visibility: isEditable ? "visible" : "hidden",
        display: isEditSpacePreserve ? "block" : "none",
      }}
    >
      <EditIcon />
    </IconButton>
  </Box>
);
