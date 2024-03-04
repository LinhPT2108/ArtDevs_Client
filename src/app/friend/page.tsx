import HomeProfile from "@/components/profile/home.profile";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import HomeFriend from "@/components/friend/home.friend";
const Friend = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <HomeFriend session={session} />}
    </Box>
  );
};
export default Friend;