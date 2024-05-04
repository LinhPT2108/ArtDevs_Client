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
  Divider,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import useSWR, { SWRResponse } from "swr";
import InfiniteScroll from "../hash-tag/Infinite.scroll";
import { sendRequest } from "../utils/api";
import { Loader } from "../utils/component.global";
import CloseIcon from "@mui/icons-material/Close";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_MENU,
  GLOBAL_SEND_FRIEND,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SkeletonPeople from "./skeleton.people";
import { TransitionProps } from "react-transition-group/Transition";
import CardMentor from "../mentor/component/mentor.card";

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
  dataFilterMentors?: { city?: string; demands?: string };
}

export default function SearchMentor({ session, dataFilterMentors }: IPros) {
  //biến xử lý socket
  const socket = new SockJS(GLOBAL_URL + "/friend");
  const stompClient = Stomp.over(socket);

  //biến chuyển hướng
  var router = useRouter();

  //phân trang
  const [page, setPage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [mentorId, setMentorId] = useState(String);
  const [isready, setIsReady] = useState(Boolean);

  //lấy search params
  const searchParams = useSearchParams();

  // biến thông báo
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbar2Open, setSnackbar2Open] = useState<boolean>(false);
  const [snackbar3Open, setSnackbar3Open] = useState<boolean>(false);
  const [snackbar4Open, setSnackbar4Open] = useState<boolean>(false);
  const [snackbar5Open, setSnackbar5Open] = useState<boolean>(false);

  //lấy dữ liệu db
  const fetchData = async (url: string) => {
    return await sendRequest<IModelPaginate<MentorInfor>>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: { keyword: searchParams.get("keyword") as string, page: 0 },
    });
  };
  const {
    data,
    error,
    isLoading,
    mutate,
  }: SWRResponse<IModelPaginate<MentorInfor>, any> = useSWR(
    GLOBAL_URL + "/api/search/mentor",
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  //lấy data the filter
  useEffect(() => {
    console.log(">>> check dataFilterMentors: ", dataFilterMentors);
    const refeshDataSearch = async () => {
      setPage(0);
      const newDataSearch = await sendRequest<IModelPaginate<MentorInfor>>({
        url: GLOBAL_URL + "/api/search/mentor",
        method: "GET",
        headers: { authorization: `Bearer ${session?.access_token}` },
        queryParams: {
          page: page,
          keyword: searchParams.get("keyword") as string,
          ...dataFilterMentors,
        },
      });
      console.log(">>> check newDataSearch mentor: ", newDataSearch);
      mutate(newDataSearch, false);
    };
    refeshDataSearch();
  }, [dataFilterMentors]);

  // lấy data phân trang
  useEffect(() => {
    if (page) {
      const refeshDataSearch = async () => {
        const newDataSearch = await sendRequest<IModelPaginate<MentorInfor>>({
          url: GLOBAL_URL + "/api/search/mentor",
          method: "GET",
          headers: { authorization: `Bearer ${session?.access_token}` },
          queryParams: {
            page: page,
            keyword: searchParams.get("keyword") as string,
            ...dataFilterMentors,
          },
        });
        console.log(">>> check newDataSearch mentor: ", newDataSearch);
        const mentors = data?.result ? data?.result : [];
        const resMentors = newDataSearch?.result ? newDataSearch?.result : [];
        const newData: MentorInfor[] = [...mentors, ...resMentors];
        mutate({ meta: newDataSearch?.meta, result: newData! }, false);
      };
      refeshDataSearch();
    }
  }, [page]);

  //xử lý trạng thái thông báo
  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };

  const showSnackbar2 = () => {
    setSnackbar2Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };

  const showSnackbar3 = () => {
    setSnackbar3Open(true);
    setTimeout(() => setSnackbar3Open(false), 10000);
  };
  const showSnackbar4 = () => {
    setSnackbar4Open(true);
    setTimeout(() => setSnackbar4Open(false), 10000);
  };
  const showSnackbar5 = () => {
    setSnackbar5Open(true);
    setTimeout(() => setSnackbar5Open(false), 10000);
  };

  //xử lý chuyển hướng
  const handleRedirect = (id: string) => {
    router.push(`/profile?id=${id}`);
  };

  const [mentorName, setMentorName] = useState(String);
  //mở modal send match
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

  // đóng modal send match
  const handleClose = () => {
    setOpen(false);
  };

  // gửi yêu cầu hỗ trợ
  const sendMatchRequest = async (mentorId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${GLOBAL_URL}/api/send-match/${mentorId}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session?.access_token}`,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error sending match:", error);
      return false;
    }
  };
  //xử lý gửi yêu cầu hỗ trợ
  const handleSendmatch = async () => {
    if (isready === true) {
      try {
        const apiResult = await sendMatchRequest(mentorId);
        if (apiResult === true) {
          showSnackbar();
          setOpen(false);
        } else {
          console.error("Match request failed.");
        }
      } catch (error) {
        console.error("Error sending match:", error);
      }
    } else {
      showSnackbar2();
    }
  };
  console.log(">>> check data: ", data);
  if (isLoading) {
    return <SkeletonPeople />;
  }
  return (
    <Box>
      {
        //@ts-ignore
        !data?.statusCode && data?.result?.length > 0 && (
          <>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <Typography sx={{ fontSize: "20px", color: GLOBAL_COLOR_MENU }}>
                Tìm thấy:
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "20px", marginX: "4px" }}
              >
                {data?.result?.length}
              </Typography>
              <Typography sx={{ fontSize: "20px", color: GLOBAL_COLOR_MENU }}>
                kết quả phù hợp
              </Typography>
            </Box>
            <Divider />
          </>
        )
      }
      <InfiniteScroll
        loader={<Loader />}
        className=" my-5 pb-3"
        fetchMore={() => setPage((prev) => prev + 1)}
        hasMore={data && page + 1 < data?.meta?.total}
        totalPage={data ? data?.meta?.total : 1}
        endMessage={
          data && data?.meta?.total > data?.meta?.current ? (
            <Box
              sx={{ fontWeight: "bold", textAlign: "center", margin: "12px 0" }}
            >
              Bạn đã xem hết !
            </Box>
          ) : (
            ""
          )
        }
      >
        <Grid columns={12} container spacing={1}>
          {
            //@ts-ignore
            !data?.statusCode &&
              data?.result?.map((item) => (
                <CardMentor
              handleRedirect={handleRedirect}
              handleClickOpen={handleClickOpen}
              data={item}
            />))}
         
          {
            //@ts-ignore
            ((!data?.statusCode && data?.result?.length == 0) ||
              //@ts-ignore
              data?.statusCode) && (
              <Box>
                <Image
                  src="/not_find_result.png"
                  width={1000}
                  height={500}
                  alt="not find result"
                />
              </Box>
            )
          }
        </Grid>
      </InfiniteScroll>
      <Snackbar
        open={snackbarOpen}
        message="Thêm bạn thành công!"
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        sx={{
          color: "white",
          backgroundColor: "#4CAF50",
        }}
      />
      <Snackbar
        open={snackbar2Open}
        message="Từ chối kết bạn!"
        autoHideDuration={3000}
        onClose={() => setSnackbar2Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar3Open}
        message="Gừi lời mời kết bạn thành công!"
        autoHideDuration={3000}
        onClose={() => setSnackbar3Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar4Open}
        message="Đã xóa tài khoản khỏi danh sách gợi ý!"
        autoHideDuration={3000}
        onClose={() => setSnackbar4Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar5Open}
        message="Hủy gửi lời mời kết bạn!"
        autoHideDuration={3000}
        onClose={() => setSnackbar5Open(false)}
        sx={{
          color: "black",
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
    </Box>
  );
}
