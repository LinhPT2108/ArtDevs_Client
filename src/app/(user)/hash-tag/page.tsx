import { authOptions } from "@/app/api/auth/[...nextauth]";
import HomeHashtag from "@/components/hash-tag/home.hashtag";
import { GLOBAL_COLOR_MENU } from "@/components/utils/veriable.global";
import { Box, Divider, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
const AppMentor = async () => {
  const session: User | null = await getServerSession(authOptions);
  return (
    <Box>
      <Box sx={{ marginY: "12px" }}>
        <Typography
          variant="h4"
          component={"h4"}
          sx={{ color: GLOBAL_COLOR_MENU }}
        >
          Hashtags
        </Typography>
        <Typography sx={{ fontWeight: "300" }}>
          Mỗi hashtag là một từ khóa hoặc là nhãn để phân biệt nội dung bài
          viết. việc sử dụng hashtag có thể giúp tăng khả năng tìm thấy bài
          đăng, kết nối với cộng đồng và tạo ra sự tương tác từ những người có
          cùng sở thích và quan tâm đến ngôn ngữ lập trình mà họ đang quan tâm.
        </Typography>
      </Box>
      <Divider />
      {session && <HomeHashtag session={session} />}
    </Box>
  );
};
export default AppMentor;
