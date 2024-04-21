"use client";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { deleteSpace } from "../utils/utils";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_MENU,
  GLOBAL_COLOR_WHITE,
} from "../utils/veriable.global";

export default function HomeInfor({ session }: { session: User }) {
  let firstName = session?.user?.firstName ? session?.user?.firstName : "";
  let middleName = session?.user?.middleName ? session?.user?.middleName : "";
  let lastName = session?.user?.lastName ? session?.user?.lastName : "";
  let fullname = firstName + " " + middleName + " " + lastName;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //edit fullname
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // edit username
  const [openUsername, setOpenUsername] = React.useState(false);
  const handleClickOpenUsername = () => {
    setOpenUsername(true);
  };
  const handleCloseUsername = () => {
    setOpenUsername(false);
  };

  //edit email
  const [openEmail, setOpenEmail] = React.useState(false);
  const handleClickOpenEmail = () => {
    setOpenEmail(true);
  };
  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  const [isErrorFirstName, setIsErrorFirstName] =
    React.useState<boolean>(false);
  const [isErrorUserName, setIsErrorUserName] = React.useState<boolean>(false);
  const [isErrorLastName, setIsErrorLastName] = React.useState<boolean>(false);
  const [isErrorEmail, setIsErrorEmail] = React.useState<boolean>(false);
  const [messageFirstName, setMessageFirstName] = React.useState<string>("");
  const [messageLastName, setMessageLastName] = React.useState<string>("");
  const [messageUserName, setMessageUserName] = React.useState<string>("");
  const [messageEmail, setMessageEmail] = React.useState<string>("");
  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{ paddingTop: { xs: "24px", sm: 0 }, marginTop: "12px" }}
      >
        <Typography component={"h4"} variant="h4">
          Thông tin của bạn
        </Typography>
        <Divider sx={{ marginBottom: "24px" }} />
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            columns={10}
            sx={{ alignItems: "center" }}
          >
            <Grid item xs={2}>
              <Box sx={{ fontWeight: "bold", fontSize: "16" }}>Tên</Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ fontWeight: "700", color: "#65676b" }}>
                {deleteSpace(fullname)}
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box
                onClick={handleClickOpen}
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
              >
                Chỉnh sửa
              </Box>
              <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                sx={{
                  "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
                    borderRadius: "12px",
                  },
                }}
              >
                <DialogTitle
                  id="responsive-dialog-title"
                  // sx={{ borderBottom: "1px solid gray" }}
                >
                  Chỉnh sửa họ tên của bạn
                </DialogTitle>
                <Box sx={{ padding: "0 24px" }}>
                  <Divider />
                </Box>
                <DialogContent>
                  <TextField
                    // onChange={(e) => handleChangeFirstName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="first-name"
                    label="Họ"
                    name="first-name"
                    autoComplete="new-first-name"
                    autoFocus
                    value={firstName}
                    error={isErrorFirstName}
                    helperText={messageFirstName}
                    sx={{
                      marginBottom: "0",
                    }}
                  />
                  <TextField
                    // onChange={(e) => handleMiddleName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="middle-name"
                    label="Tên đệm"
                    name="middle-name"
                    autoComplete="new-middle-name"
                    autoFocus
                    value={middleName}
                    sx={{ marginBottom: "0" }}
                  />
                  <TextField
                    // onChange={(e) => handleChangeLastName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="last-name"
                    label="Tên"
                    name="last-name"
                    autoComplete="new-last-name"
                    autoFocus
                    value={lastName}
                    error={isErrorLastName}
                    helperText={messageLastName}
                    sx={{ marginBottom: "0" }}
                  />
                </DialogContent>
                <DialogActions sx={{ marginRight: "18px" }}>
                  <Box
                    autoFocus
                    onClick={handleClose}
                    sx={{
                      minWidth: "90px",
                      textAlign: "center",
                      borderRadius: "30px",
                      padding: "8px 16px",
                      boxShadow: GLOBAL_BOXSHADOW,
                      background: "#cfcfcf",
                      fontWeight: "bold",
                      color: GLOBAL_COLOR_MENU,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        backgroundColor: "#bbbbbb",
                      },
                    }}
                  >
                    Hủy bỏ
                  </Box>
                  <Box
                    onClick={handleClose}
                    autoFocus
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
                  >
                    Lưu lại
                  </Box>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: "16px" }} />

          <Grid
            container
            spacing={2}
            columns={10}
            sx={{ alignItems: "center" }}
          >
            <Grid item xs={2}>
              <Box sx={{ fontWeight: "bold", fontSize: "16" }}>
                Tên người dùng
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ fontWeight: "700", color: "#65676b" }}>
                {session?.user?.username
                  ? session?.user?.username
                  : "Bạn vẫn chưa đặt tên người dùng"}
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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
                onClick={handleClickOpenUsername}
              >
                Chỉnh sửa
              </Box>
              <Dialog
                fullScreen={fullScreen}
                open={openUsername}
                onClose={handleCloseUsername}
                aria-labelledby="responsive-dialog-title"
                sx={{
                  "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
                    borderRadius: "12px",
                  },
                }}
              >
                <DialogTitle
                  id="responsive-dialog-title"
                  // sx={{ borderBottom: "1px solid gray" }}
                >
                  Chỉnh sửa tên người dùng của bạn
                </DialogTitle>
                <Box sx={{ padding: "0 24px" }}>
                  <Divider />
                </Box>
                <DialogContent>
                  <Box>
                    Tên người dùng công khai của bạn giống với tên trong địa chỉ
                    dòng thời gian của bạn
                  </Box>
                  <Box>VD:artdevs.com/username</Box>
                  <TextField
                    // onChange={(e) => handleChangeLastName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Tên"
                    name="username"
                    autoComplete="new-user-name"
                    autoFocus
                    value={session?.user?.username}
                    error={isErrorUserName}
                    helperText={messageUserName}
                    sx={{ marginBottom: "0" }}
                  />
                </DialogContent>
                <DialogActions sx={{ marginRight: "18px" }}>
                  <Box
                    sx={{
                      minWidth: "90px",
                      textAlign: "center",
                      borderRadius: "30px",
                      padding: "8px 16px",
                      boxShadow: GLOBAL_BOXSHADOW,
                      background: "#cfcfcf",
                      fontWeight: "bold",
                      color: GLOBAL_COLOR_MENU,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        backgroundColor: "#bbbbbb",
                      },
                    }}
                    autoFocus
                    onClick={handleCloseUsername}
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
                    onClick={handleCloseUsername}
                    autoFocus
                  >
                    Lưu lại
                  </Box>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: "16px" }} />

          <Grid
            container
            spacing={2}
            columns={10}
            sx={{ alignItems: "center" }}
          >
            <Grid item xs={2}>
              <Box sx={{ fontWeight: "bold", fontSize: "16" }}>Liên hệ</Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{ display: "flex", flexWrap: { xs: "wrap", sm: "nowrap" } }}
              >
                Email:
                <Typography sx={{ fontWeight: "bold", color: "#65676b" }}>
                  {session?.user?.email}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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
                onClick={handleClickOpenEmail}
              >
                Chỉnh sửa
              </Box>
              <Dialog
                fullScreen={fullScreen}
                open={openEmail}
                onClose={handleCloseEmail}
                aria-labelledby="responsive-dialog-title"
                sx={{
                  "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
                    borderRadius: "12px",
                  },
                }}
              >
                <DialogTitle
                  id="responsive-dialog-title"
                  // sx={{ borderBottom: "1px solid gray" }}
                >
                  Chỉnh sửa Email của bạn
                </DialogTitle>
                <Box sx={{ padding: "0 24px" }}>
                  <Divider />
                </Box>
                <DialogContent>
                  <Box sx={{ display: "flex" }}>
                    Email hiện tại:{" "}
                    <Box sx={{ fontWeight: "bold" }}>
                      {session?.user?.email}
                    </Box>
                  </Box>
                  <TextField
                    // onChange={(e) => handleChangeLastName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Tên"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={session?.user?.email}
                    error={isErrorEmail}
                    helperText={messageEmail}
                    sx={{ marginBottom: "0" }}
                  />
                </DialogContent>
                <DialogActions sx={{ marginRight: "18px" }}>
                  <Box
                    sx={{
                      minWidth: "90px",
                      textAlign: "center",
                      borderRadius: "30px",
                      padding: "8px 16px",
                      boxShadow: GLOBAL_BOXSHADOW,
                      background: "#cfcfcf",
                      fontWeight: "bold",
                      color: GLOBAL_COLOR_MENU,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        backgroundColor: "#bbbbbb",
                      },
                    }}
                    autoFocus
                    onClick={handleCloseEmail}
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
                    onClick={handleCloseEmail}
                    autoFocus
                  >
                    Lưu lại
                  </Box>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
