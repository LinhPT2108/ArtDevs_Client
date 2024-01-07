"use client";
import AppHeader from "@/components/header/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import AppMenu from "@/components/left-menu/app.menu";
import RightPost from "@/components/left-menu/app.right.menu";
import ContactMenu from "@/components/left-menu/app.contact";
import Post from "@/components/posts/post.main";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
  position: "relative",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));
export default function Home() {
  const [post, setPost] = React.useState<MessageExample[]>([]);
  const callbackFunction = (message: MessageExample[]) => {
    setPost(message);
  };

  const [openContact, setOpenContact] = useState<boolean>(true);
  const handleOpenContact = (isOpen: boolean) => {
    setOpenContact(isOpen);
  };

  const [open, setOpen] = React.useState<boolean>(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const theme = useTheme();
  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Grid item xs={16}>
            <AppHeader pros={handleDrawerOpen} />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          marginTop: "0px",
          backgroundColor: "#9b9da0",
          paddingTop: "85px",
        }}
      >
        <CssBaseline />
        {/* <AppBar position="fixed" open={open}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1 }}
              component="div"
            >
              Persistent drawer 123
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar> */}
        <Main open={open}>
          <DrawerHeader />
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
            dolor purus non enim praesent elementum facilisis leo vel. Risus at
            ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
            rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
            sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
            integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
            eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
            quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        {/* <Grid container spacing={0} columns={16}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: { xs: "none", sm: "block" },
              padding: "0px 12px 0px 12px",
              position: "relative",
            }}
          >
            <AppMenu />
          </Grid>

          <Grid
            item
            xs={16}
            sm={10}
            md={8}
            lg={openContact ? 6 : 8}
            sx={{
              marginTop: "12px",
              padding: { xs: "0 24px", md: "0 0 0 24px" },
            }}
          >
            <Post messsages={post} />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={openContact ? 3 : 4}
            sx={{
              display: { xs: "none", md: "flex" },
              padding: "0px 12px 0px 12px",
              justifyContent: "flex-start",
            }}
          >
            <RightPost />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={openContact ? 3 : 0}
            sx={{
              display: {
                xs: openContact ? "flex" : "none",
                lg: openContact ? "flex" : "none",
              },
              padding: "0px 12px 0px 12px",
              justifyContent: "flex-end",
            }}
          >
            <ContactMenu />
          </Grid>
        </Grid> */}
      </Box>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Grid
            item
            xs={16}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            <BottomNavbar pros={callbackFunction} sx={{ zIndex: 1 }} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
