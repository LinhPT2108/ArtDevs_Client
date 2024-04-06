import { Box } from "@mui/material";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import { GLOBAL_BG_NAV } from "../utils/veriable.global";
const ChatNone = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "86vh",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(to right, #ff8a00, #e52e71)",
          padding: "24px",
          borderRadius: "70% 30% 15% 85% / 70% 85% 15% 30%",
        }}
      >
        <UpcomingIcon
          sx={{
            color: "#ffffff",
            fontSize: "48px",
          }}
        />
      </Box>
      <Box sx={{ fontWeight: "bolder", fontSize: "20px" }}>
        Vui lòng chọn người để chat !
      </Box>
    </Box>
  );
};

export default ChatNone;
