"use client";
import { Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import MainHome from "./main.home";
import { DRAWER_WIDTH, getDrawerOpen } from "../utils/veriable.global";
import ContactMenu from "../left-menu/app.contact";
import { useDrawer, useWidthScreen } from "@/lib/custom.content";

interface IPros {
  children: React.ReactNode;
}
const BodyWrapper = ({ children }: IPros) => {
  let pageUrl = "home";
  const { drawerOpen } = useDrawer();
  const { widthScreen } = useWidthScreen();
  return (
    <Box
      sx={{
        paddingLeft: { xs: "0", sm: "230px" },
        display: "flex",
        flexGrow: 1,
        marginTop: "0px",
        backgroundColor: "#9b9da0",
        paddingTop: "85px",
        minHeight: "100vh",
        paddingX: { xs: "12px" },
      }}
    >
      <MainHome openContact={drawerOpen}>{children}</MainHome>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            backgroundColor: "#293145",
          },
          zIndex: `${drawerOpen ? "1201" : "999"}`,
        }}
        variant="persistent"
        anchor="right"
        open={widthScreen < 900 ? false : drawerOpen}
      >
        <ContactMenu openContact={drawerOpen} pageUrl={pageUrl} />
      </Drawer>
    </Box>
  );
};
export default BodyWrapper;
