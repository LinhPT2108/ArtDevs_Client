import NextAuthWrapper from "@/lib/next.auth.provider";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import NextWrapperHashtag from "@/lib/next.hashtag";
const AppMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <NextAuthWrapper>
      <NextWrapperHashtag user={session} />
    </NextAuthWrapper>
  );
};
export default AppMentor;
