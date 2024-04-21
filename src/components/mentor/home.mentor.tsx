"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Rating,
  Slide,
  Snackbar,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CubeSpan } from "../utils/component.global";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import useSWR, { SWRResponse } from "swr";
import { formatVND } from "../utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { GLOBAL_BOXSHADOW, GLOBAL_URL } from "../utils/veriable.global";
import { TransitionProps } from "@mui/material/transitions";
import MentorAccept from "../left-menu/right-menu/menu.mentoraccept";
import HomeFriend from "../friend/home.friend";

interface IPros {
  user: User;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const HomeMentor = ({ user }: IPros) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [open, setOpen] = React.useState(false);
  var path = usePathname();
  const mentorCode = Array.isArray(path)
    ? path[0].split("/")[2]
    : path.split("/")[2];

  var router = useRouter();
  const fetchData = async (url: string) => {
    return await sendRequest<MentorInfor[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${user?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<MentorInfor[], any> = useSWR(
    GLOBAL_URL + "/api/get-mentor",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  const sendMatchRequest = async (mentorId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(`${GLOBAL_URL}/api/send-match/${mentorId}`, {
        method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
        headers: {
          authorization: `Bearer ${user?.access_token}`,
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendmatch = async (mentorId: string, isReady: boolean) => {
    if (isReady === true) {
      try {
        // Gọi hàm thực hiện cuộc gọi API
        const apiResult = await sendMatchRequest(mentorId);
        handleClickOpen();

        console.log("test Result" + apiResult);
        // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
        if (apiResult === true) {
          // Thành công, chuyển hướng đến trang mới
          showSnackbar();
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
  console.log(data);

  const handleRedirect = (id: string) => {
    router.push(`/mentor/${id}`);
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
    <Box sx={{ flexGrow: 1, marginTop: "24px" }}>
      <Grid
        container
        columns={12}
        spacing={2}
        sx={{
          "& .MuiGrid-item": {
            padding: { xs: "0 0 16px 16px", md: "0 0 0 16px" },
          },
        }}
      >
        {user?.user?.role?.id == 3 ? (
          <MentorAccept session={user} />
        ) : (
          data &&
          data?.map((mentor, index) => (
            <Grid item container xs={12} md={6} key={mentor.userId}>
              <Card
                sx={{
                  background:
                    "linear-gradient(45deg, rgba(58,180,156,0.24693627450980393) 0%, rgba(243,245,245,0.10407913165266103) 100%)",
                  border: "10px radius",
                  overflow: "hidden",
                  transition: "transform 0.3s ease-in-out", // Add transition for a smooth effect
                  "&:hover": {
                    transform: "scale(1.02)", // Increase scale on hover
                  },
                  cursor: "pointer",
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
                      backgroundColor: mentor.isReady ? "#16D6B5" : "#e60839",
                      border: "1px solid white",
                      borderRadius: "11px",
                      width: "fit-content",
                      height: "18px",
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
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          mentor?.isOnline?.toString() == "true"
                            ? "#16D6B5"
                            : "#e60839",
                        marginRight: "8px",
                      }}
                    ></Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "white",
                      }}
                    >
                      {mentor?.isOnline?.toString() == "true"
                        ? "Online"
                        : "Offline"}
                    </Typography>
                  </Box>

                  <Typography
                    gutterBottom
                    component="div"
                    padding="5px 5px 3px 20px"
                    textAlign="center"
                    sx={{
                      fontSize: "32px",
                      fontWeight: "500",
                      fontStyle: "bold",
                    }}
                  >
                    Mentor Skill
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
                        marginLeft: "3px",
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
                      <Typography variant="body2" color="text.secondary">
                        {mentor?.listSkillOfMentor?.map((skill, index) => (
                          <Box key={`skill${index}`}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              padding="5px 5px 3px 20px"
                              display="flex"
                              alignItems="center"
                            >
                              {skill} :
                              <Rating name="size-medium" defaultValue={5} />
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
                        fontSize="24px"
                        fontStyle="bold"
                        onClick={() => {
                          handleRedirect(mentor?.userId);
                        }}
                      >
                        {mentor.firstName} {mentor.middleName} {mentor.lastName}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        padding="5px 5px 3px 10px"
                        fontSize="18px"
                        fontStyle="bold"
                        onClick={() => {
                          handleRedirect(mentor?.userId);
                        }}
                      >
                        {formatVND(mentor.priceMatch)}/Match
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
                          handleSendmatch(mentor.userId, mentor.isReady)
                        }
                      >
                        Send Match
                      </Box>
                    </CardActions>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        message="Match request has been sent. Please wait for a response."
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
            Đồng hành với Mentor IT, học viên không chỉ chinh phục thách thức kỹ
            thuật, mà còn khám phá sự phát triển chuyên sâu và mối quan hệ
            chuyên nghiệp bền vững.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default HomeMentor;
