"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchComponent from "./header.search";
import {
  Avatar,
  CardMedia,
  CssBaseline,
  Drawer,
  ToggleButton,
} from "@mui/material";
import IconTabs from "./header.nav";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AppMenu from "../left-menu/app.menu";
import ContactMenu from "../left-menu/app.contact";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import OptionChat from "../chat/option/chat.option";
import { useSession } from "next-auth/react";
import Link from "next/link";

const drawerWidth = 210;
type Anchor = "top" | "left" | "bottom" | "right";
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

interface IPros {
  handleDrawerOpen: (openContact: boolean) => void;
  tabValue: number;
  handleChangeTab: (newValue: number) => void;
  openContact: boolean;
  pageUrl: string;
  user: User;
}
export default function AppHeader(pros: IPros) {
  const { data: session, status } = useSession();
  console.log(">>> check user: ", session);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const [selectedContact, setSelectedContact] = React.useState(false);
  const [openContact, setOpenContact] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState(false);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      {
        anchor == "right" && !open && setOpenContact(open);
      }
      {
        anchor == "left" && !open && setSelectedMenu(open);
      }
      setState({ ...state, [anchor]: open });
    };
  // const windowS: Window = window;
  const [windowSize, setWindowSize] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 900
  );

  React.useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth > 600;
      setWindowSize(window.innerWidth);
      if (isLargeScreen && selectedMenu) {
        toggleDrawer("left", !selectedMenu)({} as React.MouseEvent);
      }
      if (
        window.innerWidth < 900 &&
        !selectedContact &&
        pros &&
        typeof pros.handleDrawerOpen === "function"
      ) {
        setSelectedContact(true);
        pros.handleDrawerOpen(selectedContact);
      }
      if (window.innerWidth >= 900 && openContact) {
        toggleDrawer("right", !openContact)({} as React.MouseEvent);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);
  React.useEffect(() => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 900) {
      setSelectedContact(true);
      pros.handleDrawerOpen(selectedContact);
    }
  }, []);

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width:
          anchor === "top" || anchor === "bottom"
            ? "auto"
            : anchor === "right" && pros?.pageUrl == "chat"
            ? 280
            : 210,
        paddingTop: { xs: "58px", sm: "85px" },
        backgroundColor: "#293145",
      }}
      role="presentation"
      onClick={
        anchor === "left" ? () => toggleDrawer(anchor, false) : undefined
      }
      onKeyDown={
        anchor === "left" ? () => toggleDrawer(anchor, false) : undefined
      }
    >
      {anchor === "left" ? (
        pros.pageUrl == "home" ? (
          <AppMenu />
        ) : (
          <ContactMenu openContact={pros.openContact} pageUrl={"home"} />
        )
      ) : pros.pageUrl == "home" ? (
        <ContactMenu openContact={pros.openContact} pageUrl={"home"} />
      ) : (
        <OptionChat />
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#293145",
          color: "text.white",
          padding: { xs: "0px", lg: "0 64px" },
          zIndex: "1202",
        }}
      >
        <Toolbar
          className="flex"
          sx={{
            padding: { xs: "0 6px", sm: "0 12px", md: "0 16px", lg: "0 24px" },
          }}
        >
          <Typography
            variant="h5"
            noWrap
            component="div"
            color="primary.main"
            sx={{
              display: { sm: "block" },
              padding: "6px 0",
              marginRight: { xs: "0", sm: "12px" },
            }}
          >
            <Link href="/">
              <CardMedia
                sx={{ width: { xs: "60px", sm: "100px" } }}
                component="img"
                image="/Art_Devs_y-removebg-preview.png"
                alt="logo"
              />
            </Link>
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="primary.main"
            sx={{
              display: { sm: "inline" },
              padding: "6px 0",
              margin: "0 6px",
              fontWeight: "bolder",
              "& a": {
                color: "#0766FF",
                textDecoration: "none",
                "@media (min-width: 0px)": {
                  fontSize: "14px",
                },
                "@media (min-width: 310px)": {
                  fontSize: "16px",
                },
                "@media (min-width: 400px)": {
                  fontSize: "20px",
                },
              },
            }}
          >
            <Link href="/">Art Devs</Link>
          </Typography>
          <SearchComponent />
          <IconTabs
            tabValue={pros?.tabValue}
            handleChangeTab={pros?.handleChangeTab}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: "flex" }, alignItems: "center" }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{
                display: { xs: "inline", sm: "none" },
                "@media (min-width: 0px)": {
                  padding: "0",
                },
                "@media (min-width: 300px)": {
                  padding: "8px",
                },
                "@media (min-width: 600px)": {
                  padding: "12px",
                },
              }}
            >
              <Badge>
                <SearchIcon
                  sx={{
                    "@media (min-width: 0px)": {
                      fontSize: "16px",
                    },
                    "@media (min-width: 400px)": {
                      fontSize: "24px",
                    },
                  }}
                />
              </Badge>
            </IconButton>
            {windowSize >= 900 && (
              <ToggleButton
                onClick={() => {
                  pros.handleDrawerOpen(selectedContact);
                }}
                value="check"
                selected={selectedContact}
                // aria-label="open drawer"
                onChange={() => {
                  setSelectedContact(!selectedContact);
                }}
                sx={{
                  color: "#ffffff",
                  borderRadius: "100%",
                  padding: { xs: "6px", sm: "12px" },
                  "$ .css-imxc6v-MuiBadge-badge": { fontSize: "0.5rem" },
                  minWidth: { xs: "32px", md: "48px" },
                }}
              >
                <Badge badgeContent={11} color="error">
                  <MailIcon
                    sx={{
                      "@media (min-width: 0px)": {
                        fontSize: "16px",
                      },
                      "@media (min-width: 400px)": {
                        fontSize: "24px",
                      },
                    }}
                  />
                </Badge>
              </ToggleButton>
            )}
            {windowSize < 900 &&
              (["right"] as const).map((anchor, index) => (
                <React.Fragment key={anchor + index}>
                  <ToggleButton
                    onClick={toggleDrawer(anchor, !openContact)}
                    value="check"
                    selected={openContact}
                    onChange={() => {
                      setOpenContact(!openContact);
                    }}
                    sx={{
                      color: "#ffffff",
                      borderRadius: "100%",
                      padding: { xs: "6px", sm: "12px" },
                      "$ .css-imxc6v-MuiBadge-badge": { fontSize: "0.5rem" },
                      minWidth: { xs: "32px", md: "48px" },
                    }}
                  >
                    <Badge badgeContent={11} color="error">
                      <MailIcon
                        sx={{
                          "@media (min-width: 0px)": {
                            fontSize: "16px",
                          },
                          "@media (min-width: 400px)": {
                            fontSize: "24px",
                          },
                        }}
                      />
                    </Badge>
                  </ToggleButton>
                  <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    sx={{
                      "& .css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
                        backgroundColor: "#293145",
                      },
                    }}
                  >
                    {list(anchor)}
                  </Drawer>
                </React.Fragment>
              ))}
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ padding: { xs: "8px", sm: "12px" } }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon
                  sx={{
                    "@media (min-width: 0px)": {
                      fontSize: "16px",
                    },
                    "@media (min-width: 400px)": {
                      fontSize: "24px",
                    },
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                display: { xs: "none", sm: "inline" },
                padding: { xs: "8px", sm: "12px" },
              }}
            >
              {session?.user ? (
                session?.user?.profilePicUrl ? (
                  <Avatar
                    alt={session?.user?.firstName || ""}
                    src={session?.user?.profilePicUrl}
                  />
                ) : (
                  <AccountCircle
                    sx={{
                      "@media (min-width: 0px)": {
                        fontSize: "16px",
                      },
                      "@media (min-width: 400px)": {
                        fontSize: "24px",
                      },
                    }}
                  />
                )
              ) : (
                <AccountCircle
                  sx={{
                    "@media (min-width: 0px)": {
                      fontSize: "16px",
                    },
                    "@media (min-width: 400px)": {
                      fontSize: "24px",
                    },
                  }}
                />
              )}
            </IconButton>
            {(["left"] as const).map((anchor) => (
              <React.Fragment key={anchor + "123"}>
                <ToggleButton
                  onClick={toggleDrawer(anchor, !selectedMenu)}
                  value="check"
                  selected={selectedMenu}
                  onChange={() => {
                    setSelectedMenu(!selectedMenu);
                  }}
                  sx={{
                    color: "#ffffff",
                    borderRadius: "100%",
                    display: { xs: "inline", sm: "none" },
                    minWidth: { xs: "36px", sm: "48px" },
                    padding: { xs: "3px", sm: "6px" },
                  }}
                >
                  <MenuIcon />
                </ToggleButton>
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  sx={{
                    "& .css-4t3x6l-MuiPaper-root-MuiDrawer-paper": {
                      backgroundColor: "#293145",
                    },
                  }}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
