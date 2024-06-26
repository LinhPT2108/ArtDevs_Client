"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Button, CardMedia, Grid } from "@mui/material";
import BgUtils from "../utils/bg.utils";
import { GLOBAL_COLOR_WHITE } from "../utils/veriable.global";

const IntroAbout = () => {
  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <BgUtils color="#ffffff" />
      <Grid
        container
        spacing={0}
        columns={16}
        sx={{
          height: "100%",
          flexWrap: "nowrap",
          alignItems: "center",
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Grid
          item
          xs={16}
          md={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                fontWeight: 700,
                color: "#1976d2",
                fontSize: { xs: "24px", sm: "36px", md: "48px" },
              }}
            >
              ART DEVS
            </Box>
            <Box
              sx={{
                fontWeight: 400,
                color: "#000",
                mt: 1.5,
                fontSize: { xs: "16px", sm: "22px", md: "28px" },
                textAlign: "center",
              }}
            >
              Mang đến một cộng đồng Chia sẻ tri thức và kiến thức cho cộng động
              lập trình viên
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#DF6312",
                marginX: "6px",
                borderRadius: "30px",
                padding: "6px 16px",
                color: GLOBAL_COLOR_WHITE,
                fontWeight: 700,
                marginY: { xs: "6px", sm: 0 },
                transition: "box-shadow .25s ease,transform .25s ease",
                "&:hover": {
                  backgroundColor: "#af4e0f",
                  transform: "translate3d(0,-3px,0)",
                },
              }}
            >
              Tìm hiểu thêm ...
            </Button>
            <Box
              sx={{
                backgroundColor: "#E63C43",
                padding: "6px 16px",
                color: GLOBAL_COLOR_WHITE,
                cursor: "pointer",
                marginX: "6px",
                borderRadius: "30px",
                fontWeight: 700,
                textAlign: "center",
                marginY: { xs: "6px", sm: 0 },
                width: "160px",
                transition: "box-shadow .25s ease,transform .25s ease",
                "&:hover": {
                  backgroundColor: "#ab1a20",
                  transform: "translate3d(0,-3px,0)",
                },
              }}
            >
              Tham gia ngay
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={16}
          md={8}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CardMedia component="img" image="/logo.png" alt="Paella dish" />
        </Grid>
      </Grid>
      <Box
        sx={{
          position: "absolute",
          top: { xs: 0, sm: "-30%" },
          right: 0,
          left: { xs: "auto", sm: "auto" },
          zIndex: "0",
          width: " 100%",
          paddingBottom: " 75%",
          borderRadius: " 50%",
          background: "#f8c4ff",
          mixBlendMode: " normal",
          opacity: "0.3",
          filter: "blur(35px)",
          "@media (min-width: 768px)": {
            top: "0",
            right: "0",
            width: "600px",
            height: "480px",
            paddingBottom: "0",
            filter: "blur(110px)",
          },
        }}
      ></Box>
    </Box>
  );
};
export default IntroAbout;
