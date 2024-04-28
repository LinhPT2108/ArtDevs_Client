"use client";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import WorkIcon from "@mui/icons-material/Work";
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Loader } from "../utils/component.global";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_WHITE,
  GLOBAL_URL,
} from "../utils/veriable.global";

interface IPros {
  session: User;
}

export default function HomeUpgradeMentor({ session }: IPros) {
  //set error
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorContent, setErrorContent] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>("");

  // modal loading
  const [open, setOpen] = useState(false);

  //xử lý mở modal loading
  const handleClickOpen = () => {
    setOpen(true);
  };

  //xử lý đóng modal loading
  const handleClose = () => {
    setOpen(false);
  };

  // modal confirm
  const [openConfirm, setOpenConfirm] = useState(false);

  //xử lý mở modal confirm
  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  //xử lý đóng modal confirm
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    handleClose();
  };

  //biến ghi dữ liệu đóng góp ý kiến
  const [dataFeedback, setDataFeedback] = useState<Feedback>({
    id: 0,
    title: "",
    content: "",
    createFeedback: new Date(),
    dateHandle: null,
    status: false,
    user: session?.user,
    listImage: null,
    type: "upgrade",
  });

  //xử lý thay đổi nổi dung đóng góp ý kiến
  const handleChaneContent = (value: string) => {
    if (value) {
      setErrorContent(false);
      setMessageContent("");
      setDataFeedback((prev) => ({
        ...prev,
        content: value,
      }));
    } else {
      setErrorContent(true);
      setMessageContent("Vui lòng nhập nội dung !");
    }
  };

  //xử lý gửi ý kiến
  const handleSendFeedback = async () => {
    handleClickOpen();
    const formData = new FormData();
    formData.append(
      "feedback",
      new Blob(
        [
          JSON.stringify({
            id: dataFeedback?.id,
            title: dataFeedback?.title,
            content: dataFeedback?.content,
            status: dataFeedback?.status,
            type: dataFeedback?.type,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (selectedFiles) {
      selectedFiles.forEach((file: any, index: any) => {
        formData.append("listImage", file);
      });
    } else {
      formData.append("listImage", "");
    }
    const response = await fetch(GLOBAL_URL + "/api/feedback", {
      method: "POST",
      headers: { authorization: `Bearer ${session?.access_token}` },
      body: formData,
    });
    //@ts-ignore
    if (response?.status == 200) {
      const data = await response.json();
      console.log("Data from response:", data);
      setDataFeedback({
        id: 0,
        title: "",
        content: "",
        createFeedback: new Date(),
        dateHandle: null,
        status: false,
        user: session?.user,
        listImage: null,
        type: "upgrade",
      });
      setSelectedFiles([]);
      handleClickOpenConfirm();
    } else {
      //@ts-ignore
      setErrorMessage(response?.message);
    }
  };

  //xử lý xem trước file khi upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    selectedFiles.forEach((file, index) => {
      const objectUrl = URL.createObjectURL(file);
      previewUrlsRef.current[index] = objectUrl;
    });
    setPreviews([...previewUrlsRef.current]);

    return () => {
      previewUrlsRef.current.forEach(URL.revokeObjectURL);
      previewUrlsRef.current = [];
    };
  }, [selectedFiles]);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFiles([]);
      return;
    }

    const filesArray: File[] = Array.from(e.target.files);
    setSelectedFiles(filesArray);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: "12px",
        padding: { xs: "24px 12px 12px 12px", sm: "0" },
      }}
    >
      <Box
        sx={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#050505",
        }}
      >
        Nâng cấp để trở thành Mentor?
      </Box>

      <Divider sx={{ margin: "8px 0 24px 0" }} />
      <List sx={{ width: "100%" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #80808080",
                color: "#2e7d32",
              }}
            >
              <CheckIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Bạn phải có ít nhất 5 bài viết hữu ít" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CheckIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Có ít nhất 1000 lượt thích cho bài viết và phản hồi" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CheckIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Hoạt động từ 7 ngày trở lên" />
        </ListItem>
      </List>
      <Grid
        container
        columns={8}
        sx={{
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Grid item container xs={5} md={3} columns={5} spacing={2}>
          <Grid
            item
            xs={5}
            md={5}
            sx={{
              "& .MuiTextField-root": {
                "& textarea": {
                  overflowY: "auto",
                  maxHeight: "200px",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "red",
                    borderRadius: "3px",
                  },
                },
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#050505",
                }}
              >
                Nội dung
              </Box>
              (Không bắt buộc)
            </Box>
            <TextField
              onChange={(e) => handleChaneContent(e.target.value)}
              id="outlined-multiline-flexible"
              hiddenLabel
              multiline
              fullWidth
              value={dataFeedback?.content}
              maxRows={6}
              variant="outlined"
              error={errorContent}
              helperText={messageContent}
            />
          </Grid>
          <Grid item xs={5} md={5}>
            <Typography sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              Chứng từ
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                position: "relative",
                cursor: "pointer",
                "& label": {
                  width: "fit-content",
                  height: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                },
                "& input": {
                  "&::after": {
                    border: "none",
                    cursor: "pointer",
                  },
                  "&::before": {
                    border: "none",
                    display: "none",
                    cursor: "pointer",
                  },
                  // display: "none",v
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "pointer",
                },
              }}
            >
              <InputLabel
                htmlFor="file"
                sx={{
                  backgroundColor: "#315ca1",
                  color: "white",
                  padding: "6px",
                  borderRadius: "12px",
                }}
              >
                <AttachFileIcon /> Thêm chứng từ hoặc bằng cấp liên quan (đề
                xuất)
              </InputLabel>
              <input
                multiple
                type="file"
                id="file"
                name="image"
                onChange={onSelectFile}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                marginTop: "12px",
                "& img": {
                  boxShadow: GLOBAL_BOXSHADOW,
                  borderRadius: "12px",
                  height: "100px",
                  marginRight: "12px",
                },
              }}
            >
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  width="150"
                  height="100"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={5} md={5}>
            <Box sx={{ padding: "12px 0 12px 0", textAlign: "justify" }}>
              Thời gian xét duyệt từ 1-3 ngày làm việc.
            </Box>
          </Grid>
          <Grid
            item
            xs={5}
            md={5}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              aria-label="add an alarm"
              sx={{
                minWidth: "100px",
                textAlign: "center",
                borderRadius: "30px",
                padding: "8px 16px",
                boxShadow: GLOBAL_BOXSHADOW,
                background: GLOBAL_BG_BLUE_900,
                fontWeight: "bold",
                color: GLOBAL_COLOR_WHITE,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  backgroundColor: GLOBAL_BG_BLUE_300,
                },
              }}
              onClick={handleSendFeedback}
            >
              <SendIcon />
              <Typography sx={{ marginLeft: "6px" }}>GỬI</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          xs={5}
          md={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            padding: "16px 0",
            height: "100%",
          }}
        >
          <CardMedia
            component="img"
            height="280"
            image="/locked.png"
            alt="lock"
            sx={{
              maxWidth: "70%",
              width: "auto",
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) ",
            }}
          />
        </Grid>
      </Grid>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Loader />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                marginTop: "12px ",
              }}
            >
              Yêu cầu nâng cấp tài khoản đang được gửi <br /> Vui lòng chờ trong
              giây lát <br />
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          {"Thông báo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ textAlign: "center" }}
          >
            {errorMessage ? (
              errorMessage
            ) : (
              <Typography>
                Chúng tôi đã nhận được yêu cầu của bạn. Chúng tôi sẽ xem xét và
                nâng cấp nếu tài khoản đủ điều kiện <br />
                Trân trọng cảm ơn !
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            " & button": {
              borderRadius: "24px",
              minWidth: "80px",
              color: GLOBAL_COLOR_WHITE,
              backgroundColor: GLOBAL_BG_BLUE_900,
              "&:hover": {
                backgroundColor: GLOBAL_BG_BLUE_300,
                boxShadow: GLOBAL_BOXSHADOW,
              },
            },
          }}
        >
          <Button
            onClick={handleCloseConfirm}
            autoFocus
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
