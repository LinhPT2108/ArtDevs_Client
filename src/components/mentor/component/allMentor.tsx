"use client";

import { sendRequest } from "@/components/utils/api";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
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
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TransitionProps } from "react-transition-group/Transition";
import useSWR, { SWRResponse } from "swr";
import CardMentorSkeleton from "../home.mentor.skeleton";
import CardMentor from "./mentor.card";
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
  const [mentorName, setMentorName] = useState(String);
  var router = useRouter();
  const fetchData = async (url: string) => {
    return await sendRequest<MentorInfor[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const { data, error, isLoading, mutate }: SWRResponse<MentorInfor[], any> =
    useSWR(GLOBAL_URL + "/api/get-all-mentor", fetchData, {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    });
  console.log(">>> check datajjj: ", data);

  const handleRedirect = (id: string) => {
    router.push(`/profile?id=${id}`);
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
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await sendMatchRequest(mentorId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        showSnackbar();

        data &&
          mentorId &&
          mutate(
            data.filter((m) => m.userId != mentorId),
            false
          );
        setOpen(false);
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };
  const handleClickOpen = (
    mentorName: string,
    mentorId: string,
    isReady: boolean
  ) => {
    setOpen(true);
    setMentorId(mentorId);
    setIsReady(isReady);
    setMentorName(mentorName);
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
      <Grid container columns={12} spacing={0}>
        <Grid
          item
          xs={12}
          // md={6}
          lg={4}
          sx={{
            padding: "0px",
          }}
        >
          <CardMentorSkeleton />
        </Grid>
        <Grid
          item
          xs={12}
          // md={6}
          lg={4}
          sx={{
            padding: "0px",
          }}
        >
          <CardMentorSkeleton />
        </Grid>
        <Grid
          item
          xs={12}
          // md={6}
          lg={4}
          sx={{
            padding: "0px",
          }}
        >
          <CardMentorSkeleton />
        </Grid>
        <Grid
          item
          xs={12}
          // md={6}
          lg={4}
          sx={{
            padding: "0px",
          }}
        >
          <CardMentorSkeleton />
        </Grid>
      </Grid>
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
      {
        //@ts-ignore
        !data?.statusCode &&
          data?.map((mentor, index) => (
            <React.Fragment key={index}>
              <CardMentor
                handleRedirect={handleRedirect}
                handleClickOpen={handleClickOpen}
                data={mentor}
              />
            </React.Fragment>
          ))
      }
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
        sx={{
          "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          Bạn có muốn nhờ{" "}
          <Typography
            sx={{
              color: "rgba(103, 186, 186)",
              fontWeight: "bold",
              fontSize: "24px",
              marginX: "6px",
            }}
          >{` ${mentorName} `}</Typography>{" "}
          giúp đỡ không?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Đồng hành với Người Hướng Dẫn IT, học viên không chỉ chinh phục
            thách thức kỹ thuật, mà còn khám phá sự phát triển chuyên sâu và mối
            quan hệ chuyên nghiệp bền vững.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={handleClose}>
            Thoát
          </Button>
          <Button
            color="success"
            variant="contained"
            sx={{ minWidth: "150px", marginRight: "20px" }}
            onClick={handleSendmatch}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
export default AllMentor;
