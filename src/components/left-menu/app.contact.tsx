import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatMessagesForm from "../chat/chat.form";
import { styled } from "@mui/system";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import {
  GLOBAL_BG,
  GLOBAL_BG_NAV,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
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
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
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

  const rightMenu: any = [];
  //@ts-ignore
  rightMenu.push(ListFriend?.statusCode ? [] : ListFriend);
  //@ts-ignore
  rightMenu.push(ListMentor?.statusCode ? [] : ListMentor);
  const titleMenu = ["Bạn bè", "Mentor"];
  const [selectedIndex, setSelectedIndex] = React.useState(0);
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

  const [newD, setNewD] = React.useState<any>();
  const socket = new SockJS("http://localhost:8080/wss");
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
        {rightMenu &&
          rightMenu?.map((items: UserMessage[], index: number) => {
            return (
              <List
                key={index}
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
                    {titleMenu[index]}
                  </ListSubheader>
                }
              >
                {rightMenu[0]?.length > 0 || rightMenu[1]?.length > 0 ? (
                  (["right"] as const).map((anchor) => (
                    <React.Fragment key={anchor}>
                      {items?.map((item: UserMessage, index: number) => {
                        return (
                          <ListItemButton
                            sx={{
                              padding: { xs: "6px" },
                              margin: " 0",
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
                                sx={{ boxShadow: GLOBAL_BOXSHADOW }}
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
                                  boxShadow: GLOBAL_BOXSHADOW,
                                }}
                              >
                                <AccountCircleIcon />
                              </ListItemIcon>
                            )}

                            <ListItemText
                              primary={item?.fullname}
                              secondary={`${
                                item?.online ? "Online" : "Offline"
                              }`}
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
                      })}
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
                            right: `${openContact ? "210px" : 0}`,
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
                  <Typography
                    component={"h5"}
                    sx={{ padding: "12px ", color: GLOBAL_COLOR_MENU }}
                  >
                    Trống !
                  </Typography>
                )}
              </List>
            );
          })}
      </Box>
    </Box>
  );
};

export default ContactMenu;
