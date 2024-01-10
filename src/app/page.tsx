"use client";
import AppHeader from "@/components/header/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import AppMenu from "@/components/left-menu/app.menu";
import RightPost from "@/components/left-menu/app.right.menu";
import ContactMenu from "@/components/left-menu/app.contact";
import Post from "@/components/posts/post.main";
import { Box, CssBaseline, Drawer, Grid } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";

const drawerWidth = 200;

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

export default function Home() {
  const [post, setPost] = React.useState<MessageExample[]>([]);
  const [value, setValue] = React.useState<number>(0);
  const [openContact, setOpenContact] = React.useState<boolean>(true);
  const handlePost = (message: MessageExample[]) => {
    setPost(message);
  };
  const handleDrawerOpen = (openContact: boolean) => {
    setOpenContact(openContact);
  };
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  const messageExamples: MessageExample[] = [
    {
      primary: `Brunch this week? ${value}`,
      secondary:
        "I'll be in the neighbourhood this week. Let's grab a bite to eat",
      person: "/logo.png",
    },
    {
      primary: "Birthday Gift",
      secondary: `Do you have a suggestion for a good present for John on his work
        anniversary. I am really confused & would love your thoughts on it.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Recipe to try",
      secondary:
        "I am try out this new BBQ recipe, I think this might be amazing",
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Yes!",
      secondary: "I have the tickets to the ReactConf for this year.",
      person: "/logo.png",
    },
    {
      primary: "Doctor's Appointment",
      secondary:
        "My appointment for the doctor was rescheduled for next Saturday.",
      person: "/logo.png",
    },
    {
      primary: "Discussion",
      secondary: `Menus that are generated by the bottom app bar (such as a bottom
        navigation drawer or overflow menu) open as bottom sheets at a higher elevation
        than the bar.`,
      person: "/logo.png",
    },
    {
      primary: "Summer BBQ",
      secondary: `Who wants to have a cookout this weekend? I just got some furniture
        for my backyard and would love to fire up the grill.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Brunch this week?",
      secondary:
        "I'll be in the neighbourhood this week. Let's grab a bite to eat",
      person: "/logo.png",
    },
    {
      primary: "Birthday Gift",
      secondary: `Do you have a suggestion for a good present for John on his work
        anniversary. I am really confused & would love your thoughts on it.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Recipe to try",
      secondary:
        "I am try out this new BBQ recipe, I think this might be amazing",
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Yes!",
      secondary: "I have the tickets to the ReactConf for this year.",
      person: "/logo.png",
    },
    {
      primary: "Doctor's Appointment",
      secondary:
        "My appointment for the doctor was rescheduled for next Saturday.",
      person: "/logo.png",
    },
    {
      primary: "Discussion",
      secondary: `Menus that are generated by the bottom app bar (such as a bottom
        navigation drawer or overflow menu) open as bottom sheets at a higher elevation
        than the bar.`,
      person: "/logo.png",
    },
    {
      primary: "Summer BBQ",
      secondary: `Who wants to have a cookout this weekend? I just got some furniture
        for my backyard and would love to fire up the grill.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Brunch this week?",
      secondary:
        "I'll be in the neighbourhood this week. Let's grab a bite to eat",
      person: "/logo.png",
    },
    {
      primary: "Birthday Gift",
      secondary: `Do you have a suggestion for a good present for John on his work
        anniversary. I am really confused & would love your thoughts on it.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Recipe to try",
      secondary:
        "I am try out this new BBQ recipe, I think this might be amazing",
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Yes!",
      secondary: "I have the tickets to the ReactConf for this year.",
      person: "/logo.png",
    },
    {
      primary: "Doctor's Appointment",
      secondary:
        "My appointment for the doctor was rescheduled for next Saturday.",
      person: "/logo.png",
    },
    {
      primary: "Discussion",
      secondary: `Menus that are generated by the bottom app bar (such as a bottom
        navigation drawer or overflow menu) open as bottom sheets at a higher elevation
        than the bar.`,
      person: "/logo.png",
    },
    {
      primary: "Summer BBQ",
      secondary: `Who wants to have a cookout this weekend? I just got some furniture
        for my backyard and would love to fire up the grill.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Brunch this week?",
      secondary:
        "I'll be in the neighbourhood this week. Let's grab a bite to eat",
      person: "/logo.png",
    },
    {
      primary: "Birthday Gift",
      secondary: `Do you have a suggestion for a good present for John on his work
        anniversary. I am really confused & would love your thoughts on it.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Recipe to try",
      secondary:
        "I am try out this new BBQ recipe, I think this might be amazing",
      person: "/Art_Devs_y-removebg-preview.png",
    },
    {
      primary: "Yes!",
      secondary: "I have the tickets to the ReactConf for this year.",
      person: "/logo.png",
    },
    {
      primary: "Doctor's Appointment",
      secondary:
        "My appointment for the doctor was rescheduled for next Saturday.",
      person: "/logo.png",
    },
    {
      primary: "Discussion",
      secondary: `Menus that are generated by the bottom app bar (such as a bottom
        navigation drawer or overflow menu) open as bottom sheets at a higher elevation
        than the bar.`,
      person: "/logo.png",
    },
    {
      primary: "Summer BBQ",
      secondary: `Who wants to have a cookout this weekend? I just got some furniture
        for my backyard and would love to fire up the grill.`,
      person: "/Art_Devs_y-removebg-preview.png",
    },
  ];

  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    handlePost(messageExamples);
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
          backgroundColor: "#9b9da0",
          paddingTop: "85px",
        }}
      >
        <CssBaseline />
        <Main
          open={openContact}
          sx={{
            paddingTop: "0",
            paddingLeft: { xs: 0, sm: "24px", md: "48px", lg: "24px" },
            paddingRight: { xs: 0, sm: "24px", md: "12px", lg: "24px" },
          }}
        >
          <Grid container spacing={0} columns={16}>
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
              lg={8}
              sx={{
                marginTop: "12px",
                padding: { xs: "0 24px", md: "0 0 0 24px" },
              }}
            >
              <Post messages={post} />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              sx={{
                display: { xs: "none", md: "flex" },
                padding: "0px 12px 0px 12px",
                justifyContent: "flex-start",
              }}
            >
              <RightPost />
            </Grid>
          </Grid>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#293145",
            },
            zIndex: `${openContact ? "1201" : "999"}`,
          }}
          variant="persistent"
          anchor="right"
          open={openContact}
        >
          <ContactMenu openContact={openContact} />
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
