import { CardMedia, Grid } from "@mui/material";
import Box from "@mui/material/Box";
const ShareAbout = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          color: "#000",
          fontWeight: 700,
          fontSize: { xs: "24px", sm: "36px", md: "48px" },
          paddingBottom: "24px",
          paddingX: { xs: "24px", md: "12px", lg: 0 },
        }}
      >
        Chia sẻ kiến thức lập trình
      </Box>
      <Grid columns={2} container sx={{ alignItems: "center" }}>
        <Grid
          item
          xs={2}
          md={1}
          sx={{ paddingX: { xs: "24px", md: "12px", lg: 0 } }}
        >
          <CardMedia
            sx={{
              borderRadius: "8px",
              height: { xs: 300, md: "auto" },
            }}
            component="img"
            image="/share-it.webp"
            alt="share-it.webp"
          />
        </Grid>
        <Grid item xs={2} md={1}>
          <Box
            sx={{
              color: "#000",
              fontSize: { xs: "18px", sm: "22px", md: "26px" },
              textAlign: "justify",
              marginLeft: "24px",
              marginRight: { xs: "24px", md: "12px" },
              marginTop: { xs: "16px", md: 0 },
            }}
          >
            Tại Đăng Bài Hỏi Đáp, chúng tôi mời bạn thảo luận, tìm kiếm giải đáp
            và chia sẻ kiến thức. Dù bạn đang đối mặt với vấn đề kỹ thuật, cần
            tư vấn về sự nghiệp, hay muốn tìm hiểu về một chủ đề cụ thể, đây là
            nơi lý tưởng để đặt những câu hỏi của bạn.
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ShareAbout;
