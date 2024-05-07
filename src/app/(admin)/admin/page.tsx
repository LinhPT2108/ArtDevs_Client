import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppAdmin from "@/components/admin/app.admin";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
const Admin = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppAdmin session={session} />
    </Box>
  );
};
export default Admin;
