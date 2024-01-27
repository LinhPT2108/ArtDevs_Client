import React from "react";
import About from "@/components/about/app.about";
// import { useSession, signIn, signOut } from "next-auth/react";
import NextWrapper from "@/lib/next.wrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);
  // const res = await sendRequest({
  //   url: "https://artdevs-server.azurewebsites.net/api/user-social",
  //   method: "GET",
  //   queryParams: {
  //     email: "user8@example.com",
  //     provider: "githubee",
  //   },
  // });

  console.log(">>> check res data 123: ", session);
  if (session) {
    return <NextWrapper user={session} />;
  }
  return <About />;
}
