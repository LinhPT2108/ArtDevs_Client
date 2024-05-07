import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeActivity from "@/components/activity/home.activity";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
const Activity = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <HomeActivity session={session} />}
    </Box>
  );
};
export default Activity;
