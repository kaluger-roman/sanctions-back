import { useLocation, useNavigate } from "react-router-dom";

type Location = ReturnType<typeof useLocation>;
type NavigationType = {
  navigate: ReturnType<typeof useNavigate>;
  location: Location;
};

export const navigation: NavigationType = {
  navigate: () => null,
  location: {} as Location,
};

export const useInitNavigation = () => {
  navigation.location = useLocation();
  navigation.navigate = useNavigate();
};
