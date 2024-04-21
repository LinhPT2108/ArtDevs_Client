import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeMentor from "@/components/mentor/home.mentor";
import NextAuthWrapper from "@/lib/next.auth.provider";
import { getServerSession } from "next-auth";
const AppMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <NextAuthWrapper>
      {session && <HomeMentor user={session} />}
    </NextAuthWrapper>
  );
};
export default AppMentor;
