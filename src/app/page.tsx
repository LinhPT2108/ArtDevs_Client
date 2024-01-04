"use client";
import AppHeader from "@/components/app.header";
import BottomNavbar from "@/components/header/header.bottom";
import AppMenu from "@/components/left-menu/app.menu";
import { Box, Grid } from "@mui/material";

export default function Home() {
  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Grid
            xs={16}
            // sx={{
            //   display: { xs: "none", md: "block" },
            // }}
          >
            <AppHeader />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, marginTop: "0px", backgroundColor: "#9b9da0" }}>
        <Grid container spacing={0} columns={16}>
          <Grid
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
          <Grid xs={4} sm={10} md={12} sx={{ marginTop: "12px" }}>
            123
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, marginTop: "0px" }}>
        <Grid container spacing={0} columns={16}>
          <Grid
            xs={16}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            <BottomNavbar />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
