import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppMenu from "../left-menu/app.menu";
const drawerWidth = 200;
const Main = styled("main", {
  //@ts-ignore
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
  //@ts-ignore
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
  children: React.ReactNode;
  session: User;
}

const MainHome = ({ children, openContact, session }: IPros) => {
  return (
    <Main
      open={openContact}
      sx={{
        marginTop: "24px",
        padding: { xs: 0, sm: "0 24px 0 24px" },
        // paddingLeft: { xs: 0, sm: "24px" },
        // paddingRight: { xs: 0, sm: "24px" },
      }}
    >
      {/* <Grid container spacing={0} columns={16} className="123123"> */}
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
        <AppMenu session={session} />
      </Grid>
      {children}
      {/* </Grid> */}
    </Main>
  );
};
export default MainHome;
