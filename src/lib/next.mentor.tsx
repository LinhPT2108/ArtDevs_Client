"use client";

import AppHomeMentor from "@/components/mentor/app.mentor";
import { Box } from "@mui/material";
interface IPros {
  user: User | null;
}
export default function NextWrapperMentor(pros: IPros) {
  const { user } = pros;
  return (
    <Box>
      <AppHomeMentor user={user} />
    </Box>
  );
}
