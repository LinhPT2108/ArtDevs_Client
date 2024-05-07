import React, { ChangeEvent, MouseEventHandler, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import { Box, Button, CardMedia, Container, Grid } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GLOBAL_BG_NAV } from "../utils/veriable.global";
interface NextArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}
interface PrevArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}
const NextArrow = (props: NextArrowProps) => {
  const { className, style, onClick } = props;

  const handleButtonClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (onClick) {
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <Box className={className} style={{ ...style }}>
      <Button
        component="div"
        onClick={handleButtonClick}
        style={{ textTransform: "none" }}
      >
        <ArrowForwardIosIcon fontSize="large" />
      </Button>
    </Box>
  );
};

const PrevArrow = (props: PrevArrowProps) => {
  const { className, style, onClick } = props;

  const handleButtonClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (onClick) {
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <Box className={className} style={{ ...style }}>
      <Button
        component="div"
        onClick={handleButtonClick}
        style={{ textTransform: "none" }}
      >
        <ArrowBackIosIcon fontSize="large" />
      </Button>
    </Box>
  );
};

const SliderAbout = () => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box
      sx={{
        paddingY: { xs: "24px", md: 0 },
      }}
    >
      <Container
        sx={{
          backgroundColor: GLOBAL_BG_NAV,
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
          borderRadius: "8px",
          margin: "auto",
          paddingY: { xs: "24px", md: 0 },
          "& ul": { bottom: 0 },
          "& .slick-slider": {
            height: "100%",
            "& .slick-list": {
              height: "100%",
            },
          },
          "& .slick-prev": {
            left: "25px",
            zIndex: 1,
            width: 64,
            height: 64,
            "&::before": { display: "none" },
            " & div": {
              borderRadius: "100%",
              height: "64px",
            },
          },
          "& .slick-next": {
            right: "25px",
            width: 64,
            height: 64,
            "&::before": { display: "none" },
            " & div": {
              borderRadius: "100%",
              height: "64px",
            },
          },
        }}
      >
        <Slider {...settings}>
          <Box sx={{ color: "#ffffff" }}>
            <Grid
              container
              columns={2}
              sx={{
                alignItems: "center",
                "@media (min-width: 0px)": {
                  height: "400px",
                },
                "@media (min-width: 600px)": {
                  height: "420px",
                },
              }}
            >
              <Grid
                item
                xs={2}
                md={1}
                sx={{
                  paddingX: { xs: "6px", sm: "8px", md: "12px" },
                }}
              >
                <CardMedia
                  sx={{ borderRadius: "8px", height: { xs: 300, md: "auto" } }}
                  component="img"
                  image="/connect.png"
                  alt="connect.png"
                />
              </Grid>
              <Grid
                item
                xs={2}
                md={1}
                sx={{ paddingLeft: { xs: 0, md: "24px" } }}
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
                      color: "#000",
                      fontSize: { xs: "18px", sm: "22px", md: "26px" },
                      "@media (max-width: 390px)": {
                        marginTop: "24px",
                      },
                    }}
                  >
                    Giao lưu kết bạn
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 400,
                      color: "#000",
                      mt: 1.5,
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      textAlign: "justify",
                      paddingX: { xs: "6px", sm: "8px", md: "12px" },
                    }}
                  >
                    ArtBug không chỉ là một nền tảng mạng xã hội thông thường,
                    mà còn là không gian tuyệt vời để kết nối và chia sẻ với
                    những người mới và những người có sở thích chung.
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid
              container
              columns={2}
              sx={{
                alignItems: "center",
                "@media (min-width: 0px)": {
                  height: "400px",
                },
                "@media (min-width: 600px)": {
                  height: "420px",
                },
              }}
            >
              <Grid
                item
                xs={2}
                md={1}
                sx={{
                  paddingX: { xs: "6px", sm: "8px", md: "12px" },
                }}
              >
                <CardMedia
                  sx={{ borderRadius: "8px", height: { xs: 300, md: "auto" } }}
                  component="img"
                  image="/post.png"
                  alt="post.png"
                />
              </Grid>
              <Grid
                item
                xs={2}
                md={1}
                sx={{ paddingLeft: { xs: 0, md: "24px" } }}
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
                      color: "#000",
                      fontSize: { xs: "18px", sm: "22px", md: "26px" },
                      "@media (max-width: 390px)": {
                        marginTop: "24px",
                      },
                    }}
                  >
                    Đăng bài hỏi đáp
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 400,
                      color: "#000",
                      mt: 1.5,
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      textAlign: "justify",
                      paddingX: { xs: "6px", sm: "8px", md: "12px" },
                    }}
                  >
                    Tại Đăng Bài Hỏi Đáp, chúng tôi mời bạn thảo luận, tìm kiếm
                    giải đáp và chia sẻ kiến thức. Dù bạn đang đối mặt với vấn
                    đề kỹ thuật, cần tư vấn về sự nghiệp, hay muốn tìm hiểu về
                    một chủ đề cụ thể, đây là nơi lý tưởng để đặt những câu hỏi
                    của bạn.
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid
              container
              columns={2}
              sx={{
                alignItems: "center",
                "@media (min-width: 0px)": {
                  height: "400px",
                },
                "@media (min-width: 600px)": {
                  height: "420px",
                },
              }}
            >
              <Grid
                item
                xs={2}
                md={1}
                sx={{
                  paddingX: { xs: "6px", sm: "8px", md: "12px" },
                }}
              >
                <CardMedia
                  sx={{ borderRadius: "8px", height: { xs: 300, md: "auto" } }}
                  component="img"
                  image="/Capture-1.jpg"
                  alt="Capture-1.jpg"
                />
              </Grid>
              <Grid
                item
                xs={2}
                md={1}
                sx={{ paddingLeft: { xs: 0, md: "24px" } }}
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
                      color: "#000",
                      fontSize: { xs: "18px", sm: "22px", md: "26px" },
                      "@media (max-width: 390px)": {
                        marginTop: "24px",
                      },
                    }}
                  >
                    Kết nối với Mentor
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 400,
                      color: "#000",
                      mt: 1.5,
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      textAlign: "justify",
                      paddingX: { xs: "6px", sm: "8px", md: "12px" },
                    }}
                  >
                    Tại Kết Nối với Mentor, chúng tôi kết nối bạn với cộng đồng
                    các chuyên gia có sẵn để chia sẻ kiến thức và kinh nghiệm
                    của họ. Dù bạn là người mới vào ngành nghề hay muốn phát
                    triển sự nghiệp của mình, đây là nơi bạn có thể tìm kiếm sự
                    hỗ trợ và tư vấn từ những người có kinh nghiệm.
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Slider>
      </Container>
    </Box>
  );
};

export default SliderAbout;
