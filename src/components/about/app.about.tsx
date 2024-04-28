"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { ButtonGroup, CardMedia, Container, Link } from "@mui/material";
import IntroAbout from "./about.intro";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderAbout from "./about.slide";
import ShareAbout from "./about.share";
import LanguageAbout from "./about.language";
import FooterAbout from "./about.footer";
import {
  GLOBAL_BG,
  GLOBAL_BG_NAV,
  GLOBAL_BG_NOTIFY,
} from "../utils/veriable.global";

const About = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: GLOBAL_BG }}>
      <AppBar position="static" sx={{ bgcolor: GLOBAL_BG }}>
        <Container sx={{ paddingX: { xs: 0, md: "16px" } }}>
          <Toolbar>
            <Box
              color="primary.main"
              sx={{
                display: { sm: "block" },
                padding: "6px 0",
                marginRight: { xs: "0", sm: "12px" },
              }}
            >
              <Link href="/">
                <CardMedia
                  sx={{ width: { xs: "60px", sm: "100px" } }}
                  component="img"
                  image="/Art_Devs_aboutFooter.png"
                  alt="logo"
                />
              </Link>
            </Box>
            <Box
              color="primary.main"
              sx={{
                display: { sm: "inline" },
                padding: "6px 0",
                margin: "0 6px",
                fontWeight: "bolder",
                flexGrow: 1,
                "& a": {
                  textDecoration: "none",
                  color: "#1976d2",
                  "@media (min-width: 0px)": {
                    fontSize: "14px",
                  },
                  "@media (min-width: 310px)": {
                    fontSize: "16px",
                  },
                  "@media (min-width: 400px)": {
                    fontSize: "20px",
                  },
                  "@media (min-width: 600px)": {
                    fontSize: "24px",
                  },
                  "@media (min-width: 768px)": {
                    fontSize: "28px",
                  },
                  "@media (min-width: 900px)": {
                    fontSize: "32px",
                  },
                },
              }}
            >
              <Link href="/">Art Devs</Link>
            </Box>
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
              color="secondary"
              sx={{
                "& button": {
                  backgroundColor: "#9c27b0",
                  borderRadius: "30px",
                  paddingX: { xs: "8px", sm: "16px" },
                  fontSize: { xs: "8px", sm: "14px" },
                  "@media (min-width: 0px)": {
                    fontSize: "8px",
                    paddingX: "8px",
                  },
                  "@media (min-width: 320px)": {
                    fontSize: "10px",
                    paddingX: "10px",
                  },
                  "@media (min-width: 400px)": {
                    fontSize: "12px",
                    paddingX: "14px",
                  },
                  "@media (min-width: 600px)": {
                    fontSize: "14px",
                    paddingX: "18px",
                  },
                  "@media (min-width: 768px)": {
                    fontSize: "16px",
                    paddingX: "20px",
                  },
                },
                "& a": {
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "700",
                },
              }}
            >
              <Button>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button>
                <Link href="/sign-up">Đăng ký</Link>
              </Button>
            </ButtonGroup>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          height: "600px",
        }}
      >
        <Container
          sx={{ padding: "0 !important", display: "flex", height: "100%" }}
        >
          <IntroAbout />
        </Container>
      </Box>
      <Box>
        <SliderAbout />
      </Box>
      <Box
        sx={{
          // backgroundColor: "#000000",
          paddingY: "36px",
        }}
      >
        <Container sx={{ padding: "0 !important" }}>
          <ShareAbout />
          <LanguageAbout />
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: GLOBAL_BG_NAV,
          backgroundImage:
            "radial-gradient(farthest-side at bottom left, #fff, transparent 900px), radial-gradient(farthest-corner at bottom right, #fff, transparent 1000px)",
          borderRadius: "12px 12px 0 0",
          // border: "1px solid #141414",
        }}
      >
        <FooterAbout />
      </Box>
    </Box>
  );
};

export default About;
