import {
  Box,
  Button,
  ClickAwayListener,
  Drawer,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { theme } from "shared/theme";
import { NAME_MAPPING } from "./navigation.constants";
import { navigation } from "shared/navigate";
import Logo from "shared/icons/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as VK } from "shared/icons/vk.svg";
import { ReactComponent as TG } from "shared/icons/telegram.svg";
import { useEffect, useRef, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  LinksLargeContainer,
  LinksSmallContainer,
  MediaLinksContainer,
  MenuPaperStyles,
  NavigationContainer,
  SmallMenuContainer,
} from "./navigation.styles";
import { LinkOption } from "./navigation.types";
import { Paths } from "shared/paths";
import { useUnit } from "effector-react";
import { appModel } from "models";
import { LogOut } from "models/app/app.model";

const Link = ({ name, path, subLinks, onClick }: LinkOption) => {
  const isMd = useMediaQuery(theme.breakpoints.down("lg"));
  const [isHovered, setIsHovered] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Button
        disableRipple={Boolean(subLinks)}
        key={path}
        variant="text"
        onClick={() => {
          onClick?.();
          isMd && setIsOpened(!isOpened);
          path && navigation.navigate(path);
        }}
        endIcon={
          subLinks &&
          (isMd && isOpened ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          ))
        }
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {name}
        {!isMd && subLinks && (
          <Popper
            id={name}
            open={isHovered}
            anchorEl={buttonRef.current}
            placement="bottom-start"
            sx={{ zIndex: 10 }}
          >
            <Paper sx={{ "& button": { justifyContent: "flex-start" } }}>
              <Stack>
                {subLinks &&
                  subLinks.map((link) => <Link key={link.name} {...link} />)}
              </Stack>
            </Paper>
          </Popper>
        )}
      </Button>
      {isMd && isOpened && subLinks && (
        <Stack
          sx={{
            mb: 3,
            mt: 1,
            background: theme.palette.grey[100],
            borderRadius: 2,
          }}
        >
          {subLinks &&
            subLinks.map((link) => <Link key={link.name} {...link} />)}
        </Stack>
      )}
    </>
  );
};

const Links = NAME_MAPPING.map((link) => <Link key={link.name} {...link} />);

export const Navigation = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isAccountOpened, setIsAccountOpened] = useState(false);
  const isMd = useMediaQuery(theme.breakpoints.down("lg"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const authorizationData = useUnit(appModel.$authorizationData);
  const accountRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!authorizationData) setIsAccountOpened(false);
  }, [authorizationData]);

  return (
    <Box sx={NavigationContainer({ isMd })}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img style={{ height: isMd ? 32 : 56 }} src={Logo} alt="Logo" />
        <Typography
          color={theme.palette.primary.main}
          variant={isSm ? "h6" : isMd ? "body1" : "h5"}
          fontWeight="bold"
        >
          Good Sanction Check
        </Typography>
      </Box>

      {isLg && (
        <>
          <Box sx={LinksLargeContainer}>
            {Links}{" "}
            <Box sx={{ ml: 1 }}>
              <Button
                onClick={() => navigation.navigate(Paths.billing)}
                variant="contained"
              >
                Оформить доступ
              </Button>
            </Box>
          </Box>
        </>
      )}

      <Box sx={MediaLinksContainer({ isMd })}>
        {!isSm && isMd && (
          <Button
            size="small"
            variant="contained"
            onClick={() => navigation.navigate(Paths.billing)}
          >
            Оформить доступ
          </Button>
        )}

        {!isSm && (
          <>
            <VK height="28px" cursor="pointer" />
            <TG height="28px" cursor="pointer" />
          </>
        )}

        <>
          <Tooltip title={authorizationData ? "Профиль" : "Вход"}>
            <IconButton
              ref={accountRef}
              sx={{ height: 36, width: 36 }}
              onClick={() => {
                if (authorizationData) {
                  setIsAccountOpened(!isAccountOpened);
                } else navigation.navigate(Paths.auth);
              }}
            >
              {authorizationData ? <AccountCircleIcon /> : <LoginIcon />}
            </IconButton>
          </Tooltip>
        </>
      </Box>
      {authorizationData && (
        <Popper
          id="account"
          open={isAccountOpened}
          anchorEl={accountRef.current}
          placement="bottom-start"
          sx={{ zIndex: 10 }}
        >
          <ClickAwayListener onClickAway={() => setIsAccountOpened(false)}>
            <Paper sx={{ "& button": { justifyContent: "flex-start" } }}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                >
                  {authorizationData.email}
                </Typography>
                {authorizationData.isAdmin && (
                  <Typography
                    variant="body2"
                    color={theme.palette.primary.main}
                  >
                    Администратор
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: 1 }}>
                <Button
                  sx={{ width: "100%" }}
                  onClick={() => navigation.navigate(Paths.profile)}
                >
                  Личный кабинет
                </Button>
                {authorizationData.isAdmin && (
                  <Button
                    sx={{ width: "100%" }}
                    onClick={() =>
                      navigation.navigate(Paths.resetSanctionsDatabase)
                    }
                  >
                    Админ панель
                  </Button>
                )}
                <Button
                  sx={{ width: "100%" }}
                  onClick={() => {
                    LogOut();
                    navigation.navigate(Paths.root);
                  }}
                >
                  Выйти
                </Button>
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}

      {isMd && (
        <Box sx={SmallMenuContainer({ isMd })}>
          <IconButton onClick={() => setIsMenuOpened(true)}>
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={isMd && isMenuOpened}
            onClose={() => setIsMenuOpened(false)}
            PaperProps={{ sx: MenuPaperStyles }}
          >
            <IconButton onClick={() => setIsMenuOpened(false)}>
              <CloseIcon />
            </IconButton>
            <Box sx={LinksSmallContainer}>
              <Button
                sx={{ mb: 2 }}
                variant="contained"
                onClick={() => navigation.navigate(Paths.billing)}
              >
                Оформить доступ
              </Button>

              {Links}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 4,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 0,
                  right: 20,
                }}
              >
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Наши Соцсети:
                </Typography>

                <VK height="28px" cursor="pointer" />
                <TG height="28px" cursor="pointer" />
              </Box>
            </Box>
          </Drawer>
        </Box>
      )}
    </Box>
  );
};
