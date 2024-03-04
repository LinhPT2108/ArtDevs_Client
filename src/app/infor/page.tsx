import HomeInfor from "@/components/infor/home.infor";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const LastEvent = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>{session && <HomeInfor session={session} />}</Box>
  );
};
export default LastEvent;