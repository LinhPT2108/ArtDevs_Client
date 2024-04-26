"use client";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { CubeSpan } from "../utils/component.global";

const AppAdmin = ({ session }: { session: User | null }) => {
  const router = useRouter();
  if (!session) {
    router.push("/admin/login");
  } else {
    if (session?.user?.role?.roleName != "admin") {
      router.push("/admin/error");
    } else {
      router.push("/admin/dashboard");
    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 2,
          backgroundColor: "rgba(232,232,232,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="cube-loader">
          <div className="cube-top"></div>
          <div className="cube-wrapper">
            {[0, 1, 2, 3].map((index) => (
              <CubeSpan key={index} index={index} />
            ))}
          </div>
        </div>
      </Box>
    </Box>
  );
};
export default AppAdmin;
