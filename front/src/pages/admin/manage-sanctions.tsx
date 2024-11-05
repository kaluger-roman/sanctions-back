import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  fileChanged,
  updateDB,
} from "models/manage-sanctions/manage-sanctions.model";
import { useUnit } from "effector-react";
import { manageSanctionsModel } from "models";

export const ManageSanctions = () => {
  const file = useUnit(manageSanctionsModel.$selectedFileDB);

  return (
    <Box>
      <Typography sx={{ mb: 2 }} variant="h5">
        База санкций
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Select file
          <input
            hidden
            type="file"
            onChange={(e) => e.target.files && fileChanged(e.target.files[0])}
            accept=".xls,.xlsx"
          />
        </Button>
        {file && (
          <Typography variant="body2">
            {file?.name}({file?.size} bytes)
          </Typography>
        )}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          disabled={!file}
          onClick={() => updateDB()}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};
