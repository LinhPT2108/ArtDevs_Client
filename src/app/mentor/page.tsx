import HomeMentor from "@/components/mentor/home.mentor";
import NextAuthWrapper from "@/lib/next.auth.provider";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
const AppMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  // const fecthListMentor = await sendRequest<MentorInfor[]>({
  //   url: `${GLOBAL_URL}/api/get-mentor`,
  //   method: "GET",
  //   headers: { authorization: `Bearer ${session?.access_token}` },
  // });
  return (
    <NextAuthWrapper>
      {session && <HomeMentor user={session} />}
    </NextAuthWrapper>
  );
};
export default AppMentor;
