import NextAuthWrapper from "@/lib/next.auth.provider";
import NextWrapperMentor from "@/lib/next.mentor";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const AppMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <NextAuthWrapper>
      <NextWrapperMentor user={session} />
    </NextAuthWrapper>
  );
};
export default AppMentor;
