import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_MENU,
  GLOBAL_COLOR_WHITE,
  GLOBAL_SEND_FRIEND,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { formatDayVN } from "../utils/utils";
import { useRouter } from "next/navigation";

interface IPros {
  hashtags: HashtagInfor[];
}

export default function SearchHashtag({ hashtags }: IPros) {
  //biến setting slide show
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  //biến chuyển hướng
  const router = useRouter();

  //xử lý chuyển hướng
  const handleRedirectHashtag = (hashtagText: string) => {
    router.push(`/hash-tag/${hashtagText}`);
  };

  return (
    <Box sx={{ marginY: "24px" }}>
      <Slider {...settings}>
        {
          //@ts-ignore
          !hashtags?.statusCode &&
            hashtags?.map((item, index) => (
              <Box key={index} sx={{ paddingX: "6px" }}>
                <Card sx={{ padding: "12px" }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        onClick={() => {
                          handleRedirectHashtag(item?.hashtagText);
                        }}
                        sx={{
                          width: "auto",
                          padding: "0 12px",
                          minWidth: "80px",
                          textDecoration: "none",
                          fontWeight: "bold",
                          boxShadow: `0 0 3px 1px ${GLOBAL_BG_BLUE_900}`,
                          textAlign: "center",
                          color: GLOBAL_BG_BLUE_900,
                          borderRadius: "16px",
                          transition: "all .2s",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      >
                        {item?.hashtagText}
                      </Box>
                    </Box>
                    <Box
                      height={100}
                      sx={{
                        fontSize: { md: "14px", lg: "16px" },
                        textAlign: "justify",
                        lineHeight: "1.4",
                        maxHeight: 4 * 1.4 + "em",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 4,
                        color: GLOBAL_COLOR_MENU,
                      }}
                    >
                      {item?.description ? item?.description : "..."}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "8px",
                        color: GLOBAL_COLOR_MENU,
                      }}
                    >
                      <Box
                        width={100}
                        height={30}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          fontSize: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            marginRight: "4px",
                            fontSize: "14px",
                          }}
                        >
                          {item?.totalPostUseHashtag}
                        </Typography>
                        bài viết
                      </Box>
                      <Box
                        width={100}
                        height={30}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          fontSize: "12px",
                        }}
                      >
                        Ngày tạo{" "}
                        <Typography
                          sx={{ fontWeight: "bold", fontSize: "14px" }}
                        >
                          {formatDayVN(item?.timeCreate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Card>
              </Box>
            ))
        }
      </Slider>
    </Box>
  );
}
