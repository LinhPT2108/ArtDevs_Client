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
  if (session) {
    return (
      <Grid
        container
        spacing={0}
        columns={12}
        sx={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={8}
          xl={9}
          sx={{
            marginTop: "12px",
            padding: { xs: "0 24px", md: "0 0 0 0" },
          }}
        >
          <Post user={session} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={4}
          xl={3}
          sx={{
            display: { xs: "none", md: "flex" },
            padding: "0px 12px 0px 12px",
            justifyContent: "flex-start",
          }}
        >
          <RightPost />
        </Grid>
      </Grid>
    );
  }
  return <About />;
}
