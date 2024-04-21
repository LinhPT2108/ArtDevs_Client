"use client";
import PostProfile from "@/components/profile/post.profile";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useParams } from "next/navigation";
import { useState } from "react";

const DetailHashTag = ({ session }: { session: User }) => {
  const params = useParams<{ hashTagText: string }>();
  return (
    <Box>
      <Divider></Divider>
      <PostProfile session={session} hashTagText={params.hashTagText} />
    </Box>
  );
};

export default DetailHashTag;
