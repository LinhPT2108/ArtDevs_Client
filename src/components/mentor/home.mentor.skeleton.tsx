import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box, Grid } from "@mui/material";
import { GLOBAL_BOXSHADOW } from "../utils/veriable.global";

export default function CardMentorSkeleton() {
  return (
    <Stack
      spacing={1}
      sx={{
        boxShadow: GLOBAL_BOXSHADOW,
        paddingBottom: "12px",
      }}
    >
      <Skeleton variant="text" height={60} sx={{ fontSize: "1rem" }} />
      <Grid container columns={12} spacing={0}>
        <Grid item xs={6}>
          <Skeleton variant="rounded" width={160} height={150} />
        </Grid>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton
            variant="rectangular"
            height={40}
            sx={{ marginTop: "12px" }}
          />
        </Grid>
      </Grid>
      <Skeleton variant="rounded" height={60} />
    </Stack>
  );
}
