"use client";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
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
import Box from "@mui/material/Box";
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

export default function HomeFeedback({ session }: IPros) {
  //set error
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorContent, setErrorContent] = useState<boolean>(false);
  const [messageTitle, setMessageTitle] = useState<string>("");
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
  });

  //xử lý thay đổi tiêu đề góp ý
  const handleChaneTitle = (value: string) => {
    if (value) {
      setErrorTitle(false);
      setMessageTitle("");
      setDataFeedback((prev) => ({
        ...prev,
        title: value,
      }));
    } else {
      setErrorTitle(true);
      setMessageTitle("Vui lòng nhập tiêu đề !");
    }
  };

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

  //xử lý thay đổi file
  const handleChangePictureFeedback = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const selected = fileInput.files;
    setDataFeedback((prevData) => ({
      ...prevData,
      listImage: [
        ...(prevData.listImage || []),
        ...(selected ? Array.from(selected) : []),
      ] as File[],
    }));
  };

  //xử lý gửi ý kiến
  const handleSendFeedback = async () => {
    if (dataFeedback?.title && dataFeedback?.content) {
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
            }),
          ],
          { type: "application/json" }
        )
      );

      if (dataFeedback.listImage) {
        dataFeedback.listImage.forEach((file: any, index: any) => {
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
        handleClickOpenConfirm();
      } else {
        //@ts-ignore
        setErrorMessage(response?.message);
      }
    } else {
      if (!dataFeedback?.title) {
        setErrorTitle(true);
        setMessageTitle("Vui lòng nhập tiêu đề !");
      }
      if (!dataFeedback?.content) {
        setErrorContent(true);
        setMessageContent("Vui lòng nhập nội dung !");
      }
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
        Chung tay cải thiện Art Devs
      </Box>
      <Divider sx={{ margin: "8px 0 24px 0" }} />
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
          <Grid item xs={5} md={5}>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#050505",
              }}
            >
              Chúng tôi có thể cải thiện như thế nào ?
            </Box>
            <TextField
              id="title"
              hiddenLabel
              type="text"
              variant="filled"
              autoComplete="off"
              error={errorTitle}
              helperText={messageTitle}
              fullWidth
              onChange={(e) => handleChaneTitle(e.target.value)}
            />
          </Grid>
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
                Chi tiết
              </Box>
              (Vui lòng chia sẻ chi tiết nhất có thể)
            </Box>
            <TextField
              onChange={(e) => handleChaneContent(e.target.value)}
              id="outlined-multiline-flexible"
              hiddenLabel
              multiline
              fullWidth
              maxRows={6}
              variant="outlined"
              error={errorContent}
              helperText={messageContent}
            />
          </Grid>
          <Grid item xs={5} md={5}>
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
              <InputLabel htmlFor="file">
                <AttachFileIcon /> Thêm video hoặc ảnh chụp màn hình (đề xuất)
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
              Nếu bạn có ý tưởng để cải thiện sản phẩm thì hãy cho chúng tôi
              biết nhé. Còn nếu cần trợ giúp để khắc phục vấn đề cụ thể.
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
              Ý kiến của bạn đang được gửi <br /> Vui lòng chờ trong giây lát{" "}
              <br /> Xin cảm ơn.
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
                Chúng tôi đã nhận được ý kiến đóng góp của bạn. Chúng tôi sẽ xem
                xét và nâng cấp để cho bạn có trải nghiệm tốt nhấtcó thể <br />
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
