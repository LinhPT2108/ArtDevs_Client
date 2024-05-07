import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeFeedback from "@/components/feedback/home.setting";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
const Setting = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <HomeFeedback session={session} />}
    </Box>
  );
};
export default Setting;
