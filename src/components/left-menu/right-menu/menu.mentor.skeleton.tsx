"use client";
import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";

const MenuMentorSkeleton = () => {
  return (
    <>
      <Card sx={{ padding: "12px", m: 2 }}>
        <Skeleton sx={{ height: 50 }} animation="wave" variant="rectangular" />
        <Skeleton
          sx={{ marginY: "6px" }}
          animation="wave"
          variant="rounded"
          width="100%"
          height={150}
        />
        <Skeleton animation="wave" variant="rounded" width="100%" height={50} />
      </Card>
      <Card sx={{ padding: "12px", m: 2 }}>
        <Skeleton sx={{ height: 50 }} animation="wave" variant="rectangular" />
        <Skeleton
          sx={{ marginY: "6px" }}
          animation="wave"
          variant="rounded"
          width="100%"
          height={150}
        />
        <Skeleton animation="wave" variant="rounded" width="100%" height={50} />
      </Card>
      <Card sx={{ padding: "12px", m: 2 }}>
        <Skeleton sx={{ height: 50 }} animation="wave" variant="rectangular" />
        <Skeleton
          sx={{ marginY: "6px" }}
          animation="wave"
          variant="rounded"
          width="100%"
          height={150}
        />
        <Skeleton animation="wave" variant="rounded" width="100%" height={50} />
      </Card>
    </>
  );
};
export default MenuMentorSkeleton;
