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
    router.push(`/mentor/${id}`);
  };

  //mở modal send match
  const handleClickOpen = (mentorId: string, isReady: boolean) => {
    setOpen(true);
    setMentorId(mentorId);
    setIsReady(isReady);
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
                <Grid
                  key={item.userId}
                  item
                  xs={12}
                  md={6}
                  sx={{ paddingX: "6px" }}
                >
                  <Card
                    sx={{
                      background:
                        "linear-gradient(45deg, rgba(58,180,156,0.24693627450980393) 0%, rgba(243,245,245,0.10407913165266103) 100%)",
                      border: "40px radius",
                      overflow: "hidden",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                      cursor: "pointer",
                      // margin: "15px",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      onClick={() => {
                        handleRedirect(item?.userId);
                      }}
                    >
                      <Box
                        sx={{
                          top: "4px",
                          left: "4px",
                          backgroundColor: item?.isReady
                            ? "#16D6B5"
                            : "#e60839",
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
                            backgroundColor: item?.isReady
                              ? "#f5f5f5"
                              : "#f5f5f5",
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
                          {item?.isReady ? "Online" : "Offline"}
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
                          handleRedirect(item?.userId);
                        }}
                      >
                        <CardMedia
                          component="img"
                          alt="green iguana"
                          height="180"
                          image={item?.profilePicUrl || "/OIP.jpg"}
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
                          handleRedirect(item?.userId);
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            display="flex"
                            flexWrap="wrap"
                          >
                            {item?.listSkillOfMentor?.map((skill, index) => (
                              <Box key={`skill${index}`} marginRight="5px">
                                <Typography
                                  gutterBottom
                                  variant="h6"
                                  component="div"
                                >
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
                              handleRedirect(item?.userId);
                            }}
                          >
                            {item?.fullname}
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
                              handleClickOpen(item?.userId, item?.isReady)
                            }
                          >
                            Yêu Cầu Hỗ Trợ !
                          </Box>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))
          }
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
        <DialogTitle>{"Bạn có muốn gửi yêu cầu hỗ trợ không?"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Đồng hành với Người Hướng Dẫn IT, học viên không chỉ chinh phục
            thách thức kỹ thuật, mà còn khám phá sự phát triển chuyên sâu và mối
            quan hệ chuyên nghiệp bền vững.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Thoát
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSendmatch}
            sx={{ marginRight: "16px", minWidth: 150 }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
