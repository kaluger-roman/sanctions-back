import { Box, Chip, IconButton, TextField } from "@mui/material";
import { theme } from "shared/theme";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { profileModel } from "models";

export const DataChip = ({
  label = "",
  value = "",
  placeholder = "Не указано",
  isEditable,
  isEditSpacePreserve = true,
  onChange,
  validate,
  id,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  isEditable?: boolean;
  isEditSpacePreserve?: boolean;
  onChange?: (value: string) => void;
  validate?: (value: string) => string;
  id: string;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");

  const [innerValue, setInnerValue] = useState(value);

  return (
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
      {isEdit ? (
        <TextField
          size="small"
          sx={{ flexBasis: "50%" }}
          variant="standard"
          error={!!error}
          onBlur={(e) => {
            const err = validate?.(e.target.value) || "";

            setError(err);

            if (err) {
              profileModel.addEditErrorKey(id);
            } else {
              profileModel.removeEditErrorKey(id);
            }

            if (!error) {
              onChange?.(e.target.value);
            }
          }}
          helperText={error}
          value={innerValue}
          onChange={(e) => {
            setInnerValue?.(e.target.value);
          }}
        />
      ) : (
        <Chip
          label={value || placeholder}
          variant="outlined"
          sx={{
            flexBasis: "50%",
            color: !value
              ? theme.palette.grey[500]
              : theme.palette.text.primary,
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
      )}
      <IconButton
        size="small"
        onClick={() => setIsEdit(!isEdit)}
        disabled={Boolean(error && isEdit)}
        sx={{
          visibility: isEditable ? "visible" : "hidden",
          display: isEditSpacePreserve ? "block" : "none",
        }}
      >
        {isEdit ? <CheckIcon /> : <EditIcon />}
      </IconButton>
    </Box>
  );
};
