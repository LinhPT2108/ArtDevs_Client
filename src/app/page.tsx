import About from "@/components/about/app.about";
// import { useSession, signIn, signOut } from "next-auth/react";
import NextWrapper from "@/lib/next.wrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/components/utils/api";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);
  const fetchPost = await sendRequest<Post[]>({
    // url: "https://artdevs-server.azurewebsites.net/api/post/page",
    // url: "http://localhost:8080/api/post/page",
    url: "http://localhost:8080/api/post",
    method: "GET",
    headers: { authorization: `Bearer ${session?.access_token}` },
    queryParams: {
      page: 0,
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  });

  // const [post, setPost] = useState();
  console.log(">>> check fetch post: ", fetchPost);

  if (session) {
    return <NextWrapper user={session} fetchPost={fetchPost} />;
  }
  return <About />;
}
