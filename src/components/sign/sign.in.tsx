import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";

const SignIn = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#EFF2F5",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: { xs: "600px", md: "980px" },
          display: "flex",
          height: { xs: "100%", md: "70%" },
          margin: "auto",
        }}
      >
        <Grid container spacing={0} sx={{ margin: "0 auto" }} columns={16}>
          <Grid xs={16} md={9} item sx={{ display: "flex" }}>
            <Box
              sx={{
                padding: {
                  xs: "0 12px",
                  sm: "0 18px",
                  md: "0 12px",
                },
                margin: " auto",
                marginTop: { xs: "12px", md: "100px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  marginTop: { xs: 0, md: "32px" },
                  marginBottom: { xs: "6px", sm: "16px" },
                  color: "#0766FF",
                  fontWeight: 700,
                }}
              >
                Art Devs
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: { xs: "6px", md: "32px" },
                  textAlign: "center",
                  fontSize: { xs: "18px", md: "28px" },
                }}
              >
                Giúp bạn kết nối và chia sẻ kiến thức, kinh nghiệm với mọi người
                trong quá trình học tập và làm việc.
              </Typography>
            </Box>
          </Grid>
          <Grid xs={16} md={7} item sx={{ paddingX: "16px" }}>
            <Box
              sx={{
                padding: { xs: "0 12px", sm: "0 18px", md: "0 16px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
              }}
            >
              <Box
                sx={{
                  color: "#3A5793",
                  fontWeight: 700,
                  fontSize: "32px",
                  margin: "16px 0 8px 0",
                }}
              >
                Đăng nhập
              </Box>
              <form>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email hoặc số điện thoại"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  sx={{ marginBottom: "0" }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ fontSize: "20px" }}
                >
                  Đăng nhập
                </Button>
              </form>
              <Link
                href="#"
                sx={{
                  marginTop: "16px",
                  textDecoration: "none",
                  "&:hover": { color: "#283593" },
                }}
              >
                Quên mật khẩu?
              </Link>
              <Divider sx={{ width: "100%", margin: " 20px 16px" }} />
              <Button
                variant="contained"
                color="success"
                sx={{
                  "& a": {
                    color: "#ffffff",
                    fontSize: "17px",
                    "&:hover": { textDecoration: "none" },
                  },
                }}
              >
                <Link href="#">Tạo tài khoản mới</Link>
              </Button>
              <Box sx={{ fontWeight: "bold", marginTop: "16px" }}>Hoặc</Box>
              <Grid
                container
                spacing={0}
                sx={{
                  margin: "0 auto",
                  justifyContent: "center",
                  width: "100%",
                }}
                columns={8}
              >
                <Grid
                  item
                  xs={8}
                  sx={{
                    marginTop: "12px",
                    paddingLeft: "0",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Link
                    sx={{
                      width: "300px",
                      backgroundColor: "#3A5793",
                      fontSize: "16px",
                      textDecoration: "none",
                      color: "#ffffff",
                      fontWeight: "700",
                      display: "flex",
                      padding: "6px 8px",
                      transition: "all 0.25s linear",
                      cursor: "pointer",
                      borderRadius: "6px",
                      "&:hover": {
                        backgroundColor: "#283e68",
                      },
                    }}
                  >
                    <FacebookOutlinedIcon
                      sx={{
                        fontSize: "32px",
                        color: "#3A5793",
                        backgroundColor: "#ffffff",
                        borderRadius: "100%",
                      }}
                    />
                    <Box
                      sx={{
                        margin: "0 6px 0 12px",
                        lineHeight: 1.9,
                        userSelect: "none",
                      }}
                    >
                      ĐĂNG NHẬP VỚI FACEBOOK
                    </Box>
                  </Link>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{
                    marginTop: "12px",
                    paddingLeft: "0",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Link
                    sx={{
                      width: "300px",
                      backgroundColor: "#CC3E2F",
                      fontSize: "16px",
                      textDecoration: "none",
                      color: "#ffffff",
                      fontWeight: "700",
                      display: "flex",
                      padding: "6px 8px",
                      justifyContent: "start",
                      transition: "all 0.25s linear",
                      cursor: "pointer",
                      borderRadius: "6px",
                      "&:hover": {
                        backgroundColor: "#702118",
                      },
                    }}
                  >
                    <GoogleIcon sx={{ fontSize: "32px" }} />
                    <Box
                      sx={{
                        margin: "0 6px 0 12px",
                        lineHeight: 1.9,
                        userSelect: "none",
                      }}
                    >
                      ĐĂNG NHẬP VỚI GOOGLE
                    </Box>
                  </Link>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{
                    marginTop: "12px",
                    marginBottom: "24px",
                    paddingLeft: "0",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Link
                    sx={{
                      width: "300px",
                      backgroundColor: "#59227F",
                      fontSize: "16px",
                      textDecoration: "none",
                      color: "#ffffff",
                      fontWeight: "700",
                      display: "flex",
                      justifyContent: "start",
                      padding: "6px 8px",
                      transition: "all 0.25s linear",
                      cursor: "pointer",
                      borderRadius: "6px",
                      "&:hover": {
                        backgroundColor: "#301246",
                      },
                    }}
                  >
                    <GitHubIcon
                      sx={{
                        fontSize: "32px",
                        borderRadius: "100%",
                      }}
                    />
                    <Box
                      sx={{
                        margin: "0 6px 0 12px",
                        lineHeight: 1.9,
                        userSelect: "none",
                      }}
                    >
                      ĐĂNG NHẬP VỚI GITHUB
                    </Box>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignIn;
