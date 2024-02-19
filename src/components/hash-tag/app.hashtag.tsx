"use-client";
import AppHeader from "@/components/header/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import ContactMenu from "@/components/left-menu/app.contact";
import { Box, CssBaseline, Drawer, Grid } from "@mui/material";
import { useRef, useState } from "react";
import OptionChat from "@/components/chat/option/chat.option";
import MainHome from "@/components/home/main.home";
const drawerWidth = 200;

interface IPros {
  user: User | null;
}

export default function AppHomeHashtag(pros: IPros) {
  const { user } = pros;
  const [value, setValue] = useState<number>(0);
  const [openContact, setOpenContact] = useState<boolean>(true);
  const [pageUrl, setPageUrl] = useState<string>("home");
  const url = "hash-tag";
  const handleDrawerOpen = (openContact: boolean) => {
    setOpenContact(openContact);
  };
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  const ref = useRef<HTMLDivElement>(null);
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
        <MainHome openContact={openContact} user={user} url={url} />
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
