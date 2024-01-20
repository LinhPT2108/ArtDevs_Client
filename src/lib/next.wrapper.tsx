"use client";

import AppHome from "@/components/home/app.home";
import { Box } from "@mui/material";
interface IPros {
  user: User;
}
export default function NextWrapper(pros: IPros) {
  const { user } = pros;
  return (
    <Box>
      <AppHome user={user} />
    </Box>
  );
}
