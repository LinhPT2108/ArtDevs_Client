import RightPost from "@/components/left-menu/app.right.menu";
import { Box, Grid } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import About from "@/components/about/app.about";
import Post from "@/components/posts/post.main";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);
  // const post = await sendRequest<Post[]>({
  //   url: GLOBAL_URL + "/api/post/page",
  //   method: "GET",
  //   headers: { authorization: `Bearer ${session?.access_token}` },
  //   queryParams: {
  //     page: 0,
  //   },
  // });
  console.log("check session", session);
  if (session) {
    return (
      <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
        <Box
          sx={{
            marginTop: "12px",
            padding: { xs: "0 24px", md: "0 0 0 0" },
          }}
        >
          <Post user={session} />
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
