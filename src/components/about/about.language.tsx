import CardMedia from "@mui/material/CardMedia";

import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { GLOBAL_BG_NAV } from "../utils/veriable.global";
const LanguageAbout = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: "36px",
        paddingX: { xs: "24px", md: "12px", lg: 0 },
      }}
    >
      <Grid
        container
        columns={6}
        sx={{
          backgroundColor: GLOBAL_BG_NAV,
          borderRadius: "16px",
          "& div": {
            display: "flex",
            justifyContent: "center",
            "& img": {
              paddingY: "12px",
            },
          },
        }}
      >
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "100px",
            }}
            component="img"
            image="/language-program/C_other.png"
            alt="C#-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "100px",
            }}
            component="img"
            image="/language-program/Java.png"
            alt="Java-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "100px",
            }}
            component="img"
            image="/language-program/javascript.png"
            alt="javascript-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "100px",
            }}
            component="img"
            image="/language-program/python.png"
            alt="python-logo.png"
          />
        </Grid>{" "}
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "100px",
            }}
            component="img"
            image="/language-program/PHP.png"
            alt="PHP-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "100px",
            }}
            component="img"
            image="/language-program/ruby.png"
            alt="program.png"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default LanguageAbout;
