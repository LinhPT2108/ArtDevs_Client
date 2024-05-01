"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Container,
  CssBaseline,
  Divider,
  Grid,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import * as React from "react";
import LockIcon from "@mui/icons-material/Lock";
import { compare } from "bcryptjs";
import bcrypt from "bcryptjs";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BG_RED_300,
  GLOBAL_BG_RED_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_COLOR_WHITE,
  GLOBAL_URL,
} from "../utils/veriable.global";
import { sendRequest } from "../utils/api";

const options = ["Chỉ mình tôi", "Công khai", "Bạn bè"];
interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface IPros {
  session: User;
}
export default function HomeSecure({ session }: IPros) {
  // localStorage.setItem("vericode", session);
  const [changePassword, setChangePassword] = React.useState<ReponseError>();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [anchorEls, setAnchorEls] = React.useState<Array<null | HTMLElement>>(
    Array(options.length).fill(null)
  );
  const [selectedIndexes, setSelectedIndexes] = React.useState<Array<number>>(
    Array(options.length).fill(1)
  );
  const [formData, setFormData] = React.useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  let listActivity = [
    "Ai có thể xem các bài viết của bạn trong tương lai?",
    "Giới hạn đối tượng cho các bài viết bạn đã chia sẻ với Bạn của bạn bè hoặc chia sẻ Công khai?",
    "Ai có thể nhìn thấy những người, Trang và danh sách mà bạn theo dõi?",
  ];
  const handleClickListItem =
    (index: number) => (event: React.MouseEvent<HTMLElement>) => {
      const newAnchorEls = [...anchorEls];
      newAnchorEls[index] = event.currentTarget;
      setAnchorEls(newAnchorEls);
    };

  const handleMenuItemClick = (index: number, optionIndex: number) => () => {
    const newSelectedIndexes = [...selectedIndexes];
    newSelectedIndexes[index] = optionIndex;
    setSelectedIndexes(newSelectedIndexes);
    setAnchorEls(Array(options.length).fill(null)); // Close all menus
  };

  const handleClose = (index: number) => () => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check if newPassword and confirmPassword match
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    // Check if oldPassword is not empty (you can add more validation logic)
    if (!formData.oldPassword) {
      alert("Vui lòng nhập mật khẩu cũ.");
      return;
    }

    // Handle the form submission with the entered data
    console.log("Form Data:", formData);
    console.log("sesstion:", session);
    const response = await sendRequest<ReponseError>({
      url: GLOBAL_URL + "/api/changepass",
      headers: {
        authorization: `Bearer ${session?.access_token}`,
      },
      body: { ...formData },
      method: "POST",
    });

    console.log(" check API changpass", response.message);
    setChangePassword(response);
    showSnackbar();
    // Reset the form after successful submission
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginTop: "12px" }}>
        <Typography component={"h4"} variant="h4">
          Bảo mật
        </Typography>
        <Divider sx={{ marginBottom: "24px" }} />
        <Card sx={{ maxWidth: 1200 }}>
          <CardHeader
            title="Đăng nhập"
            sx={{
              boxShadow: "0 0 1px 1px #8080806b",
              backgroundColor: "#f5f6f7",
            }}
          />

          <Box>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f6f787",
                }}
              >
                Đổi mật khẩu
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  columns={6}
                  sx={{
                    flexDirection: {
                      xs: "column-reverse",
                      sm: "row",
                    },
                  }}
                >
                  <Grid item container xs={5} md={1} columns={3} spacing={2}>
                    <Grid item xs={3}>
                      <TextField
                        id="filled-password-input"
                        label="Mật khẩu cũ"
                        type="password"
                        variant="filled"
                        fullWidth
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="filled-new-password-input"
                        label="Mật khẩu mới"
                        type="password"
                        variant="filled"
                        fullWidth
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="filled-confirm-password-input"
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        variant="filled"
                        fullWidth
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Box
                        sx={{
                          minWidth: "90px",
                          textAlign: "center",
                          borderRadius: "30px",
                          padding: "8px 16px",
                          boxShadow: GLOBAL_BOXSHADOW,
                          border: "1px solid red",
                          fontWeight: "bold",
                          color: GLOBAL_COLOR_MENU,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          marginX: "6px",
                          "&:hover": {
                            transform: "scale(1.03)",
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        Hủy bỏ
                      </Box>
                      <Box
                        sx={{
                          minWidth: "90px",
                          textAlign: "center",
                          borderRadius: "30px",
                          padding: "8px 16px",
                          boxShadow: GLOBAL_BOXSHADOW,
                          background: GLOBAL_BG_BLUE_900,
                          fontWeight: "bold",
                          color: GLOBAL_COLOR_WHITE,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "scale(1.03)",
                            backgroundColor: GLOBAL_BG_BLUE_300,
                          },
                        }}
                        onClick={handleSubmit}
                      >
                        Lưu lại
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={5}
                    md={2}
                    columns={3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="194"
                      image="/locked.png"
                      alt="lock"
                      sx={{
                        maxWidth: "40%",
                        width: "auto",
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) ",
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Card>
      </Container>
      <Snackbar
        open={snackbarOpen}
        message={changePassword?.message}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        sx={{
          color: "white",
          backgroundColor: "#4CAF50",
        }}
      />
    </React.Fragment>
  );
}
