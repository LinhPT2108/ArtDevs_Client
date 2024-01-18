import { Box, Grid } from "@mui/material";

const KnowlegdeSign = () => {
  return (
    <Box>
      <Box sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}>
        Chọn chủ đề bạn quan tâm
      </Box>
      <Grid columns={2} spacing={2} container>
        <Grid item xs={2}>
          Nhập lĩnh vực bạn quan tâm
        </Grid>
        <Grid item xs={2}>
          Trả về kế quả khi nhập
        </Grid>
      </Grid>
    </Box>
  );
};

export default KnowlegdeSign;
