import HomeProfile from "@/components/profile/home.profile";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const Profile = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <HomeProfile session={session} />}
    </Box>
  );
};
export default Profile;
