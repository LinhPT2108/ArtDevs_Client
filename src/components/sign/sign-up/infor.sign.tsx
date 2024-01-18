import { Box, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface IPros {
  onInputChange: (data: string) => void;
}
const InforSign: React.FC<IPros> = ({ onInputChange }) => {
  return (
    <Box>
      <Box sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}>
        Thông tin cá nhân
      </Box>
      <Box sx={{ display: "flex" }}>
        <Grid container columns={15} spacing={2} sx={{ margin: "auto" }}>
          <Grid item xs={15} columns={15} container spacing={2}>
            <Grid item xs={15} md={5}></Grid>
            <Grid item xs={15} md={5}>
              Tên đệm
            </Grid>
            <Grid item xs={15} md={5}>
              Tên
            </Grid>
          </Grid>
          <Grid item xs={15} columns={15} container spacing={2}>
            <Grid item xs={15} md={5}>
              Email
            </Grid>
          </Grid>
          <Grid item xs={15} columns={15} container spacing={2}>
            <Grid item xs={15} md={5}>
              Mật khẩu
            </Grid>
            <Grid item xs={15} md={5}>
              Xác nhận mật khẩu
            </Grid>
          </Grid>
          <Grid item xs={15} columns={15} container spacing={2}>
            <Grid item xs={15} md={5}>
              Ngày sinh
            </Grid>
            <Grid item xs={15} md={5}>
              Giới tính
            </Grid>
          </Grid>
          <Grid item xs={15} columns={15} container spacing={2}>
            <Grid item xs={15} md={5}>
              Tỉnh/Thành Phố
            </Grid>
            <Grid item xs={15} md={5}>
              Quận/Huyện
            </Grid>
            <Grid item xs={15} md={5}>
              Xã/Phường
            </Grid>
          </Grid>
          <Grid item xs={15} columns={15} container spacing={2}>
            <Grid item xs={15} md={5}>
              Điều khoản và chính sách
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InforSign;
