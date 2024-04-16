import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import About from "@/components/about/app.about";
import RightPost from "@/components/left-menu/app.right.menu";
import PostProfile from "@/components/profile/post.profile";
import { Box } from "@mui/material";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);

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
            <PostProfile session={session} friendPost="/friend-posts" />
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
