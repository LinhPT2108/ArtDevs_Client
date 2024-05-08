import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatMessagesForm from "../chat/chat.form";
import { styled } from "@mui/system";
import useSWR, { SWRResponse, mutate } from "swr";
import { sendRequest } from "../utils/api";
import CloseIcon from "@mui/icons-material/Close";
import ExploreOffIcon from "@mui/icons-material/ExploreOff";
import {
  GLOBAL_BG,
  GLOBAL_BG_NAV,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_SEND_FRIEND,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
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
  openContact: boolean;
  pageUrl: string;
  getUser?: (user: UserMessage) => void;
  session: User;
}

type Anchor = "top" | "left" | "bottom" | "right";

export const openDrawer = () => {
  const body = document.body;
  const header = document.querySelector("header") as HTMLElement | null;
  body.classList.add("drawer-open");
  header && header.classList.add("drawer-open__header");
};

export const closeDrawer = () => {
  const body = document.body;
  const header = document.querySelector("header") as HTMLElement | null;
  body.classList.remove("drawer-open");
  header && header.classList.remove("drawer-open__header");
};

const ContactMenu = (pros: IPros) => {
  const { openContact, pageUrl, getUser, session } = pros;

  const fetchData = async (url: string) => {
    return await sendRequest<UserMessage[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const {
    data: ListFriend,
    error,
    isLoading,
  }: SWRResponse<UserMessage[], any> = useSWR(
    GLOBAL_URL + "/api/get-list-friend",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: false, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  const fetchDataUserAction = async (url: string) => {
    return await sendRequest<IModelPaginate<UserAction>>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: {
        page: 0,
      },
    });
  };
  const {
    data: listUserSuitable,
    error: errorUserSuitable,
    isLoading: isLoadingUserSuitable,
    mutate: mutateUserSuitable,
  }: SWRResponse<IModelPaginate<UserAction>, any> = useSWR(
    GLOBAL_URL + "/api/get-listfriend-suitable",
    fetchDataUserAction,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: false, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  const fetchDataMentorSuitable = async (url: string) => {
    return await sendRequest<MentorInfor[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const {
    data: dataMentorSuitables,
    error: errorMentorSuitable,
    isLoading: isLoadingMentorSuitable,
  }: SWRResponse<MentorInfor[], any> = useSWR(
    // GLOBAL_URL + "/api/get-mentor-isready",
    GLOBAL_URL + "/api/get-mentor-issuitable",
    fetchDataMentorSuitable,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );
  const fetchData2 = async (url: string) => {
    return await sendRequest<UserMessage[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const {
    data: ListMentor,
    error: errorMentor,
    isLoading: isLoadingMentor,
  }: SWRResponse<UserMessage[], any> = useSWR(
    GLOBAL_URL + "/api/get-list-mentor-match",
    fetchData2,
    {
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  function formatTimeDifference(startTime: Date, endTime: Date): string {
    const differenceInMilliseconds = startTime.getTime() - endTime.getTime();
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return `${seconds} giây trước`;
    }
  }

  const [openMessages, setOpenMessages] = React.useState<boolean>(false);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [user, setUser] = React.useState<UserMessage | undefined>();
  const [dataMessage, setDataMessage] = React.useState<MessageContent[] | null>(
    null
  );

  const socket = new SockJS(GLOBAL_URL + "/wss");
  const stompClient = Stomp.over(socket);
  const connectAndSubscribe = () => {
    stompClient.connect(
      {},
      () => {
        stompClient.subscribe(
          `/user/${session?.user?.userId}/message`, //
          async (message) => {
            const data: MessageContent | pictureOfMessageDTOs = JSON.parse(
              message.body
            );
            if (typeof data === "object") {
              if ("content" in data) {
                const fetchDataMessage = await sendRequest<
                  MessageContent[] | null
                >({
                  url: GLOBAL_URL + `/api/message/${data?.formUserId}`,
                  method: "GET",
                  headers: { authorization: `Bearer ${session?.access_token}` },
                });

                setDataMessage(fetchDataMessage);
              } else if ("cloudinaryPublicId" in data) {
                const fetchDataMessage = await sendRequest<
                  MessageContent[] | null
                >({
                  url: GLOBAL_URL + `/api/message/${user?.userId}`,
                  method: "GET",
                  headers: { authorization: `Bearer ${session?.access_token}` },
                });

                setDataMessage(fetchDataMessage);
              }
            }
          }
        );
      },
      (error) => {
        console.error("Error connecting to WebSocket server:", error);
      }
    );
  };
  const toggleDrawer = async (
    anchor: Anchor,
    open: boolean,
    item: UserMessage | undefined
  ) => {
    {
      anchor == "right" && !open && setOpenMessages(open);
    }
    {
      open ? openDrawer() : closeDrawer();
    }
    setUser(item);

    const fetchDataMessage = await sendRequest<MessageContent[] | null>({
      url: GLOBAL_URL + `/api/message/${item?.userId}`,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });

    console.table(fetchDataMessage);
    setDataMessage(fetchDataMessage);
    connectAndSubscribe();
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    setDataMessage(dataMessage);
  }, [dataMessage]);
  useEffect(() => {
    if (user) {
      connectAndSubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 320,
        backgroundColor: "#293145",
      }}
      role="presentation"
    >
      <ChatMessagesForm
        toggleDrawer={toggleDrawer}
        data={user}
        formatTimeDifference={formatTimeDifference}
        pageUrl={pageUrl}
        session={session}
        dataMessage={dataMessage}
      />
    </Box>
  );

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbar2Open, setSnackbar2Open] = useState<boolean>(false);
  const [snackbar3Open, setSnackbar3Open] = useState<boolean>(false);
  const [snackbar5Open, setSnackbar5Open] = useState<boolean>(false);

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
  const showSnackbar5 = () => {
    setSnackbar5Open(true);
    setTimeout(() => setSnackbar5Open(false), 10000);
  };

  //Send add Friend
  const sendAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${GLOBAL_URL}/api/send-request-friend/${UserId}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error sending match:", error);
      return false;
    }
  };

  const handsenddAddfriend = async (UserId: string) => {
    try {
      const apiResult = await sendAddfriend(UserId);
      console.log("test Result: " + apiResult);
      if (apiResult === true) {
        showSnackbar3();

        mutateUserSuitable(
          {
            meta: listUserSuitable
              ? listUserSuitable?.meta
              : {
                  current: 0,
                  pageSize: 0,
                  pages: 0,
                  total: 0,
                },
            result: Array.isArray(listUserSuitable)
              ? listUserSuitable?.map((t) => {
                  if (t.userId == UserId) {
                    return { ...t, sendStatus: true };
                  }
                  return t;
                })
              : [],
          },
          false
        );
        const relation: RelationNotificationDTO = {
          userAction: session.user.userId,
          userReceive: UserId,
          createDate: new Date(),
          typeRelation: false,
        };
        stompClient.send(
          `${GLOBAL_SEND_FRIEND}/${UserId}`,
          {},
          JSON.stringify(relation)
        );
        // console.log(listUserSuitable);
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const refusedAddfriend = async (
    UserId: string,
    status: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-request-friend/${UserId}?status=${status}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending match:", error);
      return false;
    }
  };

  const handlerefusedAddfriend = async (
    UserId: string,
    type: boolean,
    status: number
  ) => {
    try {
      const apiResult = await refusedAddfriend(UserId, status);

      console.log("test Result" + apiResult);
      if (apiResult === true) {
        mutateUserSuitable(
          {
            meta: listUserSuitable
              ? listUserSuitable?.meta
              : {
                  current: 0,
                  pageSize: 0,
                  pages: 0,
                  total: 0,
                },
            result: Array.isArray(listUserSuitable)
              ? listUserSuitable?.map((t) => {
                  if (t.userId == UserId) {
                    return { ...t, sendStatus: false };
                  }
                  return t;
                })
              : [],
          },
          false
        );
        if (type) {
          showSnackbar2();
        } else {
          showSnackbar5();
        }
      } else {
        console.log("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const [openSendMatch, setOpenSendMatch] = useState<boolean>(false);
  const [mentorId, setMentorId] = useState(String);
  const [isready, setIsReady] = useState(Boolean);

  // đóng modal send match
  const handleCloseSendMatch = () => {
    setOpenSendMatch(false);
  };
  //mở modal send match
  const handleClickOpenSendMatch = (mentorId: string, isReady: boolean) => {
    setOpenSendMatch(true);
    setMentorId(mentorId);
    setIsReady(isReady);
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
          setOpenSendMatch(false);
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
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 320,
        marginTop: { xs: "0", md: `${pageUrl == "home" ? "85px" : "0"}` },
        zIndex: "2000",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: `${pageUrl == "home" ? "static" : "fixed"}`,
          top: { xs: "58px", sm: `${pageUrl == "home" ? "85px" : "105px"}` },
          left: { xs: "0", sm: `${pageUrl == "home" ? "12px" : "0"}` },
          width: `${pageUrl == "home" ? "auto" : "240px"}`,
          overflow: "auto",
          backgroundColor: "#fff",
          borderRight: "1px solid gray",
          maxHeight: {
            xs: "calc(100vh - 120px)",
            md: `${
              pageUrl == "home" ? "calc(100vh - 85px)" : "calc(100vh - 70px)"
            }`,
          },
          "&::-webkit-scrollbar": {
            width: "1px",
          },
        }}
      >
        <List
          sx={{
            width: "100%",
            backgroundColor: GLOBAL_BG,
            minHeight: "45vh",
            color: GLOBAL_COLOR_BLACK,
            marginTop: "12px",
            "& p": {
              color: GLOBAL_COLOR_MENU,
            },
          }}
          component="nav"
          aria-label="main mailbox folders"
          subheader={
            <ListSubheader
              sx={{
                bgcolor: GLOBAL_BG,
                color: GLOBAL_COLOR_BLACK,
                fontWeight: "bold",
                zIndex: "0",
                position: "relative",
                borderRadius: "12px",
              }}
              component="div"
              id="nested-list-subheader"
            >
              Bạn bè
            </ListSubheader>
          }
        >
          {ListFriend && ListFriend.length > 0 ? (
            (["right"] as const).map((anchor) => (
              <React.Fragment key={anchor}>
                {ListFriend?.slice(0, 6).map(
                  (item: UserMessage, index: number) => {
                    return (
                      <ListItemButton
                        sx={{
                          padding: { xs: "6px 6px 6px 18px" },
                          margin: "0",
                        }}
                        key={index}
                        // selected={selectedIndex === index}
                        onClick={() => {
                          if (pageUrl === "home") {
                            toggleDrawer(anchor, true, item);
                          } else {
                            getUser && getUser(item);
                          }
                        }}
                      >
                        {item?.profilePicUrl ? (
                          <Avatar
                            sx={{
                              marginRight: { xs: "6px" },
                              boxShadow: "0 0 3px 1px #494949",
                            }}
                            alt={item?.profilePicUrl || ""}
                            src={item?.profilePicUrl}
                          />
                        ) : (
                          <ListItemIcon
                            sx={{
                              color: "white",
                              backgroundColor: "grey",
                              padding: "8px",
                              minWidth: "40px",
                              marginRight: { xs: "6px" },
                              borderRadius: "100%",
                              boxShadow: "0 0 3px 1px #494949",
                            }}
                          >
                            <AccountCircleIcon />
                          </ListItemIcon>
                        )}

                        <ListItemText
                          primary={item?.fullname}
                          secondary={`${item?.online ? "Online" : "Offline"}`}
                        />

                        <ListItemIcon
                          sx={{
                            color: "white",
                            backgroundColor: `${
                              item?.online ? "success.main" : "#7a837e"
                            }`,
                            padding: "6px",
                            minWidth: "6px",
                            borderRadius: "100%",
                          }}
                        ></ListItemIcon>
                      </ListItemButton>
                    );
                  }
                )}
                <Drawer
                  className="hello"
                  anchor={anchor}
                  open={state[anchor]}
                  sx={{
                    top: "auto",
                    left: "auto",
                    right: "auto",
                    bottom: "auto",
                    overflow: "auto",
                    "& .css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
                      height: "400px",
                      borderRadius: "6px 6px 0 0",
                    },
                    "& .MuiBackdrop-root": {
                      top: "auto",
                      left: "auto",
                      right: "auto",
                      bottom: "auto",
                    },
                    "& .MuiPaper-root": {
                      top: "auto",
                      height: "44vh",
                      right: `${openContact ? "250px" : 0}`,
                      // "@media (min-width: 600px)": {
                      //   bottom: "56px",
                      // },
                      "@media (min-width: 900px)": {
                        bottom: "0",
                        height: "44vh",
                      },
                    },
                  }}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))
          ) : (
            //@ts-ignore
            // !listUserSuitable?.statusCode &&
            // listUserSuitable?.result?.slice(0, 6).map((item, index) => {
            //   return (
            //     <ListItemButton
            //       sx={{
            //         padding: { xs: "6px 6px 6px 18px" },
            //         margin: "0",
            //       }}
            //       key={index}
            //     >
            //       {item?.profilePicUrl ? (
            //         <Avatar
            //           sx={{
            //             boxShadow: "0 0 3px 1px #494949",
            //             marginRight: { xs: "6px" },
            //           }}
            //           alt={item?.profilePicUrl || ""}
            //           src={item?.profilePicUrl}
            //         />
            //       ) : (
            //         <ListItemIcon
            //           sx={{
            //             color: "white",
            //             backgroundColor: "grey",
            //             padding: "8px",
            //             minWidth: "40px",
            //             marginRight: { xs: "6px" },
            //             borderRadius: "100%",
            //             boxShadow: "0 0 3px 1px #494949",
            //           }}
            //         >
            //           <AccountCircleIcon />
            //         </ListItemIcon>
            //       )}

            //       <ListItemText
            //         sx={{ marginLeft: "12px" }}
            //         primary={item?.fullname}
            //         secondary={
            //           item?.sendStatus ? (
            //             <Button
            //               color="primary"
            //               variant="contained"
            //               size="small"
            //               sx={{ fontSize: "11px" }}
            //               onClick={() =>
            //                 handlerefusedAddfriend(item?.userId, false, 0)
            //               }
            //             >
            //               Hủy gửi yêu cầu
            //             </Button>
            //           ) : (
            //             <Button
            //               color="primary"
            //               variant="contained"
            //               size="small"
            //               sx={{ fontSize: "11px" }}
            //               onClick={() => handsenddAddfriend(item?.userId)}
            //             >
            //               Thêm bạn bè
            //             </Button>
            //           )
            //         }
            //       />
            //     </ListItemButton>
            //   );
            // }
            // )
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: "gray",
                height: "35vh",
              }}
            >
              <PersonOffIcon sx={{ fontSize: "55px" }} />
              <Typography variant="h6">Chưa có bạn bè</Typography>
            </Box>
          )}
        </List>
        <List
          sx={{
            width: "100%",
            backgroundColor: GLOBAL_BG,
            minHeight: "45vh",
            color: GLOBAL_COLOR_BLACK,
            marginTop: "12px",
            "& p": {
              color: GLOBAL_COLOR_MENU,
            },
          }}
          component="nav"
          aria-label="main mailbox folders"
          subheader={
            <ListSubheader
              sx={{
                bgcolor: GLOBAL_BG,
                color: GLOBAL_COLOR_BLACK,
                fontWeight: "bold",
                zIndex: "0",
                position: "relative",
                borderRadius: "12px",
              }}
              component="div"
              id="nested-list-subheader"
            >
              Người hướng dẫn
            </ListSubheader>
          }
        >
          {ListMentor && ListMentor.length > 0 ? (
            (["right"] as const).map((anchor) => (
              <React.Fragment key={anchor}>
                {ListMentor?.slice(0, 6).map(
                  (item: UserMessage, index: number) => {
                    return (
                      <ListItemButton
                        sx={{
                          padding: { xs: "6px 6px 6px 18px" },
                          margin: "0",
                        }}
                        key={index}
                        // selected={selectedIndex === index}
                        onClick={() => {
                          if (pageUrl === "home") {
                            toggleDrawer(anchor, true, item);
                          } else {
                            getUser && getUser(item);
                          }
                        }}
                      >
                        {item?.profilePicUrl ? (
                          <Avatar
                            sx={{
                              marginRight: { xs: "6px" },
                              boxShadow: "0 0 3px 1px #494949",
                            }}
                            alt={item?.profilePicUrl || ""}
                            src={item?.profilePicUrl}
                          />
                        ) : (
                          <ListItemIcon
                            sx={{
                              color: "white",
                              backgroundColor: "grey",
                              padding: "8px",
                              minWidth: "40px",
                              marginRight: { xs: "6px" },
                              borderRadius: "100%",
                              boxShadow: "0 0 3px 1px #494949",
                            }}
                          >
                            <AccountCircleIcon />
                          </ListItemIcon>
                        )}

                        <ListItemText
                          primary={item?.fullname}
                          secondary={`${item?.online ? "Online" : "Offline"}`}
                        />

                        <ListItemIcon
                          sx={{
                            color: "white",
                            backgroundColor: `${
                              item?.online ? "success.main" : "#7a837e"
                            }`,
                            padding: "6px",
                            minWidth: "6px",
                            borderRadius: "100%",
                          }}
                        ></ListItemIcon>
                      </ListItemButton>
                    );
                  }
                )}
                <Drawer
                  className="hello"
                  anchor={anchor}
                  open={state[anchor]}
                  sx={{
                    top: "auto",
                    left: "auto",
                    right: "auto",
                    bottom: "auto",
                    overflow: "auto",
                    "& .css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
                      height: "400px",
                      borderRadius: "6px 6px 0 0",
                    },
                    "& .MuiBackdrop-root": {
                      top: "auto",
                      left: "auto",
                      right: "auto",
                      bottom: "auto",
                    },
                    "& .MuiPaper-root": {
                      top: "auto",
                      right: `${openContact ? "250px" : 0}`,
                      "@media (min-width: 600px)": {
                        bottom: "56px",
                      },
                      "@media (min-width: 900px)": {
                        bottom: "0",
                      },
                    },
                  }}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))
          ) : (
            //@ts-ignore
            // !dataMentorSuitables?.statusCode &&
            // dataMentorSuitables?.slice(0, 6).map((item, index) => {
            //   return (
            //     <ListItemButton
            //       sx={{
            //         padding: { xs: "6px 6px 6px 18px" },
            //         margin: "0",
            //       }}
            //       key={index}
            //     >
            //       {item?.profilePicUrl ? (
            //         <Avatar
            //           sx={{
            //             boxShadow: "0 0 3px 1px #494949",
            //             marginRight: { xs: "6px" },
            //           }}
            //           alt={item?.profilePicUrl || ""}
            //           src={item?.profilePicUrl}
            //         />
            //       ) : (
            //         <ListItemIcon
            //           sx={{
            //             color: "white",
            //             backgroundColor: "grey",
            //             padding: "8px",
            //             minWidth: "40px",
            //             marginRight: { xs: "6px" },
            //             borderRadius: "100%",
            //             boxShadow: "0 0 3px 1px #494949",
            //           }}
            //         >
            //           <AccountCircleIcon />
            //         </ListItemIcon>
            //       )}

            //       <ListItemText
            //         sx={{ marginLeft: "12px" }}
            //         primary={item?.fullname}
            //         secondary={
            //           <Button
            //             color="primary"
            //             variant="contained"
            //             size="small"
            //             sx={{ fontSize: "11px" }}
            //             onClick={() =>
            //               handleClickOpenSendMatch(
            //                 item?.userId,
            //                 item?.isReady
            //               )
            //             }
            //           >
            //             Gửi yêu cầu hỗ trợ
            //           </Button>
            //         }
            //       />
            //     </ListItemButton>
            //   );
            // })
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: "gray",
                height: "35vh",
              }}
            >
              <ExploreOffIcon sx={{ fontSize: "55px" }} />
              <Typography variant="h6">Chưa có người hướng dẫn</Typography>
            </Box>
          )}
        </List>
        <Dialog
          open={openSendMatch}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseSendMatch}
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
            onClick={handleCloseSendMatch}
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
              thách thức kỹ thuật, mà còn khám phá sự phát triển chuyên sâu và
              mối quan hệ chuyên nghiệp bền vững.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCloseSendMatch}
            >
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
          open={snackbar5Open}
          message="Hủy gửi lời mời kết bạn!"
          autoHideDuration={3000}
          onClose={() => setSnackbar5Open(false)}
          sx={{
            color: "black",
          }}
        />
        <Snackbar
          open={snackbar2Open}
          message="Hủy kết bạn !"
          autoHideDuration={3000}
          onClose={() => setSnackbar2Open(false)}
          sx={{
            color: "black",
          }}
        />
      </Box>
    </Box>
  );
};

export default ContactMenu;
