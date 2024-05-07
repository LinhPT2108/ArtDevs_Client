import DetailPost from "@/components/posts/detail.post";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const Post = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <DetailPost session={session} />}
    </Box>
  );
};
export default Post;
