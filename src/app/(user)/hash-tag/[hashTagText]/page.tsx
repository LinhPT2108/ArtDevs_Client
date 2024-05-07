import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DetailHashTag from "@/components/hash-tag/detail.hashtag";
import { getServerSession } from "next-auth";

const AppDetailHashtag = async () => {
  const session: User | null = await getServerSession(authOptions);
  return <>{session && <DetailHashTag session={session} />}</>;
};

export default AppDetailHashtag;
