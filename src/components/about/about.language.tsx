import CardMedia from "@mui/material/CardMedia";

import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
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
          backgroundColor: "#0B090B",
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
              width: "60px",
            }}
            component="img"
            image="/language-program/Clogo.png"
            alt="C#-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "60px",
            }}
            component="img"
            image="/language-program/Java-logo.png"
            alt="Java-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "60px",
            }}
            component="img"
            image="/language-program/javascript-logo.png"
            alt="javascript-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "60px",
            }}
            component="img"
            image="/language-program/python-logo.png"
            alt="python-logo.png"
          />
        </Grid>{" "}
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "60px",
            }}
            component="img"
            image="/language-program/PHP-logo.png"
            alt="PHP-logo.png"
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <CardMedia
            sx={{
              borderRadius: "8px",
              width: "60px",
            }}
            component="img"
            image="/language-program/program.png"
            alt="program.png"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default LanguageAbout;
