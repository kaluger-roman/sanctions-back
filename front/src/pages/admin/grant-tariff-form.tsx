import { useUnit } from "effector-react";
import { grantTarrifModel, manageTarrifsModel } from "models";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { TarrifKind } from "shared/billing";
import {
  CategoryNames,
  TarrifCategories,
  TarrifNames,
} from "pages/billing/constants";

export const GrantTariffForm = () => {
  const userTariffs = useUnit(grantTarrifModel.$userTariffs);
  const email = useUnit(grantTarrifModel.$email);
  const tariffId = useUnit(grantTarrifModel.$tarrifId);
  const endDate = useUnit(grantTarrifModel.$endDate);
  const tarrifs = useUnit(manageTarrifsModel.$tarrifs);

  return (
    <Box>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Выдать тариф
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl required fullWidth>
          <InputLabel>Пользователь</InputLabel>
          <Select
            value={email}
            onChange={(e) => grantTarrifModel.emailChanged(e.target.value)}
            displayEmpty
            label="Пользователь"
          >
            {userTariffs.map((user) => (
              <MenuItem key={user.user.email} value={user.user.email}>
                {user.user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl required fullWidth>
          <InputLabel>Тариф</InputLabel>
          <Select
            label="Тариф"
            value={tariffId}
            onChange={(e) =>
              grantTarrifModel.tarrifIdChanged(e.target.value as TarrifKind)
            }
          >
            {tarrifs
              .filter((tarrif) => tarrif.identifier !== TarrifKind.free)
              .map((tarrif) => (
                <MenuItem
                  disabled={
                    tarrif.identifier !== TarrifKind.demoPro &&
                    TarrifCategories[tarrif.identifier] !==
                      userTariffs.find((user) => user.user.email === email)
                        ?.user.category
                  }
                  key={tarrif.identifier}
                  value={tarrif.identifier}
                >
                  {TarrifNames[tarrif.identifier]}
                  {` - ${
                    CategoryNames[
                      TarrifCategories[
                        tarrif.identifier
                      ] as keyof typeof CategoryNames
                    ] || "Все"
                  }`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Дата окончания (UTC)"
          value={`${endDate?.toISOString().split("T")[0]}`}
          onChange={(e) => {
            grantTarrifModel.endDateChanged(new Date(e.target.value));
          }}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Button
        disabled={!email || !tariffId}
        variant="contained"
        onClick={() => grantTarrifModel.grantUserTariff()}
      >
        Выдать
      </Button>
    </Box>
  );
};
