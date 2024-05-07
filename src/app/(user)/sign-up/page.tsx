import AppSignUp from "@/components/sign/app.sign";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const AppSign = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppSignUp />
    </Box>
  );
};
export default AppSign;
