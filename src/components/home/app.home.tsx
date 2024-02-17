"use-client";
import AppHeader from "@/components/header/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import ContactMenu from "@/components/left-menu/app.contact";
import { Box, CssBaseline, Drawer, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import OptionChat from "@/components/chat/option/chat.option";
import MainHome from "./main.home";
const drawerWidth = 200;
interface IPros {
  user: User;
  fetchPost: Post[];
}
export default function AppHome(pros: IPros) {
  const { user, fetchPost } = pros;
  const [post, setPost] = useState<Post[]>([]);
  const [value, setValue] = useState<number>(0);
  const [openContact, setOpenContact] = useState<boolean>(true);
  const [pageUrl, setPageUrl] = useState<string>("home");
  const handlePost = (message: Post[]) => {
    setPost(message);
  };
  const handleDrawerOpen = (openContact: boolean) => {
    setOpenContact(openContact);
  };
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  // const messageExamples: MessageExample[] = [
  //   {
  //     primary: `Brunch this week? ${value}`,
  //     secondary:
  //       "I'll be in the neighbourhood this week. Let's grab a bite to eat",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Birthday Gift",
  //     secondary: `Do you have a suggestion for a good present for John on his work
  //       anniversary. I am really confused & would love your thoughts on it.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Recipe to try",
  //     secondary:
  //       "I am try out this new BBQ recipe, I think this might be amazing",
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Yes!",
  //     secondary: "I have the tickets to the ReactConf for this year.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Doctor's Appointment",
  //     secondary:
  //       "My appointment for the doctor was rescheduled for next Saturday.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Discussion",
  //     secondary: `Menus that are generated by the bottom app bar (such as a bottom
  //       navigation drawer or overflow menu) open as bottom sheets at a higher elevation
  //       than the bar.`,
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Summer BBQ",
  //     secondary: `Who wants to have a cookout this weekend? I just got some furniture
  //       for my backyard and would love to fire up the grill.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Brunch this week?",
  //     secondary:
  //       "I'll be in the neighbourhood this week. Let's grab a bite to eat",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Birthday Gift",
  //     secondary: `Do you have a suggestion for a good present for John on his work
  //       anniversary. I am really confused & would love your thoughts on it.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Recipe to try",
  //     secondary:
  //       "I am try out this new BBQ recipe, I think this might be amazing",
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Yes!",
  //     secondary: "I have the tickets to the ReactConf for this year.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Doctor's Appointment",
  //     secondary:
  //       "My appointment for the doctor was rescheduled for next Saturday.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Discussion",
  //     secondary: `Menus that are generated by the bottom app bar (such as a bottom
  //       navigation drawer or overflow menu) open as bottom sheets at a higher elevation
  //       than the bar.`,
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Summer BBQ",
  //     secondary: `Who wants to have a cookout this weekend? I just got some furniture
  //       for my backyard and would love to fire up the grill.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Brunch this week?",
  //     secondary:
  //       "I'll be in the neighbourhood this week. Let's grab a bite to eat",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Birthday Gift",
  //     secondary: `Do you have a suggestion for a good present for John on his work
  //       anniversary. I am really confused & would love your thoughts on it.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Recipe to try",
  //     secondary:
  //       "I am try out this new BBQ recipe, I think this might be amazing",
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Yes!",
  //     secondary: "I have the tickets to the ReactConf for this year.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Doctor's Appointment",
  //     secondary:
  //       "My appointment for the doctor was rescheduled for next Saturday.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Discussion",
  //     secondary: `Menus that are generated by the bottom app bar (such as a bottom
  //       navigation drawer or overflow menu) open as bottom sheets at a higher elevation
  //       than the bar.`,
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Summer BBQ",
  //     secondary: `Who wants to have a cookout this weekend? I just got some furniture
  //       for my backyard and would love to fire up the grill.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Brunch this week?",
  //     secondary:
  //       "I'll be in the neighbourhood this week. Let's grab a bite to eat",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Birthday Gift",
  //     secondary: `Do you have a suggestion for a good present for John on his work
  //       anniversary. I am really confused & would love your thoughts on it.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Recipe to try",
  //     secondary:
  //       "I am try out this new BBQ recipe, I think this might be amazing",
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  //   {
  //     primary: "Yes!",
  //     secondary: "I have the tickets to the ReactConf for this year.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Doctor's Appointment",
  //     secondary:
  //       "My appointment for the doctor was rescheduled for next Saturday.",
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Discussion",
  //     secondary: `Menus that are generated by the bottom app bar (such as a bottom
  //       navigation drawer or overflow menu) open as bottom sheets at a higher elevation
  //       than the bar.`,
  //     person: "/logo.png",
  //   },
  //   {
  //     primary: "Summer BBQ",
  //     secondary: `Who wants to have a cookout this weekend? I just got some furniture
  //       for my backyard and would love to fire up the grill.`,
  //     person: "/Art_Devs_y-removebg-preview.png",
  //   },
  // ];

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    handlePost(fetchPost);
  }, [value]);
  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Box component={Grid} item xs={16}>
            <AppHeader
              handleDrawerOpen={handleDrawerOpen}
              tabValue={value}
              handleChangeTab={handleChange}
              openContact={openContact}
              pageUrl={pageUrl}
              user={user}
            />
          </Box>
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
        <MainHome openContact={openContact} post={post} user={user} />
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
          {pageUrl == "home" ? (
            <ContactMenu openContact={openContact} pageUrl={pageUrl} />
          ) : (
            <OptionChat />
          )}
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Box
            component={Grid}
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
          </Box>
        </Grid>
      </Box>
    </>
  );
}
