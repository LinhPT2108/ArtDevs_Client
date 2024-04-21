"use client";
import { Avatar, CardHeader, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Link from "next/link";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { CubeSpan } from "../utils/component.global";

const HomeHashtag = () => {
  const fetchData = async (url: string) => {
    return await sendRequest<ReponseHashTag>({
      url: url,
      method: "GET",
    });
  };
  const { data, error, isLoading }: SWRResponse<ReponseHashTag, any> = useSWR(
    "http://localhost:8080/api/detailhashtag",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  console.log("Check data hashtag: ", data);
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "100px",
          height: "86vh",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="cube-loader">
            <div className="cube-top"></div>
            <div className="cube-wrapper">
              {[0, 1, 2, 3].map((index) => (
                <CubeSpan key={index} index={index} />
              ))}
            </div>
          </div>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, marginTop: "24px" }}>
    <Grid container columns={16} spacing={2}>
      {data?.model &&
        data?.model?.map((item, index) => (
          <Grid item xs={12} md={8} key={index}>

            <Link href={`/hash-tag/${item.hashtagText}`}>
              <Card sx={{ borderRadius: "20px" }}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe" src={`/hashtag-image/${item.hashtagText}.png`}>

                    </Avatar>
                  }
                  
                  title={item.hashtagText}
                  subheader={`${item.countHashtagOfDetail} Bài đăng`}
                />
                {/* <CardActions sx={{
                  '& a': {
                    textDecoration: "none",
                    color: "black",


                  },
                  justifyContent: "flex-end", paddingRight: "50px"
                }} disableSpacing>
                  <Link href={"/"}>Xem chi tiết</Link>

                </CardActions> */}
              </Card>
            </Link>

          </Grid>
        ))}
    </Grid>
  </Box>
  );
};
export default HomeHashtag;
