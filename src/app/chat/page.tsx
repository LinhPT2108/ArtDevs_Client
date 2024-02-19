"use client";
import AppHeader from "@/components/header/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import AppMenu from "@/components/left-menu/app.menu";
import RightPost from "@/components/left-menu/app.right.menu";
import ContactMenu from "@/components/left-menu/app.contact";
import Post from "@/components/posts/post.main";
import { Box, CssBaseline, Drawer, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import OptionChat from "@/components/chat/option/chat.option";
import ChatMessagesForm from "@/components/chat/chat.form";
import ChatNone from "@/components/chat/chat.none";
import { formatTimeDifference } from "@/components/utils/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const drawerWidth = 280;

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

export default function Message() {
  const [post, setPost] = React.useState<MessageExample[]>([]);
  const [value, setValue] = React.useState<number>(0);
  const [pageUrl, setPageUrl] = React.useState<string>("chat");
  const [openContact, setOpenContact] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<IUser>();
  const [userLogin, setUserLogin] = useState<User | null>(null);
  useEffect(() => {
    const getUserLogin = async () => {
      const session: User | null = await getServerSession(authOptions);
      session ? setUserLogin(session) : setUserLogin(null);
    };
    getUserLogin;
  }, []);
  const getUser = (user: IUser) => {
    setUser(user);
  };
  const handlePost = (message: MessageExample[]) => {
    setPost(message);
  };
  const handleDrawerOpen = (openContact: boolean) => {
    setOpenContact(openContact);
  };
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    // handlePost(messageExamples);
  }, [value]);

  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Grid item xs={16}>
            <AppHeader
              handleDrawerOpen={handleDrawerOpen}
              tabValue={value}
              handleChangeTab={handleChange}
              openContact={openContact}
              pageUrl={pageUrl}
              user={userLogin}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        ref={ref}
        sx={{
          display: "flex",
          flexGrow: 1,
          marginTop: "0px",
          backgroundColor: "#ffffff",
          paddingTop: "85px",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            padding: "0px 12px 0px 12px",
            position: "relative",
          }}
        >
          <ContactMenu
            openContact={openContact}
            pageUrl={pageUrl}
            getUser={getUser}
          />
        </Box>
        <Main
          open={openContact}
          sx={{
            paddingTop: "0",
            paddingX: { xs: 0, sm: "24px", md: "48px", lg: "64px" },
            marginLeft: { xs: "0", sm: "228px" },
          }}
        >
          <Box
            sx={{
              marginTop: "12px",
            }}
          >
            {user ? (
              <ChatMessagesForm
                formatTimeDifference={formatTimeDifference}
                data={user}
                pageUrl="chat"
              />
            ) : (
              <ChatNone />
            )}
          </Box>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#ffffff",
            },
            zIndex: `${openContact ? "1201" : "999"}`,
          }}
          variant="persistent"
          anchor="right"
          open={openContact}
        >
          {pageUrl == "home" ? (
            <ContactMenu
              openContact={openContact}
              pageUrl={pageUrl}
              getUser={getUser}
            />
          ) : (
            <OptionChat />
          )}
        </Drawer>
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
            <BottomNavbar
              pros={handlePost}
              tabValue={value}
              handleChangeTab={handleChange}
              sx={{ zIndex: 1 }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
