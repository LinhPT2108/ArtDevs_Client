"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { signIn } from "next-auth/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import BgUtils from "../utils/bg.utils";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Snowfall from "react-snowfall";

interface State extends SnackbarOrigin {
  open: boolean;
}

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPassword, setMessageErrorPassword] = useState<string>("");

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleChangeEmail = (value: string) => {
    setIsErrorEmail(false);
    setMessageErrorEmail("");
    setEmail(value);
  };
  const handleChangePassword = (value: string) => {
    setIsErrorPassword(false);
    setMessageErrorPassword("");
    setPassword(value);
  };

  const handleSubmit = async () => {
    setIsErrorEmail(false);
    setIsErrorPassword(false);
    setMessageErrorEmail("");
    setMessageErrorPassword("");
    if (!email) {
      setIsErrorEmail(true);
      setMessageErrorEmail("Email không được để trống !");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setMessageErrorPassword("Mật khẩu không được để trống !");
      return;
    }
    const res = await signIn("credentials", {
      username: email,
      password: password,
      redirect: false,
    });
    if (!res?.error) {
      router.push("/");
    } else {
      setIsErrorEmail(true);
      setIsErrorPassword(true);
      handleClick({ vertical: "top", horizontal: "center" })(
        {} as React.MouseEvent
      );
    }
  };

  const handleClick =
    (newState: SnackbarOrigin) => (event: React.MouseEvent) => {
      setState({ ...newState, open: true });
    };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const [snowfallImages, setSnowfallImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadImage = async () => {
      const image = new Image();
      image.src = "/snowflake.png";
      await image.decode();
      setSnowfallImages([image]);
    };

    loadImage();
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#EFF2F5",
        display: "flex",
      }}
    >
      <Snowfall
        snowflakeCount={200}
        speed={[0.5, 2.5]}
        wind={[0, 3]}
        radius={[1, 15]}
        rotationSpeed={[-1, 1]}
        images={snowfallImages}
      />
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
                  fontWeight: 700,
                  "& a": {
                    color: "#0766FF",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#0045b5",
                    },
                  },
                }}
              >
                <Link href="/">Art Devs</Link>
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

              {/* <BgUtils color="#e0e0e0" /> */}
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
              <Box
                sx={{
                  "& input:-internal-autofill-selected": {
                    WebkitBoxShadow: "0 0 0 1000px #fff inset",
                  },
                }}
              >
                <TextField
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email hoặc số điện thoại"
                  name="email"
                  autoComplete="new-email"
                  autoFocus
                  error={isErrorEmail}
                  helperText={messageErrorEmail}
                  sx={{ marginBottom: "0" }}
                />

                <TextField
                  onChange={(e) => handleChangePassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type={!showPassword ? "password" : "text"}
                  id="password"
                  autoComplete="new-password"
                  error={isErrorPassword}
                  helperText={messageErrorPassword}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ fontSize: "20px" }}
                  onClick={handleSubmit}
                >
                  Đăng nhập
                </Button>
              </Box>
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
                      width: "305px",
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
                      width: "305px",
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
                    onClick={() => signIn("google")}
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
                      width: "305px",
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
                    onClick={() => signIn("github")}
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
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
              >
                <Alert
                  onClose={handleClose}
                  severity="error"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Tài khoản hoặc mật khẩu không chính xác
                </Alert>
              </Snackbar>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignIn;
