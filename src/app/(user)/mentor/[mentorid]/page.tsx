import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DetailMentor from "@/components/mentor/detail.mentor";
import HomeMentor from "@/components/mentor/home.mentor";
import NextAuthWrapper from "@/lib/next.auth.provider";
import { getServerSession } from "next-auth";

const AppMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  // const fecthListMentor = await sendRequest<MentorInfor[]>({
  //   url: `${GLOBAL_URL}/api/get-mentor`,
  //   method: "GET",
  //   headers: { authorization: `Bearer ${session?.access_token}` },
  // });
  return (
    <NextAuthWrapper>
      {session && <DetailMentor user={session} />}
    </NextAuthWrapper>
  );
};
export default AppMentor;
