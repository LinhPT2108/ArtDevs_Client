import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box, Card } from "@mui/material";

export default function HashtagSkeleton() {
  return (
    <Card sx={{ padding: "12px" }}>
      <Stack spacing={1}>
        <Box sx={{ maxWidth: "100px" }}>
          <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
        </Box>
        <Skeleton variant="rounded" height={100} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "8px",
          }}
        >
          <Skeleton variant="rounded" width={100} height={30} />
          <Skeleton variant="rounded" width={100} height={30} />
        </Box>
      </Stack>
    </Card>
  );
}
