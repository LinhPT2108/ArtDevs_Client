"use client";

import { sendRequest } from "@/components/utils/api";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import useSWR, { SWRResponse } from "swr";
import { usePathname, useRouter } from "next/navigation";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
import React, { useState } from "react";
import { TransitionProps } from "react-transition-group/Transition";
import { CubeSpan } from "@/components/utils/component.global";
interface IPros {
  session: User;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AllMentor = ({ session }: IPros) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [open, setOpen] = useState(false);

  const [mentorId, setMentorId] = useState(String);
  const [isready, setIsReady] = useState(Boolean);
  var router = useRouter();
  const fetchData = async (url: string) => {
    return await sendRequest<MentorInfor[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<MentorInfor[], any> = useSWR(
    "http://localhost:8080/api/get-all-mentor",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

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
      console.log(response);
      // Xử lý kết quả
      const data = await response.json();

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };
  const handleSendmatch = async () => {
    if (isready === true) {
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
    <Grid
      container
      columns={12}
      spacing={0}
      sx={{
        "& .MuiGrid-item": { padding: "0px" },
      }}
    >
      {data &&
        data?.map((mentor, index) => (
          <Grid
            item
            xs={12}
            md={6}
            key={mentor.userId}
            sx={{
              padding: "0px",
            }}
          >
            <Card
              sx={{
                background:
                  "linear-gradient(45deg, rgba(58,180,156,0.24693627450980393) 0%, rgba(243,245,245,0.10407913165266103) 100%)",
                border: "40px radius",
                overflow: "hidden",
                transition: "transform 0.3s ease-in-out", // Add transition for a smooth effect
                "&:hover": {
                  transform: "scale(1.02)", // Increase scale on hover
                },
                cursor: "pointer",
                margin: "15px", // Thay đổi giá trị margin của card
              }}
            >
              <Grid
                item
                xs={12}
                md={12}
                onClick={() => {
                  handleRedirect(mentor?.userId);
                }}
              >
                <Box
                  sx={{
                    top: "4px",
                    left: "4px",
                    backgroundColor: mentor?.isReady ? "#16D6B5" : "#e60839",
                    border: "1px solid white",
                    borderRadius: "11px",
                    width: "fit-content",
                    height: "32px",
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
                      backgroundColor: mentor?.isReady ? "white" : "black",
                      marginRight: "8px",
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "white",
                    }}
                  >
                    {mentor?.isReady ? "Online" : "Offline"}
                  </Typography>
                </Box>

                <Typography
                  gutterBottom
                  component="div"
                  padding="5px 5px 3px 20px"
                  textAlign="center"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "500",
                    fontStyle: "bold",
                  }}
                >
                  Người Hướng Dẫn
                </Typography>
              </Grid>
              <Grid item container spacing={2} padding="5px">
                <Grid
                  item
                  xs={4}
                  md={4}
                  onClick={() => {
                    handleRedirect(mentor?.userId);
                  }}
                >
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="180"
                    image={mentor.profilePicUrl || "/OIP.jpg"}
                    sx={{
                      borderRadius: "8px",
                      objectFit: "cover",
                      marginLeft: "5px",
                      paddingLeft: "5px",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={8}
                  md={8}
                  onClick={() => {
                    handleRedirect(mentor?.userId);
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="flex"
                      flexWrap="wrap"
                    >
                      {mentor?.listSkillOfMentor?.map((skill, index) => (
                        <Box key={`skill${index}`} marginRight="5px">
                          <Typography gutterBottom variant="h6" component="div">
                            <Box
                              sx={{
                                width: "auto",
                                padding: "0 12px",
                                minWidth: "80px",
                                textDecoration: "none",
                                fontWeight: "bold",
                                boxShadow: `0 0 3px 1px ${GLOBAL_BG_BLUE_900}`,
                                textAlign: "center",
                                color: GLOBAL_BG_BLUE_900,
                                borderRadius: "16px",
                                transition: "all .2s",
                              }}
                            >
                              {skill}
                            </Box>
                          </Typography>
                        </Box>
                      ))}
                    </Typography>
                  </CardContent>
                </Grid>
                <Grid item xs={12} md={12}>
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      gutterBottom
                      component="div"
                      padding="5px 5px 3px 20px"
                      textAlign="center"
                      sx={{
                        fontSize: "24px",
                        fontWeight: "500",
                        fontStyle: "bold",
                      }}
                      onClick={() => {
                        handleRedirect(mentor?.userId);
                      }}
                    >
                      {mentor.fullname}
                    </Typography>
                    <Box
                      sx={{
                        background:
                          "linear-gradient(45deg, rgba(74,58,180,1) 0%, rgba(69,252,235,0.10407913165266103) 100%)",
                        border: "5px ",
                        marginRight: "12px",
                        borderRadius: "30px",
                        padding: "8px 16px",
                        ":hover": {
                          background:
                            "linear-gradient(45deg, rgba(99,58,180,1) 0%, rgba(69,252,235,0.10407913165266103) 100%)",
                          boxShadow: GLOBAL_BOXSHADOW,
                        },
                      }}
                      onClick={() =>
                        handleClickOpen(mentor.userId, mentor.isReady)
                      }
                    >
                      Yêu Cầu Hỗ Trợ !
                    </Box>
                  </CardActions>
                </Grid>
              </Grid>
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
                  phục thách thức kỹ thuật, mà còn khám phá sự phát triển chuyên
                  sâu và mối quan hệ chuyên nghiệp bền vững.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Thoát</Button>
                <Button onClick={handleSendmatch}>Đồng ý</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        ))}
    </Grid>
  );
};
export default AllMentor;
