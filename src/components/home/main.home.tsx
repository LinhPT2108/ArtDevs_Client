import NextAuthWrapper from "@/lib/next.auth.provider";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppMenu from "../left-menu/app.menu";
import Post from "../posts/post.main";
import RightPost from "../left-menu/app.right.menu";
const drawerWidth = 200;
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
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

interface IPros {
  openContact: boolean;
  messages: MessageExample[];
}

const MainHome = (pros: IPros) => {
  const { openContact, messages } = pros;
  return (
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
          <Post messages={messages} />
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
  );
};
export default MainHome;
