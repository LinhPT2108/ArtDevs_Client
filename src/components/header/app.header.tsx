"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchComponent from "./header.search";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  CardMedia,
  ClickAwayListener,
  CssBaseline,
  Divider,
  Drawer,
  Fade,
  Grow,
  GrowProps,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  Paper,
  Popper,
  Slide,
  SlideProps,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import IconTabs from "./header.nav";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AppMenu from "../left-menu/app.menu";
import ContactMenu from "../left-menu/app.contact";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import OptionChat from "../chat/option/chat.option";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
  DRAWER_WIDTH,
  GLOBAL_URL,
  getDrawerOpen,
  getGlobalUser,
  // stompClient
} from "../utils/veriable.global";
import { useUser, useWidthScreen } from "@/lib/custom.content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { formatDateString } from "../utils/utils";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";
import Messsages from "../chat/chat.messages";

type Anchor = "top" | "left" | "bottom" | "right";
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const socket = new SockJS("http://localhost:8080/wss");
 const stompClient = Stomp.over(socket);
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH + 10}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: DRAWER_WIDTH + 10,
  }),
}));

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function GrowTransition(props: GrowProps) {
  return <Grow {...props} />;
}

interface IPros {
  handleDrawerOpen: (openContact: boolean) => void;
  tabValue: number;
  handleChangeTab: (newValue: number) => void;
  openContact: boolean;
  pageUrl: string;
  session: User | null;
}


export default function AppHeader(pros: IPros) {
  const [openNoti, setOpenNoti] = React.useState(false);
  const [dataNotification, setDatanotification] =
    React.useState<notificationToGetDTO>();
  const handleClickNoti = () => {
    setOpenNoti(true);
  };

  const handleCloseNoti = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNoti(false);
  };

  const [stateAlert, setStateAlert] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & { children: React.ReactElement<any, any> }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  const handleClick = () => {
    setStateAlert({
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

  const { widthScreen, setWidthScreen } = useWidthScreen();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [countUnRead, setCountUnRead] = React.useState<number>(0);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [showButton, setShowButton] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const [openReadAll, setOpenReadAll] = React.useState(false);
  const anchorRefReadAll = React.useRef<HTMLButtonElement>(null);

  const [anchorEl2, setAnchorEl2] = React.useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);
  const [open2, setOpen2] = React.useState([]);

  const handleClick2 = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const newOpenArray = [...open2] as boolean[];
    newOpenArray[index] = true;

    const newAnchorEl = [...anchorEl2];
    newAnchorEl[index] = event.currentTarget;

    setOpen2(newOpenArray as []);
    setAnchorEl2(newAnchorEl);
  };

  const handleClose2 = (index: any) => {
    console.log(index);
    const newOpenArray = [...open2] as boolean[];
    newOpenArray[index] = false;

    const newAnchorEl = [...anchorEl2];
    newAnchorEl[index] = null;

    setOpen2(newOpenArray as []);
    setAnchorEl2(newAnchorEl);
  };

  const handleToggleReadAll = () => {
    setOpenReadAll((prevOpen) => !prevOpen);
  };

  const handleCloseReadAll = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRefReadAll.current &&
      anchorRefReadAll.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenReadAll(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
      setOpenReadAll(false);
    } else if (event.key === "Escape") {
      setOpen(false);
      setOpenReadAll(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  const prevOpenReadAll = React.useRef(openReadAll);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (prevOpenReadAll.current === true && openReadAll === false) {
      anchorRefReadAll.current!.focus();
    }

    prevOpenReadAll.current = openReadAll;
  }, [openReadAll]);
  const [alignment, setAlignment] = React.useState("all");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const [selectedContact, setSelectedContact] = React.useState(false);
  const [openContact, setOpenContact] = React.useState(!pros.openContact);
  const [selectedMenu, setSelectedMenu] = React.useState(false);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      {
        anchor == "right" && !open && setOpenContact(open);
      }
      {
        anchor == "left" && !open && setSelectedMenu(open);
      }
      setState({ ...state, [anchor]: open });
    };
  // const windowS: Window = window;
  const [windowSize, setWindowSize] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 900
  );

  const connectAndSubscribe = () => {
    console.log("connect socket: ");
    stompClient.disconnect();
   const stompClient2=Stomp.over(socket);
    // console.log();
    
    stompClient2.connect(
      {},
      () => {
        console.log("Connected to WebSocket server");
        stompClient.subscribe(
          `/user/${user?.user?.userId}/notification`,
          (message) => {
            console.log("Received message:", JSON.parse(message.body));
            if (message) {
              setOpenNoti(true);
              const data: notificationToGetDTO = JSON.parse(message.body);
              setDatanotification(data);
              GetCountUnRead();
            }
          }
        );
      },
      (error) => {
        console.error("Error connecting to WebSocket server:", error);
      }
    );
  };
  // React.useEffect(() => {
  //   connectAndSubscribe();
  // }, []);

  const [page, setPage] = React.useState<number>(0);

  const [dataNoti, setDataNoti] = React.useState<notificationToGetDTO[]>([]);
  React.useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth > 600;
      setWindowSize(window.innerWidth);
      setWidthScreen(window.innerWidth);
      if (isLargeScreen && selectedMenu) {
        toggleDrawer("left", !selectedMenu)({} as React.MouseEvent);
      }
      if (
        window.innerWidth < 900 &&
        !selectedContact &&
        pros &&
        typeof pros.handleDrawerOpen === "function"
      ) {
        setSelectedContact(true);
        pros.handleDrawerOpen(selectedContact);
        toggleDrawer("right", openContact)({} as React.MouseEvent);
      }
      if (window.innerWidth >= 900 && openContact) {
        console.log(">>> check function");
        toggleDrawer("right", !openContact)({} as React.MouseEvent);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);

  const { user } = useUser();
  const getCount = async (url: string) => {
    return await sendRequest<number>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${user?.access_token}` },
    });
  };
  const GetCountUnRead = async () => {
    const response = getCount(`${GLOBAL_URL}/api/count-notifications-unread`);
    console.log(await response);
    setCountUnRead(await response);
  };
  React.useEffect(() => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 900) {
      setSelectedContact(true);
      pros.handleDrawerOpen(selectedContact);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      GetCountUnRead();
      connectAndSubscribe();
    }
  }, [user]);
  const fetchData = async (url: string) => {
    return await sendRequest<notificationToGetDTO[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${user?.access_token}` },
      queryParams: {
        p: 0,
      },
    });
  };

  const { data, error, isLoading }: SWRResponse<notificationToGetDTO[], any> =
    useSWR(
      `http://localhost:8080/api/notifications/${user?.user?.userId}`,
      fetchData,
      {
        shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
        revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
      }
    );
  React.useEffect(() => {
    if (data && !error) {
      console.log(user);
      setDataNoti(data);
      console.table(dataNoti);
    }
  }, [data]);

  const handleLoadMoreNotification = async () => {
    const response = await sendRequest<notificationToGetDTO[]>({
      url: `${GLOBAL_URL}/api/notifications/${user?.user?.userId}`,
      method: "GET",
      headers: { authorization: `Bearer ${user?.access_token}` },
      queryParams: {
        p: page + 1,
      },
    });
    const newPage = page + 1;
    setPage(newPage);
    console.log(page);
    console.table(response);
    console.log(response.length);
    if (response.length > 0) {
      setDataNoti((prevData) => [...prevData, ...response]);
    } else {
      setShowButton(false);
    }
  };

  const handlePutReadAllNotification = async () => {
    const response = await fetch(`${GLOBAL_URL}/api/read-all-notifications`, {
      method: "PUT",
      headers: { authorization: `Bearer ${user?.access_token}` },
    });
    console.log(response);

    if (response.status == 200) {
      const updateNoti = await fetchData(
        `${GLOBAL_URL}/api/notifications/${user?.user?.userId}`
      );
      console.log(await updateNoti);
      setDataNoti(await updateNoti);
      GetCountUnRead();
    } else {
      console.log("error: " + response);
    }
  };

  const handleCheckThisNotificationUnread = async (
    notiId: number,
    read: boolean
  ) => {
    console.log(read);
    const response = await fetch(
      `${GLOBAL_URL}/api/notifications/${notiId}?read=${!read}`,
      {
        method: "PUT",
        headers: { authorization: `Bearer ${user?.access_token}` },
      }
    );
    console.log(response);
    if (response.status == 200) {
      GetCountUnRead();
      setDataNoti((preData) =>
        preData.map((item) =>
          item.id === notiId ? { ...item, read: !read } : item
        )
      );
    } else {
      console.log("error: " + response);
    }
  };

  const handleDeleteNotification = async (notiId: number) => {
    const response = await fetch(
      `${GLOBAL_URL}/api/delete-notifications/${notiId}`,
      {
        method: "DELETE",
        headers: { authorization: `Bearer ${user?.access_token}` },
      }
    );
    console.log(response);
    if (response.status == 200) {
      GetCountUnRead();
      const updatedData = dataNoti.filter((item) => item.id !== notiId);
      setDataNoti(updatedData);
      handleClick();
    } else {
      console.log("error: " + response);
    }
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width:
          anchor === "top" || anchor === "bottom"
            ? "auto"
            : anchor === "right" && pros?.pageUrl == "chat"
            ? 280
            : 210,
        paddingTop: { xs: "58px", sm: "85px" },
        backgroundColor: "#293145",
      }}
      role="presentation"
      onClick={
        anchor === "left" ? () => toggleDrawer(anchor, false) : undefined
      }
      onKeyDown={
        anchor === "left" ? () => toggleDrawer(anchor, false) : undefined
      }
    >
      {anchor === "left" ? (
        pros.pageUrl == "home" ? (
          pros?.session && <AppMenu session={pros?.session} />
        ) : (
          pros?.session && (
            <ContactMenu
              openContact={pros.openContact}
              pageUrl={"home"}
              session={pros?.session}
            />
          )
        )
      ) : pros.pageUrl == "home" ? (
        pros?.session && (
          <ContactMenu
            openContact={pros.openContact}
            pageUrl={"home"}
            session={pros?.session}
          />
        )
      ) : (
        <OptionChat />
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <Snackbar
        open={stateAlert.open}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        TransitionComponent={stateAlert.Transition}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Đã gỡ thông báo !
        </Alert>
      </Snackbar>

      <Snackbar
        open={openNoti}
        autoHideDuration={3000}
        onClose={handleCloseNoti}
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
                    backgroundColor:
                      dataNotification?.message == "like"
                        ? "#0683FE"
                        : dataNotification?.message == "share"
                        ? "#666768"
                        : dataNotification?.message == "comment" ||
                          "replyComment"
                        ? "#61e081"
                        : "",
                    borderRadius: "50%",
                  }}
                >
                  {dataNotification?.message == "like" ? (
                    <ThumbUpIcon fontSize="small" sx={{ color: "white" }} />
                  ) : dataNotification?.message == "share" ? (
                    <ShareIcon fontSize="small" sx={{ color: "white" }} />
                  ) : dataNotification?.message == "comment" ||
                    "replyComment" ? (
                    <CommentIcon fontSize="small" sx={{ color: "white" }} />
                  ) : (
                    ""
                  )}
                </Box>
              }
            >
              <Avatar
                alt={dataNotification?.receiverId.profilePicUrl}
                src={dataNotification?.receiverId.profilePicUrl}
                sx={{ width: 50, height: 50 }}
              />
            </Badge>
          }
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseNoti}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: "bold" }}>Thông báo mới</AlertTitle>
          {dataNotification?.message == "like"
            ? dataNotification?.senderId?.fullname +
              " đã thích bài viết của bạn"
            : dataNotification?.message == "share"
            ? dataNotification?.senderId?.fullname +
              " đã chia sẻ bài viết của bạn"
            : dataNotification?.message == "comment"
            ? dataNotification?.senderId?.fullname +
              " đã bình luận viết của bạn"
            : dataNotification?.message == "replyComment"
            ? dataNotification?.senderId?.fullname +
              " đã phản hồi bình luận của bạn"
            : ""}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#293145",
          color: "text.white",
          padding: { xs: "0px", lg: "0 64px" },
          zIndex: "1202",
        }}
      >
        <Toolbar
          className="flex"
          sx={{
            padding: { xs: "0 6px", sm: "0 12px", md: "0 16px", lg: "0 24px" },
          }}
        >
          <Typography
            variant="h5"
            noWrap
            component="div"
            color="primary.main"
            sx={{
              display: { sm: "block" },
              padding: "6px 0",
              marginRight: { xs: "0", sm: "12px" },
            }}
          >
            <Link href="/">
              <CardMedia
                sx={{ width: { xs: "60px", sm: "100px" } }}
                component="img"
                image="/Art_Devs_y-removebg-preview.png"
                alt="logo"
              />
            </Link>
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="primary.main"
            sx={{
              display: { sm: "inline" },
              padding: "6px 0",
              margin: "0 6px",
              fontWeight: "bolder",
              "& a": {
                color: "#0766FF",
                textDecoration: "none",
                "@media (min-width: 0px)": {
                  fontSize: "14px",
                },
                "@media (min-width: 310px)": {
                  fontSize: "16px",
                },
                "@media (min-width: 400px)": {
                  fontSize: "20px",
                },
              },
            }}
          >
            <Link href="/">Art Devs</Link>
          </Typography>
          <SearchComponent />
          <IconTabs
            tabValue={pros?.tabValue}
            handleChangeTab={pros?.handleChangeTab}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: "flex" }, alignItems: "center" }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{
                display: { xs: "inline", sm: "none" },
                "@media (min-width: 0px)": {
                  padding: "0",
                },
                "@media (min-width: 300px)": {
                  padding: "8px",
                },
                "@media (min-width: 600px)": {
                  padding: "12px",
                },
              }}
            >
              <Badge>
                <SearchIcon
                  sx={{
                    "@media (min-width: 0px)": {
                      fontSize: "16px",
                    },
                    "@media (min-width: 400px)": {
                      fontSize: "24px",
                    },
                  }}
                />
              </Badge>
            </IconButton>
            {windowSize >= 900 && (
              <ToggleButton
                onClick={() => {
                  pros.handleDrawerOpen(selectedContact);
                }}
                value="check"
                selected={selectedContact}
                // aria-label="open drawer"
                onChange={() => {
                  setSelectedContact(!selectedContact);
                }}
                sx={{
                  color: "#ffffff",
                  borderRadius: "100%",
                  padding: { xs: "6px", sm: "12px" },
                  "$ .css-imxc6v-MuiBadge-badge": { fontSize: "0.5rem" },
                  minWidth: { xs: "32px", md: "48px" },
                }}
              >
                <Badge badgeContent={11} color="error">
                  <MailIcon
                    sx={{
                      "@media (min-width: 0px)": {
                        fontSize: "16px",
                      },
                      "@media (min-width: 400px)": {
                        fontSize: "24px",
                      },
                    }}
                  />
                </Badge>
              </ToggleButton>
            )}
            {windowSize < 900 &&
              (["right"] as const).map((anchor, index) => (
                <React.Fragment key={anchor + index}>
                  <ToggleButton
                    onClick={toggleDrawer(anchor, !openContact)}
                    value="check"
                    selected={openContact}
                    onChange={() => {
                      setOpenContact(!openContact);
                    }}
                    sx={{
                      color: "#ffffff",
                      borderRadius: "100%",
                      padding: { xs: "6px", sm: "12px" },
                      "$ .css-imxc6v-MuiBadge-badge": { fontSize: "0.5rem" },
                      minWidth: { xs: "32px", md: "48px" },
                    }}
                  >
                    <Badge badgeContent={11} color="error">
                      <MailIcon
                        sx={{
                          "@media (min-width: 0px)": {
                            fontSize: "16px",
                          },
                          "@media (min-width: 400px)": {
                            fontSize: "24px",
                          },
                        }}
                      />
                    </Badge>
                  </ToggleButton>
                  <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    sx={{
                      "& .css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
                        backgroundColor: "#293145",
                      },
                    }}
                  >
                    {list(anchor)}
                  </Drawer>
                </React.Fragment>
              ))}
            <IconButton
              size="large"
              aria-label="notifications"
              color="inherit"
              sx={{ padding: { xs: "8px", sm: "12px" } }}
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <Badge badgeContent={countUnRead} color="error">
                <NotificationsIcon
                  sx={{
                    "@media (min-width: 0px)": {
                      fontSize: "16px",
                    },
                    "@media (min-width: 400px)": {
                      fontSize: "24px",
                    },
                  }}
                />
              </Badge>
            </IconButton>

            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper
                    sx={{
                      backgroundColor: "#293145",
                      border: "0.5px solid white",
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <Box>
                        <Box px={2} color={"white"}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h1>Thông báo</h1>
                            <Button
                              ref={anchorRefReadAll}
                              id="composition-button-readall"
                              aria-controls={
                                open ? "composition-menu-readall" : undefined
                              }
                              aria-expanded={openReadAll ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={handleToggleReadAll}
                              sx={{
                                borderRadius: "50%",
                                p: "0",
                                minWidth: "40px !important",
                                height: "40px !important",
                              }}
                            >
                              <MoreVertIcon />
                            </Button>
                            <Popper
                              open={openReadAll}
                              anchorEl={anchorRefReadAll.current}
                              role={undefined}
                              placement="bottom-start"
                              transition
                              disablePortal
                              sx={{
                                backgroundColor: "white",
                                zIndex: "9999",
                                borderRadius: "8px",
                              }}
                            >
                              {({ TransitionProps, placement }) => (
                                <Grow
                                  {...TransitionProps}
                                  style={{
                                    transformOrigin:
                                      placement === "bottom-start"
                                        ? "left top"
                                        : "left bottom",
                                  }}
                                >
                                  <Paper
                                    sx={{
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <ClickAwayListener
                                      onClickAway={handleCloseReadAll}
                                    >
                                      <MenuList
                                        autoFocusItem={openReadAll}
                                        id="composition-menu-readall"
                                        aria-labelledby="composition-button-readall"
                                        onKeyDown={handleListKeyDown}
                                        sx={{
                                          p: "4px",
                                          borderRadius: "8px",
                                        }}
                                      >
                                        <MenuItem
                                          onClick={handlePutReadAllNotification}
                                        >
                                          <ListItemIcon>
                                            <DoneAllIcon fontSize="small" />
                                          </ListItemIcon>
                                          <ListItemText>
                                            {" "}
                                            Đánh dấu tất cả là đã đọc
                                          </ListItemText>
                                        </MenuItem>
                                      </MenuList>
                                    </ClickAwayListener>
                                  </Paper>
                                </Grow>
                              )}
                            </Popper>
                          </Box>
                          <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                          >
                            <ToggleButton value="all" sx={{ color: "white" }}>
                              Tất cả
                            </ToggleButton>
                            <ToggleButton value="false" sx={{ color: "white" }}>
                              Chưa đọc
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                        <List
                          sx={{
                            width: "360px",
                            bgcolor: "#293145",
                            maxHeight: "500px",
                            overflow: "auto",
                            "&::-webkit-scrollbar": {
                              width: "5px",
                              borderRadius: "8px",
                              backgroundColor: "#3e4042",
                            },
                            "::-webkit-scrollbar-thumb": {
                              background: "#67686a",
                              borderRadius: "8px",
                            },
                            "::-webkit-scrollbar-thumb:hover": {
                              background: "#89898a",
                            },
                          }}
                        >
                          {dataNoti &&
                            dataNoti?.map((e: notificationToGetDTO, index) => (
                              <Box
                                key={"notification" + index}
                                sx={{ position: "relative" }}
                              >
                                <Link
                                  style={{ textDecoration: "none" }}
                                  href={
                                    e.type == "post"
                                      ? "/post/?id=" + e.postId
                                      : e.type == "share"
                                      ? "/post/share/" + e.shareId
                                      : e.type == "comment"
                                      ? "/post/?id=" + e.postId
                                      : e.type == "replyComment"
                                      ? "/post/?id=" + e.postId
                                      : "#"
                                  }
                                >
                                  <ListItem disablePadding>
                                    <ListItemButton
                                      alignItems="flex-start"
                                      component="div"
                                    >
                                      <ListItemAvatar>
                                        <Badge
                                          overlap="circular"
                                          anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                          }}
                                          badgeContent={
                                            <Box
                                              padding={"5px"}
                                              sx={{
                                                backgroundColor:
                                                  e.message == "like"
                                                    ? "#0683FE"
                                                    : e.message == "share"
                                                    ? "#666768"
                                                    : e.message == "comment" ||
                                                      "replyComment"
                                                    ? "#61e081"
                                                    : "",
                                                borderRadius: "50%",
                                              }}
                                            >
                                              {e.message == "like" ? (
                                                <ThumbUpIcon
                                                  fontSize="small"
                                                  sx={{ color: "white" }}
                                                />
                                              ) : e.message == "share" ? (
                                                <ShareIcon
                                                  fontSize="small"
                                                  sx={{ color: "white" }}
                                                />
                                              ) : e.message == "comment" ||
                                                "replyComment" ? (
                                                <CommentIcon
                                                  fontSize="small"
                                                  sx={{ color: "white" }}
                                                />
                                              ) : (
                                                ""
                                              )}
                                            </Box>
                                          }
                                        >
                                          <Avatar
                                            alt={e.receiverId.profilePicUrl}
                                            src={e.receiverId.profilePicUrl}
                                            sx={{ width: 56, height: 56 }}
                                          />
                                        </Badge>
                                      </ListItemAvatar>
                                      <ListItemText
                                        sx={{ px: "8px" }}
                                        primary={
                                          <React.Fragment>
                                            <Typography
                                              sx={{ display: "inline" }}
                                              component="span"
                                              variant="body2"
                                              color="white"
                                              fontWeight={"bold"}
                                            >
                                              {e.senderId.fullname}
                                            </Typography>
                                            <Typography
                                              sx={{ display: "inline" }}
                                              component="span"
                                              variant="body2"
                                              color="whitesmoke"
                                            >
                                              {e.message == "like"
                                                ? " đã thích bài viết của bạn"
                                                : e.message == "share"
                                                ? " đã chia sẻ bài viết của bạn"
                                                : e.message == "comment"
                                                ? " đã bình luận bài viết của bạn"
                                                : e.message == "replyComment"
                                                ? " đã phản hồi bình luận của bạn"
                                                : ""}
                                            </Typography>
                                          </React.Fragment>
                                        }
                                        secondary={
                                          <Box sx={{ color: "gray" }}>
                                            {formatDateString(
                                              e.createDate.toString()
                                            )}
                                          </Box>
                                        }
                                      />

                                      {!e.read && (
                                        <Box mt={"auto"}>
                                          <CircleIcon
                                            color="primary"
                                            fontSize="small"
                                          />
                                        </Box>
                                      )}
                                    </ListItemButton>
                                  </ListItem>
                                </Link>
                                <IconButton
                                  aria-label="more"
                                  id="long-button"
                                  aria-controls={open ? "long-menu" : undefined}
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={(event) =>
                                    handleClick2(event, index)
                                  }
                                  sx={{
                                    position: "absolute",
                                    zIndex: "99999",
                                    top: 0,
                                    right: 5,
                                  }}
                                >
                                  <MoreVertIcon sx={{ color: "white" }} />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  MenuListProps={{
                                    "aria-labelledby": "long-button",
                                  }}
                                  anchorEl={anchorEl2[index]}
                                  open={open2[index]}
                                  onClose={() => handleClose2(index)}
                                  onClick={() => handleClose2(index)}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                >
                                  <MenuItem
                                    onClick={() =>
                                      handleCheckThisNotificationUnread(
                                        e.id,
                                        e.read
                                      )
                                    }
                                  >
                                    {e.read
                                      ? "Đánh dấu là chưa đọc"
                                      : "Đánh dấu là đã đọc"}
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleDeleteNotification(e.id)
                                    }
                                  >
                                    Gỡ thông báo này
                                  </MenuItem>
                                </Menu>
                                <Divider variant="inset" component="li" />
                              </Box>
                            ))}
                          {showButton && (
                            <Button
                              variant="text"
                              color="primary"
                              onClick={handleLoadMoreNotification}
                              sx={{ textAlign: "center", width: "100%" }}
                            >
                              Hiển thị thêm thông báo
                            </Button>
                          )}
                        </List>
                      </Box>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                display: { xs: "none", sm: "inline" },
                padding: { xs: "8px", sm: "12px" },
              }}
            >
              {user?.user ? (
                user?.user?.profileImageUrl ? (
                  <Avatar
                    alt={user?.user?.firstName || ""}
                    src={user?.user?.profileImageUrl}
                  />
                ) : (
                  <AccountCircle
                    sx={{
                      "@media (min-width: 0px)": {
                        fontSize: "16px",
                      },
                      "@media (min-width: 400px)": {
                        fontSize: "24px",
                      },
                    }}
                  />
                )
              ) : (
                <AccountCircle
                  sx={{
                    "@media (min-width: 0px)": {
                      fontSize: "16px",
                    },
                    "@media (min-width: 400px)": {
                      fontSize: "24px",
                    },
                  }}
                />
              )}
            </IconButton>
            {(["left"] as const).map((anchor) => (
              <React.Fragment key={anchor + "123"}>
                <ToggleButton
                  onClick={toggleDrawer(anchor, !selectedMenu)}
                  value="check"
                  selected={selectedMenu}
                  onChange={() => {
                    setSelectedMenu(!selectedMenu);
                  }}
                  sx={{
                    color: "#ffffff",
                    borderRadius: "100%",
                    display: { xs: "inline", sm: "none" },
                    minWidth: { xs: "36px", sm: "48px" },
                    padding: { xs: "3px", sm: "6px" },
                  }}
                >
                  <MenuIcon />
                </ToggleButton>
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  sx={{
                    "& .css-4t3x6l-MuiPaper-root-MuiDrawer-paper": {
                      backgroundColor: "#293145",
                    },
                  }}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
