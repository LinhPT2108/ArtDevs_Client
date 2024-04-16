"use client";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedIcon from "@mui/icons-material/Feed";
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  Divider,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Slide,
  SlideProps,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse, mutate } from "swr";
import { calculateTimeDifference } from "@/components/utils/utils";
import {
  GLOBAL_BG,
  GLOBAL_BG_NAV,
  GLOBAL_BG_NOTIFY,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_URL,
  GLOBAL_SEND_FRIEND,
} from "@/components/utils/veriable.global";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { TransitionProps } from "@mui/material/transitions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
interface IPros {
  session: User;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}
const UserAccept = ({ session }: IPros) => {
  const [stateAlert, setStateAlert] = useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & { children: React.ReactElement<any, any> }
    >;
    RelaNoti: RelaNotiDTO | null;
  }>({
    open: false,
    Transition: Fade,
    RelaNoti: null,
  });

  const handleClick = () => {
    setStateAlert({
      ...stateAlert,
      open: true,
      Transition: SlideTransition,
    });
  };

  const handleCloseAlert = () => {
    setStateAlert({
      ...stateAlert,
      open: false,
    });
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [snackbar3Open, setSnackbar3Open] = useState(false);
  const [listDataUserRequest, setListDataUserRequest] = useState<Relation[]>(
    []
  );
  const socket = new SockJS("http://localhost:8080/friend");
  const stompClient = Stomp.over(socket);
  const connectAndSubscribe = () => {
    stompClient.connect(
      {},
      () => {
        console.log("Connected to WebSocket server");
        stompClient.subscribe(
          `/user/${session?.user?.userId}/friend`,
          (message) => {
            if (message) {
              mutate(
                GLOBAL_URL + "/api/get-request-friend",
                fetchData(GLOBAL_URL + "/api/get-request-friend"),
                false
              );
              const data: RelaNotiDTO = JSON.parse(message.body);
              console.log(data);
            }
          }
        );
      },
      (error) => {
        console.error("Error connecting to WebSocket server:", error);
      }
    );
  };
  useEffect(() => {
    if (session) {
      connectAndSubscribe();
    }
  }, [session]);
  var router = useRouter();
  const fetchData = async (url: string) => {
    return await sendRequest<Relation[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<Relation[], any> = useSWR(
    GLOBAL_URL + "/api/get-request-friend",
    fetchData,
    {
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  useEffect(() => {
    if (data) {
      setListDataUserRequest(data);
    }
  }, [data]);
  const acceptAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/accept-friend/${UserId}`,
        {
          method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
          // Các tùy chọn khác nếu cần
        }
      );
      console.log(response);
      // Xử lý kết quả
      const data = await response.json();

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };

  const handleacceptAddfriend = async (UserId: string) => {
    try {
      const apiResult = await acceptAddfriend(UserId);
      const relation: RelationNotificationDTO = {
        userAction: session.user.userId,
        userReceive: UserId,
        createDate: new Date(),
        typeRelation: true,
      };
      stompClient.send(
        `${GLOBAL_SEND_FRIEND}/${UserId}`,
        {},
        JSON.stringify(relation)
      );
      console.log("test Result" + apiResult);
      if (apiResult === true) {
        showSnackbar();
        setListDataUserRequest(
          listDataUserRequest.filter((item) => item.userAction.userId != UserId)
        );
      } else {
        mutate(
          GLOBAL_URL + "/api/get-request-friend",
          fetchData(GLOBAL_URL + "/api/get-request-friend"),
          false
        );
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const refusedAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-request-friend/${UserId}`,
        {
          method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
          // Các tùy chọn khác nếu cần
        }
      );
      console.log(response);
      // Xử lý kết quả
      const data = await response.json();

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };

  const handlerefusedAddfriend = async (UserId: string, type: boolean) => {
    try {
      const apiResult = await refusedAddfriend(UserId);

      console.log("test Result" + apiResult);
      if (apiResult === true) {
        if (type) {
          showSnackbar2();
        } else {
          showSnackbar3();
        }
        mutate(
          GLOBAL_URL + "/api/get-request-friend",
          fetchData(GLOBAL_URL + "/api/get-request-friend"),
          false
        );
      } else {
        mutate(
          GLOBAL_URL + "/api/get-request-friend",
          fetchData(GLOBAL_URL + "/api/get-request-friend"),
          false
        );
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };
  const handleClose2 = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar2Open(false);
  };
  const showSnackbar2 = () => {
    setSnackbar2Open(true);
    setTimeout(() => setSnackbar2Open(false), 1000);
  };
  const showSnackbar3 = () => {
    setSnackbar3Open(true);
    setTimeout(() => setSnackbar3Open(false), 10000);
  };
  const handleRedirect = (id: string) => {
    router.push(`/mentor/${id}`);
  };
  const handleRedirectFriend = () => {
    router.push(`/friend`);
  };
  // console.log("check data>>", data);
  // return (
  //   <Box
  //     sx={{
  //       width: "100%",
  //       maxWidth: 250,
  //       bgcolor: GLOBAL_BG,
  //       borderRadius: "12px",
  //       boxShadow: GLOBAL_BOXSHADOW,
  //     }}
  //   >
  //     <List
  //       sx={{
  //         width: "100%",
  //         borderRadius: "12px",
  //         color: GLOBAL_COLOR_BLACK,
  //         marginTop: "12px",
  //         "& p": {
  //           color: GLOBAL_COLOR_BLACK,
  //         },
  //       }}
  //       className="rounded-md"
  //       component="nav"
  //       aria-label="main mailbox folders"
  //       subheader={
  //         <ListSubheader
  //           sx={{
  //             bgcolor: GLOBAL_BG,
  //             color: GLOBAL_COLOR_BLACK,
  //             fontWeight: "bold",
  //             zIndex: "0",
  //             position: "relative",
  //             borderRadius: "12px",
  //             "@media (min-width: 900px)": {
  //               "&": {
  //                 fontSize: "12px",
  //               },
  //             },
  //             "@media (min-width: 1023px)": {
  //               "&": {
  //                 fontSize: "14px",
  //               },
  //             },
  //           }}
  //           component="div"
  //           id="nested-list-subheader"
  //         >
  //           Yêu cầu kết bạn
  //         </ListSubheader>
  //       }
  //     >
  //       <Divider />
  //       {data && data.length > 0 ? (
  //         data.slice(0, 4).map((item, index) => {
  //           return (
  //             <Box
  //               key={index}
  //               sx={{
  //                 paddingBottom: "24px",
  //                 "& p": {
  //                   fontSize: { md: "10px", lg: "14px" },
  //                 },
  //                 "& span": {
  //                   fontSize: { md: "14px", lg: "16px" },
  //                   overflow: "hidden",
  //                   textOverflow: "ellipsis",
  //                   whiteSpace: "nowrap",
  //                 },
  if (data && data?.length > 0) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 250,
          bgcolor: "#293145",
        }}
      >
        <Snackbar
          open={stateAlert.open}
          autoHideDuration={2500}
          onClose={handleCloseAlert}
          TransitionComponent={stateAlert.Transition}
        >
          <Alert
            severity="success"
            icon={
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={{
                  maxHeight: "50px",
                }}
                badgeContent={
                  <Box
                    padding={"5px"}
                    sx={{
                      //                 color: "white",
                      //                 backgroundColor: `gray`,
                      //                 minWidth: "40px",
                      //                 marginRight: { md: "6px", lg: "12px" },
                      //                 borderRadius: "100%",
                      //               }}
                      //             >
                      //               <Avatar
                      //                 alt="Remy Sharp"
                      //                 src={item.userAction.profilePicUrl || "/OIP.jpg"}
                      //                 sx={{ width: 56, height: 56 }}
                      //               />
                      //             </ListItemIcon>
                      //             <ListItemText
                      //               primary={item.userAction.fullname}
                      //               secondary={calculateTimeDifference(item?.timeRelation)}
                      //             />
                      //           </ListItemButton>
                      //           <Stack
                      //             direction="row"
                      //             spacing={0}
                      //             className="flex min-[1023px]:pl-3 justify-center min-[1023px]:justify-start"
                      //             sx={{
                      //               justifyContent: "space-evenly",
                      //               "& .cancel": {
                      //                 backgroundColor: "#eeeeee",
                      //               },
                      //               "& .accept": {
                      //                 backgroundColor: "#2e7d32",
                      //               },
                      //             }}
                      //           >
                      //             <Button
                      //               className="accept"
                      //               variant="contained"
                      //               color="success"
                      //               onClick={() =>
                      //                 handleacceptAddfriend(item?.userAction?.userId)
                      //               }
                      //               sx={{
                      //                 borderRadius: "30px",
                      //               }}
                      //             >
                      //               Đồng ý
                      //             </Button>
                      //             <Button
                      //               className="cancel"
                      //               variant="outlined"
                      //               onClick={() =>
                      //                 handlerefusedAddfriend(item?.userAction?.userId)
                      //               }
                      //               sx={{
                      //                 borderRadius: "30px",
                      //                 backgroundColor: "#eeeeee",
                      //                 color: "#4d3869",
                      //                 border: "none",
                      //                 marginLeft: "4px",
                      //                 "&:hover": {
                      //                   backgroundColor: "#c7c7c7",
                      //                   outline: "none",
                      //                   border: "none",
                      //                 },
                      //               }}
                      //             >
                      //               Từ chối
                      //             </Button>
                      //           </Stack>
                      //         </Box>
                      //       );
                      //     })
                      //   ) : (
                      //     <Typography
                      //       sx={{ margin: "12px 12px 0 12px", color: GLOBAL_COLOR_BLACK }}
                      //     >
                      //       Chưa có lời mời kết bạn !
                      //     </Typography>
                      //   )}
                      // </List>
                      // <CardActions className="justify-center">
                      //   <Button
                      //     size="small"
                      //     variant="contained"
                      //     onClick={() => handleRedirectFriend()}
                      backgroundColor: "#0683FE",

                      borderRadius: "50%",
                    }}
                  >
                    {<PersonAddIcon fontSize="small" sx={{ color: "white" }} />}
                  </Box>
                }
              >
                <Avatar
                  alt={stateAlert.RelaNoti?.userAction.profilePicUrl}
                  src={stateAlert.RelaNoti?.userAction.profilePicUrl}
                  sx={{ width: 50, height: 50 }}
                />
              </Badge>
            }
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseAlert}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <AlertTitle sx={{ fontWeight: "bold" }}>Thông báo mới</AlertTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {stateAlert.RelaNoti?.userAction.fullname}
              </Typography>
              <Typography variant="subtitle2">
                &nbsp;đã gửi một lời mời kết bạn
              </Typography>
            </Box>
          </Alert>
        </Snackbar>
        <List
          sx={{
            width: "100%",

            color: "white",
            marginTop: "12px",
            "& p": {
              color: "white",
            },
          }}
          className="rounded-md"
          component="nav"
          aria-label="main mailbox folders"
          subheader={
            <ListSubheader
              sx={{
                bgcolor: "#293145",
                color: "white",
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
              className="rounded-md"
            >
              Yêu cầu kết bạn
            </ListSubheader>
          }
        >
          {listDataUserRequest &&
            listDataUserRequest.slice(0, 4).map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    paddingBottom: "24px",
                    "& p": {
                      fontSize: { md: "10px", lg: "14px" },
                    },
                    "& span": {
                      fontSize: { md: "14px", lg: "16px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                  className={`${index < data.length - 1 ? "border-b" : ""}`}
                >
                  <ListItemButton
                    onClick={() => handleRedirect(item.userAction.userId)}
                    sx={{ padding: "6px 12px", margin: " 0" }}
                    //   selected={selectedIndex === item.index}
                    //   onClick={(event) => handleListItemClick(event, item.index)}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        backgroundColor: `gray`,
                        padding: "8px",
                        minWidth: "40px",
                        marginRight: { md: "6px", lg: "24px" },
                        borderRadius: "100%",
                      }}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={item.userAction.profilePicUrl || "/OIP.jpg"}
                        sx={{ width: 56, height: 56 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.userAction.fullname}
                      secondary={calculateTimeDifference(item?.timeRelation)}
                    />
                  </ListItemButton>
                  <Stack
                    direction="row"
                    spacing={0}
                    className="flex min-[1023px]:pl-3 justify-center min-[1023px]:justify-start"
                    sx={{
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleacceptAddfriend(item?.userAction?.userId)
                      }
                      sx={{
                        borderRadius: "30px",
                      }}
                    >
                      Đồng ý
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handlerefusedAddfriend(item?.userAction?.userId, true)
                      }
                      sx={{
                        borderRadius: "30px",
                        backgroundColor: "#eeeeee",
                        color: "#4d3869",
                        border: "none",
                        marginLeft: "4px",
                        "&:hover": {
                          backgroundColor: "#c7c7c7",
                          outline: "none",
                          border: "none",
                        },
                      }}
                    >
                      Từ chối
                    </Button>
                  </Stack>
                </Box>
              );
            })}
        </List>
        <CardActions className="justify-center">
          <Button
            size="small"
            variant="contained"
            onClick={() => handleRedirectFriend()}
            sx={{
              borderRadius: "30px",
              backgroundColor: "#eeeeee",
              color: "#4d3869",
              display: data && data.length > 3 ? "flex" : "none",
              "&:hover": {
                backgroundColor: "#ffffff",
                outline: "none",
                border: "none",
              },
            }}
          >
            Tất cả yêu cầu
          </Button>
        </CardActions>
        <Snackbar
          open={snackbarOpen}
          message="Đã đồng ý kết bạn !"
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          sx={{
            color: "white",
            backgroundColor: "#4CAF50",
          }}
        />
        <Snackbar
          open={snackbar2Open}
          message="Từ chối lời mời kết bạn!"
          autoHideDuration={3000}
          onClose={() => setSnackbar2Open(false)}
          sx={{
            color: "black",
          }}
        />
        <Snackbar
          open={snackbar3Open}
          message="Hủy gửi lời mời kết bạn!"
          autoHideDuration={3000}
          onClose={() => setSnackbar3Open(false)}
          sx={{
            color: "black",
          }}
        />
      </Box>
    );
  }
};
export default UserAccept;
