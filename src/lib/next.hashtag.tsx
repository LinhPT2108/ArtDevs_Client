"use client";

import AppHomeHashtag from "@/components/hash-tag/app.hashtag";
import { Box } from "@mui/material";
interface IPros {
  user: User | null;
}
export default function NextWrapperHashtag(pros: IPros) {
  const { user } = pros;
  return (
    <Box>
      <AppHomeHashtag user={user} />
    </Box>
  );
}
