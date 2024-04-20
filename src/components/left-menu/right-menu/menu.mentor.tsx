"use client";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedIcon from "@mui/icons-material/Feed";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListSubheader,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import {
  GLOBAL_BG,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";
import React, { useEffect, useState } from "react";
import { TransitionProps } from "react-transition-group/Transition";
import { CubeSpan } from "@/components/utils/component.global";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface IPros {
  session: User;
}
const MenuMentor = ({ session }: IPros) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [open, setOpen] = useState(false);
  const [mentorId, setMentorId] = useState("");
  const [isReady, setIsReady] = useState(false);
  var router = useRouter();
  const [listmentor, setListMentor] = useState<MentorInfor[]>([]);
  const fetchData = async (url: string) => {
    return await sendRequest<MentorInfor[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<MentorInfor[], any> = useSWR(
    "http://localhost:8080/api/get-mentor-isready",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  useEffect(() => {
    if (data) {
      setListMentor(data);
    }
  }, [data]);

  const handleRedirect = (id: string) => {
    router.push(`/mentor/${id}`);
  };
  const sendMatchRequest = async (mentorId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(`${GLOBAL_URL}/api/send-match/${mentorId}`, {
        method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
        headers: {
          authorization: `Bearer ${session?.access_token}`,
        },
        // Các tùy chọn khác nếu cần
      });
      // Xử lý kết quả
      const data = await response.json();
      if (data) {
        setListMentor(
          listmentor?.map((t) => {
            if (t.userId == mentorId) {
              return { ...t, sendStatus: true };
            }
            return t;
          })
        );
      }

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };
  const handleSendmatch = async () => {
    if (isReady === true) {
      try {
        // Gọi hàm thực hiện cuộc gọi API
        const apiResult = await sendMatchRequest(mentorId);

        console.log("test Result" + apiResult);
        // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
        if (apiResult === true) {
          // Thành công, chuyển hướng đến trang mới
          showSnackbar();
          setOpen(false);
        } else {
          // Xử lý khi có lỗi trong cuộc gọi API
          console.error("Match request failed.");
        }
      } catch (error) {
        console.error("Error sending match:", error);
      }
    } else {
      showSnackbar2();
    }
  };
  const handleClickOpen = (mentorId: string, isReady: boolean) => {
    setOpen(true);
    setMentorId(mentorId);
    setIsReady(isReady);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };

  const showSnackbar2 = () => {
    setSnackbar2Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "100px",
          height: "86vh",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="cube-loader">
            <div className="cube-top"></div>
            <div className="cube-wrapper">
              {[0, 1, 2, 3].map((index) => (
                <CubeSpan key={index} index={index} />
              ))}
            </div>
          </div>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        width: "100%",
        // maxWidth: 250,
        borderRadius: "12px",
        boxShadow: GLOBAL_BOXSHADOW,
        bgcolor: GLOBAL_BG,
      }}
    >
      <List
        sx={{
          width: "100%",
          color: "white",
          marginTop: "12px",
          "& p": {
            color: "white",
          },
        }}
        component="nav"
        aria-label="main mailbox folders"
        subheader={
          <ListSubheader
            sx={{
              bgcolor: GLOBAL_BG,
              color: GLOBAL_COLOR_BLACK,
              borderRadius: "12px",
              fontWeight: "bold",
              zIndex: "0",
              position: "relative",
              "@media (min-width: 900px)": {
                "&": {
                  fontSize: "12px",
                },
              },
              "@media (min-width: 1023px)": {
                "&": {
                  fontSize: "14px",
                },
              },
            }}
            component="div"
            id="nested-list-subheader"
          >
            <Typography
              gutterBottom
              component="div"
              textAlign="center"
              sx={{
                fontSize: "24px",
                fontWeight: "500",
                fontStyle: "bold",
              }}
            >
              Suggest Mentor
            </Typography>
          </ListSubheader>
        }
      >
        <Divider />
        {listmentor &&
          listmentor.slice(0, 5).map((item, index) => {
            return (
              <Box>
                <Card
                  sx={{
                    maxWidth: 345,
                    bgcolor: GLOBAL_BG,
                    marginBottom: "10px",
                    background: " rgba(222, 221, 218, 1)",
                    border: "50px radius",
                    overflow: "hidden",
                    transition: "transform 0.3s ease-in-out", // Add transition for a smooth effect
                    "&:hover": {
                      transform: "scale(1.02)", // Increase scale on hover
                    },
                  }}
                  key={index}
                  onClick={() => {
                    handleRedirect(item?.userId);
                  }}
                >
                  <Typography
                    gutterBottom
                    component="div"
                    textAlign="center"
                    sx={{
                      fontSize: "24px",
                      fontWeight: "500",
                      fontStyle: "bold",
                    }}
                  >
                    <Box
                      sx={{
                        top: "4px",
                        left: "4px",
                        backgroundColor: item?.isReady ? "#16D6B5" : "#e60839",
                        border: "1px solid white",
                        borderRadius: "11px",
                        width: "fit-content",
                        height: "24px",
                        padding: "6px",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {/* Nested Box and Typography */}
                      <Box
                        sx={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: item?.isReady ? "white" : "black",
                          marginRight: "8px",
                        }}
                      ></Box>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "800",
                          color: "white",
                        }}
                      >
                        {item?.isReady ? "Online" : "Offline"}
                      </Typography>
                    </Box>
                    {item.fullname}
                  </Typography>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="80"
                    image={item.profilePicUrl || "/OIP.jpg"}
                    sx={{
                      borderRadius: "25%", // Đặt borderRadius thành 50% để bo tròn hình ảnh
                      objectFit: "cover",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                    }}
                  />

                  <CardActions className="justify-center">
                    {!item.sendStatus ? (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          borderRadius: "30px",
                          backgroundColor: "#eeeeee",
                          color: "#4d3869",
                          "&:hover": {
                            backgroundColor: "#ffffff",
                            outline: "none",
                            border: "none",
                          },
                        }}
                        onClick={(event) => {
                          event.stopPropagation(); // Ngăn chặn sự kiện onclick của Card
                          handleClickOpen(item.userId, item.isReady);
                          // Thực hiện sự kiện của nút button ở đây
                        }}
                      >
                        Yêu Cầu Hỗ Trợ
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          borderRadius: "30px",
                          backgroundColor: "#eeeeee",
                          color: "#4d3869",
                          "&:hover": {
                            backgroundColor: "#ffffff",
                            outline: "none",
                            border: "none",
                          },
                        }}
                        onClick={(event) => {
                          event.stopPropagation(); // Ngăn chặn sự kiện onclick của Card
                        }}
                      >
                        Đã Gửi Yêu Cầu Hỗ Trợ
                      </Button>
                    )}
                  </CardActions>
                </Card>
                <Snackbar
                  open={snackbarOpen}
                  message="Gửi yêu cầu hỗ trợ thành công! vui lòng đợi"
                  autoHideDuration={3000}
                  onClose={() => setSnackbarOpen(false)}
                  sx={{
                    color: "white",
                    backgroundColor: "#4CAF50",
                  }}
                />
                <Snackbar
                  open={snackbar2Open}
                  message="Mentor is not Ready "
                  autoHideDuration={3000}
                  onClose={() => setSnackbar2Open(false)}
                  sx={{
                    color: "black",
                    backgroundColor: "##e60839",
                  }}
                />
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Bạn có muốn Match?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      Đồng hành với Người Hướng Dẫn IT, học viên không chỉ chinh
                      phục thách thức kỹ thuật, mà còn khám phá sự phát triển
                      chuyên sâu và mối quan hệ chuyên nghiệp bền vững.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Thoát</Button>
                    <Button onClick={handleSendmatch}>Đồng ý</Button>
                  </DialogActions>
                </Dialog>
              </Box>
            );
          })}
      </List>
    </Box>
  );
};
export default MenuMentor;
