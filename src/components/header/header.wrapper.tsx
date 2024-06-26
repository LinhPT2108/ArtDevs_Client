"use client";
import { useDrawer, useUser } from "@/lib/custom.content";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import AppHeader from "./app.header";

interface HomeProps {
  user: User | null;
}
const HeaderWrapper = ({ user }: HomeProps) => {
  const { drawerOpen, setDrawerOpen } = useDrawer();
  const { setUser } = useUser();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: "0px",
        display: `${user ? "" : "none"}`,
      }}
    >
      <Grid container spacing={0} columns={16}>
        <Box component={Grid} item xs={16}>
          <AppHeader
            handleDrawerOpen={setDrawerOpen}
            openContact={drawerOpen}
            pageUrl={"home"}
            session={user}
          />
        </Box>
      </Grid>
    </Box>
  );
};
export default HeaderWrapper;
