import { AutoLogout } from "./auto-logout";
import { ExistedSessionAuth } from "./existed-session";
import { ForceLogout } from "./force-logout";

export const SessionControls = () => {
  return (
    <>
      <AutoLogout />
      <ExistedSessionAuth />
      <ForceLogout />
    </>
  );
};
