"use client";
import ChatMessagesForm from "@/components/chat/chat.form";
import ChatNone from "@/components/chat/chat.none";
import OptionChat from "@/components/chat/option/chat.option";
import ContactMenu from "@/components/left-menu/app.contact";
import { formatTimeDifference } from "@/components/utils/utils";
import {
  DRAWER_WIDTH,
  GLOBAL_BG_NAV,
} from "@/components/utils/veriable.global";
import { useDrawer, useUser } from "@/lib/custom.content";
import { Box, CssBaseline, Drawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -(DRAWER_WIDTH + 80),
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
  const [user, setUser] = React.useState<UserMessage>();
  const { drawerOpen, setDrawerOpen } = useDrawer();
  const getUser = (user: UserMessage) => {
    setUser(user);
  };
  const { user: session } = useUser();
  const handlePost = (message: MessageExample[]) => {
    setPost(message);
  };
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  console.log(">>> check user: ", user);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    // handlePost(messageExamples);
  }, [value]);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexGrow: 1,
        marginTop: "0px",
        backgroundColor: GLOBAL_BG_NAV,
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
        {session && (
          <ContactMenu
            openContact={openContact}
            pageUrl={pageUrl}
            getUser={getUser}
            session={session}
          />
        )}
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
              dataMessage={null}
              session={session!}
            />
          ) : (
            <ChatNone />
          )}
        </Box>
      </Main>
      <Drawer
        sx={{
          width: DRAWER_WIDTH + 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH + 80,
            backgroundColor: "#ffffff",
          },
          zIndex: `${drawerOpen ? "1201" : "999"}`,
        }}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
      >
        <OptionChat />
      </Drawer>
    </Box>
  );
}
