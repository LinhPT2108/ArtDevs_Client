"use client";
import { Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import MainHome from "./main.home";
import {
  DRAWER_WIDTH,
  GLOBAL_BG,
  getDrawerOpen,
} from "../utils/veriable.global";
import ContactMenu from "../left-menu/app.contact";
import { useDrawer, useWidthScreen } from "@/lib/custom.content";
import { usePathname } from "next/navigation";

interface IPros {
  children: React.ReactNode;
  session: User;
}
const BodyWrapper = ({ children, session }: IPros) => {
  let pageUrl = "home";
  const { drawerOpen } = useDrawer();
  const { widthScreen } = useWidthScreen();
  const router = usePathname();
  return (
    <>
      {router != "/activity" && router != "/search" ? (
        <Box
          sx={{
            paddingLeft: { xs: "0", sm: "215px" },
            display: "flex",
            flexGrow: 1,
            marginTop: "0px",
            backgroundColor: "#FBFCFE",
            paddingTop: { xs: "0px", sm: "85px" },
            minHeight: "100vh",
            paddingX: { xs: "0" },
            paddingBottom: { xs: "36px", sm: 0 },
          }}
        >
          <MainHome openContact={drawerOpen} session={session}>
            {children}
          </MainHome>
          <Drawer
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                backgroundColor: GLOBAL_BG,
              },
              zIndex: `${drawerOpen ? "1201" : "initial"}`,
            }}
            variant="persistent"
            anchor="right"
            open={widthScreen < 900 ? false : drawerOpen}
          >
            <ContactMenu
              session={session}
              openContact={drawerOpen}
              pageUrl={pageUrl}
            />
          </Drawer>
        </Box>
      ) : (
        <Box>{children}</Box>
      )}
    </>
  );
};
export default BodyWrapper;
