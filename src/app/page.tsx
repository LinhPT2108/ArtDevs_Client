import About from "@/components/about/app.about";
import RightPost from "@/components/left-menu/app.right.menu";
import PostProfile from "@/components/profile/post.profile";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { Box, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Post from "@/components/posts/post.main";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);
  let firstName = session?.user?.firstName ? session?.user?.firstName : "";
  let middleName = session?.user?.middleName ? session?.user?.middleName : "";
  let lastName = session?.user?.lastName ? session?.user?.lastName : "";
  let fullname = firstName + " " + middleName + " " + lastName;
  const post = await sendRequest<Post[]>({
    url: GLOBAL_URL + "/api/post/page",
    method: "GET",
    headers: { authorization: `Bearer ${session?.access_token}` },
    queryParams: {
      page: 0,
    },
  });
  if (session) {
    return (
      <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
        <Box
          sx={{
            marginTop: "12px",
            padding: { xs: "0 24px", md: "0 0 0 0" },
            flexGrow: 1,
          }}
        >
          <Box>
            {/* <Post user={session} post={post} /> */}
            <PostProfile session={session} />
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            padding: "0 0 0 12px",
            justifyContent: "flex-start",
            maxWidth: "250px",
            minWidth: "210px",
          }}
        >
          <RightPost session={session} />
        </Box>
      </Box>
    );
  }
  return <About />;
}
