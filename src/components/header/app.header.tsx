import * as React from "react";
import AppBar from "@mui/material/AppBar";
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
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchComponent from "./header.search";
import HomeIcon from "@mui/icons-material/Home";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import { CardMedia, Link } from "@mui/material";
import IconTabs from "./header.nav";
import SearchIcon from "@mui/icons-material/Search";

export default function AppHeader() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
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

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={6} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#293145",
          color: "text.white",
          padding: { xs: "0", lg: "0 64px" },
        }}
      >
        <Toolbar className="flex">
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
            className="font-bold"
          >
            <Link href="#">
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
            }}
            className="font-bold"
          >
            <Link
              href="#"
              sx={{ textDecoration: "none" }}
              className="min-[0px]:text-sm  min-[310px]:text-base min-[400px]:text-xl"
            >
              Art Devs
            </Link>
          </Typography>
          <SearchComponent />
          <IconTabs />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: "flex" }, fontSize: {} }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{
                display: { xs: "inline", sm: "none" },
                padding: { xs: "8px", sm: "12px" },
              }}
            >
              <Badge>
                <SearchIcon className="min-[0px]:text-base min-[400px]:text-2xl" />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              sx={{ padding: { xs: "8px", sm: "12px" } }}
            >
              <Badge badgeContent={10} color="error">
                <MailIcon className="min-[0px]:text-base min-[400px]:text-2xl" />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ padding: { xs: "8px", sm: "12px" } }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon className="min-[0px]:text-base min-[400px]:text-2xl" />
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
              sx={{ padding: { xs: "8px", sm: "12px" } }}
            >
              <AccountCircle className="min-[0px]:text-base min-[400px]:text-2xl" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
