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
import { manageTarrifsModel, searchAppModel } from "models";

const CountrySelect = ({
  label,
  selectedCountries,
  onChange,
  countries,
}: {
  label: string;
  selectedCountries: string[];
  onChange: (value: string[]) => void;
  countries: string[];
}) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      value={selectedCountries}
      onChange={({ target }) => onChange(target.value as string[])}
      input={<OutlinedInput label={label} />}
      renderValue={(selected) => selected.join(", ")}
    >
      {countries.map((country) => (
        <MenuItem
          key={country}
          value={country}
          disabled={countries.indexOf(country) === -1}
        >
          <Checkbox checked={selectedCountries.indexOf(country) > -1} />
          <ListItemText primary={country} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export const TarrifManagement = () => {
  const countries = useUnit(searchAppModel.$countries);
  const selectedFreeCountries = useUnit(
    manageTarrifsModel.$selectedFreeCountries,
  );
  const selectedPaidCountries = useUnit(
    manageTarrifsModel.$selectedPaidCountries,
  );

  return (
    <Box>
      <Typography sx={{ mb: 2 }} variant="h5">
        Управление тарифами
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: 300,
          flexDirection: "column",
        }}
      >
        <CountrySelect
          label="Cтраны бесплатного тарифа"
          selectedCountries={selectedFreeCountries}
          onChange={manageTarrifsModel.selectedFreeCountriesChanged}
          countries={countries}
        />
        <CountrySelect
          label="Cтраны платного тарифа"
          selectedCountries={selectedPaidCountries}
          onChange={manageTarrifsModel.selectedPaidCountriesChanged}
          countries={countries}
        />
        <Button
          onClick={() => manageTarrifsModel.saveTarrifs()}
          sx={{ minWidth: 120 }}
          variant="contained"
        >
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};
