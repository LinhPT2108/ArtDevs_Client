"use client";

import AppHome from "@/components/home/app.home";
import { Box } from "@mui/material";
interface IPros {
  user: User;
  fetchPost: Post[];
}
export default function NextWrapper(pros: IPros) {
  const { user, fetchPost } = pros;

  return (
    <Box>
      <AppHome user={user} fetchPost={fetchPost} />
    </Box>
  );
}
