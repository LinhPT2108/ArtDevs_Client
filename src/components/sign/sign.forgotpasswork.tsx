// Import necessary dependencies
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import theme from "@/theme";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
} from "@mui/material";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
import { TransitionProps } from "@mui/material/transitions";

interface ForgotPasswordProps {
  openModal: boolean;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Define the ForgotPassword component
const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  openModal,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [emailError, setEmailError] = useState("");
  const verificationCode = localStorage.getItem("verificationCode");
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [openDialog, setopenDialog] = React.useState(false);
  const [countdown, setCountdown] = useState(300);
  const [startime, setStartime] = useState<NodeJS.Timeout | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [open, setopen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonDisabled(false); // Kích hoạt nút sau khi đã qua 15 giây
    }, 15000); // 15 giây

    return () => clearTimeout(timer);
  }, [isButtonDisabled]);

  const handleSendCode = async () => {
    // Add your logic here to send a code to the provided email
    // This is just a placeholder, replace it with your actual logic
    if (!isButtonDisabled && validateEmail(email)) {
      console.log(`Sending code to ${email}`);
      setIsButtonDisabled(true);
      const responseSendcode = await sendRequest<ReponseSendCode>({
        url: `${GLOBAL_URL}/api/send-verify`,
        method: "POST",
        queryParams: {
          Email: email,
        },
      });
      console.log(responseSendcode);
      if (responseSendcode?.statusCode === 200) {
        localStorage.setItem(
          "verificationCode",
          String(responseSendcode.model.verificationCode)
        );

        setTimeout(() => {
          // Xóa mã xác nhận sau 5 phút (300 giây)
          localStorage.removeItem("verificationCode");
        }, 300000); // 300 giây

        const interval = setInterval(tick, 1000);
        setStartime(interval);
      }
      setEmailError(responseSendcode?.message);
    }
  };
  const handleClickOpenDialog = () => {
    setopenDialog(true);
  };

  const handleCloseDialog = () => {
    // Close the modal by calling the onClose prop
    setopenDialog(false);
  };
  const handleSubmit = () => {
    if (verificationCode) {
      if (code === verificationCode) {
        console.log("Mã xác nhận hợp lệ");
        // Thực hiện các hành động tương ứng khi mã xác nhận hợp lệ
        handleClickOpenDialog();
      } else {
        console.log("Mã xác nhận không hợp lệ");
        // Thực hiện các hành động tương ứng khi mã xác nhận không hợp lệ
      }
    } else {
      console.log("Không có mã xác nhận trong Local Storage");
      // Thực hiện các hành động tương ứng khi không có mã xác nhận trong Local Storage
    }
  };
  console.log("check code", verificationCode);
  const handleCloseModal = () => {
    // Close the modal by calling the onClose prop
    onClose();
  };

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      const responseRePassword = await sendRequest<ReponseSendCode>({
        url: `${GLOBAL_URL}/api/forgotpassword`,
        method: "POST",
        queryParams: {
          Email: email,
          Newpassword: newPassword,
        },
      });
      console.log("check", responseRePassword.message);
      setopenDialog(false);
      onClose();
    } else {
      alert("Password reset ko giống nhau đmm");
    }

   
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setEmailError("Email không hợp lệ");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Hàm giảm giờ đếm
  const tick = () => {
    setCountdown((prevCountdown) => prevCountdown - 1);
  };
  const stopCountdownTimer = () => {
    if (startime) {
      clearInterval(startime);
      setStartime(null);
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      setIsButtonDisabled(true);
      stopCountdownTimer();
      // Xóa interval khi countdown đạt 0
    }
  }, [countdown]);
  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            p: 4,
            margin: "auto",
            marginTop: theme.spacing(3),
            padding: theme.spacing(2),
            backgroundColor: "#f0f0f0",
            borderRadius: theme.spacing(1),
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(emailError)}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={4} sx={{ display: "flex", alignItems: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleSendCode}
                disabled={isButtonDisabled}
              >
                {`Gửi mã (${countdown})`}
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Mã xác nhận"
              variant="outlined"
              fullWidth
              margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="form-dialog-title">Thay đổi mật khẩu</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="Mật khẩu mới"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            id="confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleResetPassword} color="primary">
            Lưu lại
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Define prop types for the ForgotPassword component
ForgotPassword.propTypes = {
  openModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPassword;
