import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeUpgradeMentor from "@/components/upgrade-mentor/home.update";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
const UpgradeMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <HomeUpgradeMentor session={session} />}
    </Box>
  );
};
export default UpgradeMentor;
