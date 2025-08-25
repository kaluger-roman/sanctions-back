import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import * as manageCounterSanctionsTarrifsModel from "models/manage-sanctions/manage-counter-sanctions-tarrifs.model";

const SourceSelect = ({
  label,
  selectedSources,
  onChange,
  sources,
}: {
  label: string;
  selectedSources: string[];
  onChange: (value: string[]) => void;
  sources: string[];
}) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      value={selectedSources}
      onChange={({ target }) => onChange(target.value as string[])}
      input={<OutlinedInput label={label} />}
      renderValue={(selected) => selected.join(", ")}
    >
      {sources.map((source) => (
        <MenuItem
          key={source}
          value={source}
          disabled={sources.indexOf(source) === -1}
        >
          <Checkbox checked={selectedSources.indexOf(source) > -1} />
          <ListItemText primary={source} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export const CounterSanctionTarrifManagement = () => {
  const sources = useUnit(
    manageCounterSanctionsTarrifsModel.$counterSanctionsSources,
  );
  const selectedFreeSources = useUnit(
    manageCounterSanctionsTarrifsModel.$selectedFreeCounterSanctionSources,
  );
  const selectedPaidSources = useUnit(
    manageCounterSanctionsTarrifsModel.$selectedPaidCounterSanctionSources,
  );

  return (
    <Box>
      <Typography sx={{ mb: 2 }} variant="h5">
        Управление тарифами контрсанкций
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: 300,
          flexDirection: "column",
        }}
      >
        <SourceSelect
          label="Источники бесплатного тарифа"
          selectedSources={selectedFreeSources}
          onChange={
            manageCounterSanctionsTarrifsModel.selectedFreeCounterSanctionSourcesChanged
          }
          sources={sources}
        />
        <SourceSelect
          label="Источники платного тарифа"
          selectedSources={selectedPaidSources}
          onChange={
            manageCounterSanctionsTarrifsModel.selectedPaidCounterSanctionSourcesChanged
          }
          sources={sources}
        />
        <Button
          onClick={() =>
            manageCounterSanctionsTarrifsModel.saveCounterSanctionsTarrifs()
          }
          sx={{ minWidth: 120 }}
          variant="contained"
        >
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};
