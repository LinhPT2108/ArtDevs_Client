import HomeSecure from "@/components/secure/home.secure";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const Secure = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {session && <HomeSecure session={session} />}
    </Box>
  );
};
export default Secure;
