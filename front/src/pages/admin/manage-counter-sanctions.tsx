import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  counterSanctionsFileChanged,
  updateCounterSanctionsDB,
} from "models/manage-sanctions/manage-counter-sanctions.model";
import { useUnit } from "effector-react";
import { manageCounterSanctionsModel } from "models";

export const ManageCounterSanctions = () => {
  const file = useUnit(
    manageCounterSanctionsModel.$selectedCounterSanctionsFileDB,
  );

  return (
    <Box>
      <Typography sx={{ mb: 2 }} variant="h5">
        База контрсанкций
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Выбрать файл
          <input
            hidden
            type="file"
            onChange={(e) =>
              e.target.files && counterSanctionsFileChanged(e.target.files[0])
            }
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
          onClick={() => updateCounterSanctionsDB()}
        >
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};
