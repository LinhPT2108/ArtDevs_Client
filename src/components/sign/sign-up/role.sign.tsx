import { Box, Grid } from "@mui/material";

const RoleSign = () => {
  return (
    <Box>
      <Box sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}>
        Hãy chọn vai trò của bạn
      </Box>
      <Grid columns={2} spacing={2} container>
        <Grid item xs={2} md={1}>
          Học viên
        </Grid>
        <Grid item xs={2} md={1}>
          Giảng viên
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoleSign;
