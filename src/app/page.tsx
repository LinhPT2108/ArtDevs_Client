import React from "react";
import About from "@/components/about/app.about";
// import { useSession, signIn, signOut } from "next-auth/react";
import NextWrapper from "@/lib/next.wrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session: User | null = await getServerSession(authOptions);
  console.log(">check session : ", session);
  if (session) {
    return <NextWrapper user={session} />;
  }
  return <About />;
}
