"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Collapse,
  ListItemAvatar,
  ListSubheader,
} from "@mui/material";
import DateCalendar from "../search/app.search.date";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_MENU,
  GLOBAL_URL,
} from "../utils/veriable.global";
import { sendRequest } from "../utils/api";
import useSWR, { SWRResponse } from "swr";
import { formatBirthDay, formatDateString, formatDayVN } from "../utils/utils";
import Image from "next/image";
interface IPros {
  session: User;
  window?: () => Window;
}
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface GroupedData {
  [date: string]: LogDTO[];
}
const drawerWidth = 280;

const HomeActivity = ({ session, window }: IPros) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  //biến lấy giá trị tâb
  const search = useSearchParams();
  //biến chuyển hướng
  const router = useRouter();

  const [startDate, setStartDate] = useState<Value>(null);
  const [endDate, setEndDate] = useState<Value>(new Date());
  const [reset, setReset] = useState<boolean>(false);
  const handleResetFilter = () => {
    setEndDate(new Date()), setStartDate(null);
    setDataFilter(undefined);
    setReset(!reset);
  };

  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    handleChangeTab(index);
  };
  const [title, setTitle] = useState<string>("");
  const [tab, setTab] = useState<string>("");

  const handleChangeTab = (newValue: number) => {
    if (newValue == 4) {
      if ((search.get("tab") as string) == "like") {
        setSelectedIndex(0);
      } else if ((search.get("tab") as string) == "comment") {
        setSelectedIndex(1);
      } else if ((search.get("tab") as string) == "share") {
        setSelectedIndex(2);
      } else if ((search.get("tab") as string) == "relationship") {
        setSelectedIndex(3);
      } else {
        setSelectedIndex(4);
      }
    } else {
      if (newValue == 0 && (search.get("tab") as string) != "like") {
        router.push("/activity?tab=like");
      } else if (newValue == 1 && (search.get("tab") as string) != "comment") {
        router.push("/activity?tab=comment");
      } else if (newValue == 2 && (search.get("tab") as string) != "share") {
        router.push("/activity?tab=share");
      } else if (
        newValue == 3 &&
        (search.get("tab") as string) != "relationship"
      ) {
        router.push("/activity?tab=relationship");
      } else {
      }
    }
  };

  useEffect(() => {
    handleChangeTab(4);
    const tabValue = search.get("tab") as string;
    tabValue &&
      setTitle(
        tabValue === "like"
          ? "Lượt thích"
          : tabValue === "comment"
          ? "Bình luận"
          : tabValue === "share"
          ? "Chia sẻ"
          : tabValue === "relationship"
          ? "Mối quan hệ"
          : "Hoạt động của bạn"
      );
    tabValue &&
      setTab(
        tabValue == "relationship"
          ? "send-friend"
          : tabValue == "share"
          ? "share-and-post"
          : tabValue
      );
  }, [search.get("tab") as string]);

  const [page, setPage] = useState<number>(0);

  const fetchData = async (url: string) => {
    return await sendRequest<LogDTO[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: {
        page: page,
      },
    });
  };
  const { data, error, isLoading, mutate }: SWRResponse<LogDTO[], any> = useSWR(
    GLOBAL_URL + "/api/log/" + tab,
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  console.log(">>> check data : ", tab, data);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const groupItemsByDate = (data: LogDTO[]): GroupedData => {
    const groupedData: GroupedData = {};
    //@ts-ignore
    !data?.statusCode &&
      data.forEach((item) => {
        const dateKey = formatDayVN(item.timeLog);
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = [];
        }
        groupedData[dateKey].push(item);
      });
    return groupedData;
  };

  let groupedData: GroupedData = {};
  if (data) {
    groupedData = groupItemsByDate(data);
  }

  const handleRedirect = (id: string, type: string) => {
    if (type == "like") {
      router.push(`/post?id=${id}`);
    } else if (type == "comment") {
      router.push(`/post?id=${id}`);
    } else if (type == "share") {
      router.push(`/post?id=${id}`);
    }
  };

  console.log(">>> check groupedData: ", groupedData);
  const handleContentActivity = (type: string): string => {
    if (type == "like") {
      return "Bạn đã thích bài viết của ";
    } else if (type == "comment") {
      return "Bạn đã bình luận bài viết của ";
    } else if (type == "share") {
      return "Bạn đã chia sẻ bài viết của ";
    } else if (type == "likeShare") {
      return "Bạn đã thích bài chia sẻ của ";
    } else if (type == "commentShare") {
      return "Bạn đã bình luận bài chia sẻ của ";
    } else if (type == "replyCommentShare") {
      return "bạn đã phản hồi bình luận của ";
    } else if (type == "replyComment") {
      return "bạn đã phản hồi bình luận của ";
    } else if (type == "sendFriend") {
      return "Bạn đã gửi lời mời kết bạn đến ";
    } else {
      return "Bạn đã trở thành bạn với";
    }
  };
  const [dataFilter, setDataFilter] = useState<{
    start?: string;
    end?: string;
  }>();
  useEffect(() => {
    if (endDate && startDate && endDate <= new Date() && startDate < endDate) {
      setDataFilter({
        start: formatBirthDay(startDate as Date),
        end: formatBirthDay(endDate as Date),
      });
    }
  }, [startDate, endDate]);

  const fetchDataActivity = async () => {
    console.log(">>> check dataFilter: ", dataFilter);
    const res = await sendRequest<LogDTO[]>({
      url: GLOBAL_URL + "/api/log/" + tab,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: {
        page: page,
        ...dataFilter,
      },
    });
    //@ts-ignore
    if (res && !res.statusCode) {
      mutate(res, false);
    }
  };

  useEffect(() => {
    fetchDataActivity();
  }, [tab, reset]);

  const drawer = (
    <div>
      <Toolbar
        sx={{
          marginTop: "130px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" noWrap component="div">
          Nhật ký hoạt động
        </Typography>
      </Toolbar>
      <Divider />
      <Typography
        noWrap
        component="div"
        sx={{ fontWeight: "bold", padding: "24px 24px 6px 24px" }}
      >
        Bộ lọc
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Collapse in={true}>
          <DateCalendar
            text={"Bất đầu"}
            startDate={startDate}
            setStartDate={setStartDate}
          />
          -
          <DateCalendar
            text={"Kết thúc"}
            startDate={endDate}
            setStartDate={setEndDate}
          />
        </Collapse>
        {endDate && endDate <= new Date() ? (
          startDate && startDate > endDate ? (
            <Typography sx={{ color: "red" }}>
              Ngày bất đầu nhỏ hơn ngày kết thúc!
            </Typography>
          ) : (
            ""
          )
        ) : (
          <Typography sx={{ color: "red" }}>
            Ngày kết thúc nhỏ hơn hoặc bằng hiện tại !
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          color="primary"
          variant="outlined"
          sx={{ margin: "12px 12px 16px 0" }}
          onClick={handleResetFilter}
        >
          Đặt lại
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          sx={{ margin: "12px 28px 16px 0", minWidth: "100px" }}
          onClick={fetchDataActivity}
        >
          Lọc
        </Button>
      </Box>
      <Divider />
      <List>
        <ListItemText
          sx={{ padding: "0 24px" }}
          primary={
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
              Hoạt động của bạn trên ArtDev
            </Typography>
          }
          secondary={
            <Typography sx={{ textAlign: "justify", fontSize: 15 }}>
              Hoạt động của bạn trên ArtDev bao gồm các hoạt động tương tác như
              lượt thích bài viết, bài chia sẻ, lượt comment bài viết bài chia
              sẻ, hành động chia sẻ bài viết và các hoạt động liên quan đến bạn
              bè.
            </Typography>
          }
        />
      </List>
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <ThumbUpOffAltIcon />
          </ListItemIcon>
          <ListItemText primary="Lượt thích" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <CommentIcon />
          </ListItemIcon>
          <ListItemText primary="Bình luận" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <ScreenShareIcon />
          </ListItemIcon>
          <ListItemText primary="Chia sẻ" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <Diversity3Icon />
          </ListItemIcon>
          <ListItemText primary="Mối quan hệ" />
        </ListItemButton>
      </List>
    </div>
  );
  return (
    <Box sx={{ display: "flex", paddingTop: "100px" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className="123123123"
        sx={{
          paddingTop: { xs: "80px", sm: "90px", md: "100px" },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "transparent",
          color: GLOBAL_COLOR_MENU,
          paddingX: { xs: 0, lg: "48px" },
          boxShadow:
            "0px -1px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: "12px 24px", lg: "24px 72px" },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {Object.keys(groupedData).length == 0 && (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <Image
              src="/profile/no_activity.gif"
              width={851}
              height={315}
              alt="no activity"
            />
          </Typography>
        )}
        {Object.keys(groupedData).map((date) => (
          <List
            key={date}
            subheader={
              <ListSubheader
                sx={{
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  fontWeight: "bold",
                  boxShadow: GLOBAL_BOXSHADOW,
                }}
              >
                {date}
              </ListSubheader>
            }
            sx={{
              bgcolor: "background.paper",
              borderRadius: "12px",
              marginBottom: "18px",
            }}
          >
            {groupedData[date].map((item, index) => (
              <ListItem sx={{ boxShadow: GLOBAL_BOXSHADOW }} key={index}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ border: "1px solid gray" }}
                      alt={`Avatar`}
                      src={
                        item?.userPostDTO?.profilePicUrl
                          ? item?.userPostDTO?.profilePicUrl
                          : "/OIP.jpg"
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    onClick={() => handleRedirect(item?.postId, item?.action)}
                    primary={
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        {handleContentActivity(item?.action)}{" "}
                        <Typography
                          component={"p"}
                          sx={{ fontWeight: "bold", marginLeft: "6px" }}
                        >
                          {item?.receiver?.fullname}
                        </Typography>{" "}
                      </Typography>
                    }
                    secondary={item?.content}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );
};
export default HomeActivity;
