"use client";
import PostProfile from "@/components/profile/post.profile";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";

const DetailHashTag = ({ session }: { session: User }) => {
  const params = useParams<{ hashTagText: string }>();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          margin: "auto",
          maxWidth: {
            xs: "95%",
            sm: "100%",
          },
        }}
      >
        <PostProfile session={session} hashTagText={params.hashTagText} />
      </Box>
    </Box>
  );
};

export default DetailHashTag;
