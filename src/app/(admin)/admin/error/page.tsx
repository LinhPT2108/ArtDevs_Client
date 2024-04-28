import { GLOBAL_COLOR_MENU } from "@/components/utils/veriable.global";
import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import ForwardIcon from "@mui/icons-material/Forward";
const Error = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        "& a": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          fontSize: 28,
          color: GLOBAL_COLOR_MENU,
          "& .MuiSvgIcon-root": {
            transform: "rotate(180deg)",
            marginRight: "6px",
          },
        },
      }}
    >
      <Link href="/">
        <ForwardIcon />
        Quay về trang chủ
      </Link>
      <Image
        src="/locked_error.png"
        width={851}
        height={315}
        alt="locked.png"
      />
    </Box>
  );
};
export default Error;
