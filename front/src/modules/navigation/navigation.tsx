import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Popper,
  Stack,
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
import { useRef, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  LinksLargeContainer,
  LinksSmallContainer,
  MediaLinksContainer,
  MenuPaperStyles,
  NavigationContainer,
  SmallMenuContainer,
} from "./navigation.styles";
import { LinkOption } from "./navigation.types";

const Link = ({ name, path, subLinks }: LinkOption) => {
  const isSm = useMediaQuery(theme.breakpoints.down("md"));
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
          isSm && setIsOpened(!isOpened);
          path && navigation.navigate(path);
        }}
        endIcon={
          subLinks &&
          (isSm && isOpened ? (
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
        {!isSm && subLinks && (
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
      {isSm && isOpened && subLinks && (
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
  const isSm = useMediaQuery(theme.breakpoints.down("md"));
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const isMd = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box sx={NavigationContainer({ isSm })}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img style={{ height: isMd ? 44 : 56 }} src={Logo} alt="Logo" />
        <Typography
          color={theme.palette.primary.main}
          variant={isMd ? "body1" : "h4"}
        >
          Good Sanction Check
        </Typography>
      </Box>

      {!isSm && <Box sx={LinksLargeContainer}>{Links}</Box>}

      <Box sx={MediaLinksContainer({ isSm })}>
        <VK height="100%" cursor="pointer" />
        <TG height="100%" cursor="pointer" />
      </Box>

      {isSm && (
        <Box sx={SmallMenuContainer({ isSm })}>
          <IconButton onClick={() => setIsMenuOpened(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={isSm && isMenuOpened}
            onClose={() => setIsMenuOpened(false)}
            PaperProps={{ sx: MenuPaperStyles }}
          >
            <IconButton onClick={() => setIsMenuOpened(false)}>
              <CloseIcon />
            </IconButton>
            <Box sx={LinksSmallContainer}>{Links}</Box>
          </Drawer>
        </Box>
      )}
    </Box>
  );
};
