"use client";
import AppHeader from "@/components/header/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import AppMenu from "@/components/left-menu/app.menu";
import RightPost from "@/components/left-menu/app.right.menu";
import Post from "@/components/posts/post.main";
import { Box, Grid } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [post, setPost] = useState<MessageExample[]>([]);

  const callbackFunction = (message: MessageExample[]) => {
    setPost(message);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Grid item xs={16}>
            <AppHeader />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, marginTop: "0px", backgroundColor: "#9b9da0" }}>
        <Grid container spacing={0} columns={16}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: { xs: "none", sm: "block" },
              padding: "0px 12px 0px 12px",
            }}
          >
            <AppMenu />
          </Grid>

          <Grid
            item
            xs={16}
            sm={10}
            md={8}
            lg={6}
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
            lg={3}
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
            lg={3}
            sx={{
              display: { xs: "none", lg: "flex" },
              padding: "0px 12px 0px 12px",
              justifyContent: "flex-end",
            }}
          >
            <AppMenu />
          </Grid>
        </Grid>
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
