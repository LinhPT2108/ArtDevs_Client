"use client";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Link from "next/link";
interface IPros {
  user: User | null;
}
const HomeHashtag = (pros: IPros) => {
  const { user } = pros;
  const [listHashtag, setListHashtag] = useState<HashtagInfor[]>();

  useEffect(() => {
    const handelListHashtag = async () => {
      const resListHashtag = await sendRequest<HashtagInfor[]>({
        // url: "https://artdevs-server.azurewebsites.net/api/detailhashtag",
        // url: "http://localhost:8080/api/post/page",
        url: "http://localhost:8080/api/detailhashtag",
        method: "GET",
        headers: { authorization: `Bearer ${user?.access_token}` },
      });
      resListHashtag ? setListHashtag(resListHashtag) : "";
      console.log(">>> chcekc resListHashtag: ", resListHashtag);
    };
    handelListHashtag();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, marginTop: "24px" }}>
      <Grid container columns={16} spacing={2}>
        {listHashtag &&
          listHashtag?.map((item, index) => (
            <Grid item xs={16} md={8} key={index}>
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
