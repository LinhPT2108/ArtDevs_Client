"use client";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

const AppAdmin = ({ session }: { session: User | null }) => {
  const router = useRouter();
  if (!session) {
    router.push("/admin/login");
  } else {
    router.push("/admin/dashboard");
  }
  return <Box sx={{ flexGrow: 1 }}>AppAdmin</Box>;
};
export default AppAdmin;
