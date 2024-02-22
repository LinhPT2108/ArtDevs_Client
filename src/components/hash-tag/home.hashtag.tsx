"use client";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { CubeSpan } from "../utils/component.global";

const HomeHashtag = () => {
  const fetchData = async (url: string) => {
    return await sendRequest<HashtagInfor[]>({
      url: url,
      method: "GET",
    });
  };
  const { data, error, isLoading }: SWRResponse<HashtagInfor[], any> = useSWR(
    "http://localhost:8080/api/detailhashtag",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

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
      <Grid
        container
        columns={16}
        spacing={2}
        sx={{
          "& .MuiGrid-item": {
            padding: { xs: "0 0 16px 16px" },
          },
        }}
      >
        {data &&
          data?.map((item, index) => (
            <Grid item xs={12} md={8} key={index}>
              <Card sx={{ borderRadius: "32px" }}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image={`/hashtag/${item.hashtagText}.png`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.hashtagText}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: "16px" }}>
                  <Typography variant="body2" color="text.secondary">
                    {`${item.countHashtagOfDetail} Bài đăng`}
                  </Typography>
                  <Link href="/">Xem thêm</Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
export default HomeHashtag;
