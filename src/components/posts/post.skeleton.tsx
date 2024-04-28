"use client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

const PostSkeleton = () => {
  return (
    <>
      <Card sx={{ padding: "12px", m: 2 }}>
        <CardHeader
          sx={{ padding: "0", marginY: 0 }}
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={60}
              height={60}
            />
          }
          title={<Skeleton animation="wave" width="100%" height={80} />}
        />
        <Grid columns={12} container spacing={1}>
          <Grid item xs={6}>
            <Skeleton
              sx={{ height: 60 }}
              animation="wave"
              variant="rectangular"
            />
          </Grid>
          <Grid item xs={6}>
            <Skeleton
              sx={{ height: 60 }}
              animation="wave"
              variant="rectangular"
            />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ padding: "12px", m: 2 }}>
        <CardHeader
          sx={{ padding: "8px 0" }}
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={80}
              height={80}
            />
          }
          title={<Skeleton animation="wave" width="80%" height={30} />}
          subheader={<Skeleton animation="wave" height={30} width="40%" />}
        />
        <CardContent sx={{ padding: "0" }}>
          <Skeleton animation="wave" height={80} style={{ marginBottom: 0 }} />
        </CardContent>
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      </Card>
      <Card sx={{ padding: "12px", m: 2 }}>
        <CardHeader
          sx={{ padding: "8px 0" }}
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={80}
              height={80}
            />
          }
          title={<Skeleton animation="wave" width="80%" height={30} />}
          subheader={<Skeleton animation="wave" height={30} width="40%" />}
        />
        <CardContent sx={{ padding: "0" }}>
          <Skeleton animation="wave" height={80} style={{ marginBottom: 0 }} />
        </CardContent>
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      </Card>
      <Card sx={{ padding: "12px", m: 2 }}>
        <CardHeader
          sx={{ padding: "8px 0" }}
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={80}
              height={80}
            />
          }
          title={<Skeleton animation="wave" width="80%" height={30} />}
          subheader={<Skeleton animation="wave" height={30} width="40%" />}
        />
        <CardContent sx={{ padding: "0" }}>
          <Skeleton animation="wave" height={80} style={{ marginBottom: 0 }} />
        </CardContent>
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      </Card>
    </>
  );
};
export default PostSkeleton;
