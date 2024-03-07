import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatMessagesForm from "../chat/chat.form";
import { styled } from "@mui/system";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";

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
    "http://localhost:8080/api/get-list-friend",
    fetchData,
    {
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  console.log("Check data :", ListFriend);

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
    "http://localhost:8080/api/get-list-mentor-match",
    fetchData2,
    {
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  console.log("Check ListFriend :", ListFriend);
  console.log("Check ListMentor :", ListMentor);

  const rightMenu = [];

  rightMenu.push(ListFriend);
  rightMenu.push(ListMentor);
  const titleMenu = ["Bạn bè", "Mentor"];
  console.log(">>> check rightMenu: ", rightMenu);
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
  const toggleDrawer = (
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
    console.log(">>> check user:P ", item);

    setState({ ...state, [anchor]: open });
  };
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
          top: { xs: "58px", sm: `${pageUrl == "home" ? "85px" : "70px"}` },
          left: { xs: "0", sm: `${pageUrl == "home" ? "12px" : "0"}` },
          width: `${pageUrl == "home" ? "auto" : "240px"}`,
          overflow: "auto",
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
          rightMenu?.map((items, index) => {
            return (
              <List
                key={index}
                sx={{
                  width: "100%",
                  bgcolor: "#293145",
                  color: "white",
                  marginTop: "12px",
                  "& p": {
                    color: "gray",
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
                    }}
                    component="div"
                    id="nested-list-subheader"
                    className="rounded-md"
                  >
                    {titleMenu[index]}
                  </ListSubheader>
                }
              >
                {(["right"] as const).map((anchor) => (
                  <React.Fragment key={anchor}>
                    {items?.map((item, index) => {
                      return (
                        <ListItemButton
                          sx={{
                            padding: { xs: "6px" },
                            margin: " 0",
                          }}
                          key={index}
                          selected={selectedIndex === index}
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
                            }}
                            className="rounded-full"
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
                ))}
              </List>
            );
          })}
      </Box>
    </Box>
  );
};

export default ContactMenu;
