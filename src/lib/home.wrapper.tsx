"use client";

import { Box } from "@mui/material";
export default function HomeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box>{children}</Box>;
}
