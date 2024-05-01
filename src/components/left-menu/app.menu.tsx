import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import FeedIcon from "@mui/icons-material/Feed";
import FeedbackIcon from "@mui/icons-material/Feedback";
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SchoolIcon from "@mui/icons-material/School";
import SecurityIcon from "@mui/icons-material/Security";
import SmsIcon from "@mui/icons-material/Sms";
import {
  Box,
  CardMedia,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import {
  GLOBAL_BG,
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BG_NAV,
  GLOBAL_BG_RED_300,
  GLOBAL_BG_RED_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_COLOR_WHITE,
  GLOBAL_URL,
} from "../utils/veriable.global";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};
const AppMenu = ({ session }: { session: User }) => {
  // lấy url hiện tại
  const currentPath = usePathname();

  //tạo biến router xử lý chuyển hướng tab
  const router = useRouter();

  // gắn giá trị định hình vị trí tab đang chọn
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  //tạo biến xử lý modal đăng xuất
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //tạo dữ liệu cứng trên menu trái
  const leftMenu = [];
  const info: ListItem[] = [
    {
      index: 0,
      content: "Bảng tin",
      icon: <FeedIcon />,
      bgColor: "#004AAD",
      url: "/",
    },
    {
      index: 1,
      content: `${session?.user?.role?.id == 3 ? "Match" : "Người hướng dẫn"}`,
      icon: <SchoolIcon />,
      bgColor: "#004AAD",
      url: "/mentor?tab=all",
    },
    {
      index: 2,
      content: "Bạn bè",
      icon: <GroupIcon />,
      bgColor: "#004AAD",
      url: "/friend",
    },
    {
      index: 3,
      content: "Hashtags",
      icon: <BookmarksIcon />,
      bgColor: "#004AAD",
      url: "/hash-tag",
    },
    {
      index: 4,
      content: "Trang cá nhân",
      icon: <AccountCircleIcon />,
      bgColor: "#004AAD",
      url: "/profile",
    },
  ];
  const recent: ListItem[] = [
    {
      index: 5,
      content: "Bài viết của bạn bè",
      icon: <RecentActorsIcon />,
      bgColor: "#004AAD",
      url: "/friend-post",
    },
    {
      index: 6,
      content: "Bảo mật",
      icon: <SecurityIcon />,
      bgColor: "#004AAD",
      url: "/secure",
    },
    {
      index: 7,
      content: "Đóng góp ý kiến",
      icon: <FeedbackIcon />,
      bgColor: "#004AAD",
      url: "/feedback",
    },
    {
      index: 8,
      content: "Đăng xuất",
      icon: <LogoutIcon />,
      bgColor: "#004AAD",
      url: "#",
    },
  ];
  leftMenu.push(info);
  leftMenu.push(recent);
  const titleMenu = ["Thông tin", "Gần đây"];

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (index == 8) {
      handleOpen();
    }
    setSelectedIndex(index);
  };

  // xử lý khi change tab
  const handleChangeNavTab = () => {
    if (currentPath == "/") {
      setSelectedIndex(0);
    } else if (currentPath == "/friend-post") {
      setSelectedIndex(6);
    } else if (currentPath == "/mentor") {
      setSelectedIndex(1);
    } else if (currentPath == "/profile") {
      setSelectedIndex(4);
    } else {
      setSelectedIndex(null);
    }
  };

  useEffect(() => {
    handleChangeNavTab();
  }, [currentPath]);

  const handler = async () => {
    try {
      const session = await getSession();
      session &&
        (await sendRequest({
          url: GLOBAL_URL + "/api/logout",
          method: "PUT",
          headers: { authorization: `Bearer ${session?.access_token}` },
        }));

      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: { xs: "58px", sm: "108px" },
          left: { xs: "0", sm: "12px" },
          // overflow: "auto",
          maxHeight: { xs: "calc(100vh - 120px)", md: "calc(100vh - 85px)" },
          "&::-webkit-scrollbar": {
            width: "5px",
          },
        }}
      >
        {leftMenu.map((items, index) => {
          return (
            <List
              key={index}
              sx={{
                width: "100%",
                bgcolor: GLOBAL_BG,
                color: GLOBAL_COLOR_BLACK,
                marginTop: "12px",
                borderRadius: "12px",
                boxShadow: GLOBAL_BOXSHADOW,
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
              <Divider />
              {items?.map((item) => {
                return (
                  <ListItemButton
                    sx={{
                      padding: "6px 12px",
                      margin: " 0",
                      "& a": {
                        display: "flex",
                        width: "100%",
                        textDecoration: "none",
                      },
                    }}
                    key={item.index}
                    selected={selectedIndex === item.index}
                    onClick={(event) => handleListItemClick(event, item.index)}
                  >
                    <Link href={`${item.url}`}>
                      <ListItemIcon
                        sx={{
                          color: GLOBAL_BG_NAV,
                          backgroundColor: `${item.bgColor}`,
                          padding: "8px",
                          minWidth: "40px",
                          marginRight: "24px",
                          borderRadius: "100%",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.content}
                        sx={{
                          color: GLOBAL_COLOR_MENU,
                          fontWeight: "bold",
                        }}
                      />
                    </Link>
                  </ListItemButton>
                );
              })}
            </List>
          );
        })}
      </Box>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardMedia
                sx={{ width: { xs: "60px", sm: "100px" } }}
                component="img"
                image="/Art_Devs_y-removebg-preview.png"
                alt="logo"
              />
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ marginX: "8px", color: "#3c2cb7", fontWeight: "bold" }}
              >
                Đăng Xuất
              </Typography>
            </Box>

            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, fontSize: "18px", textAlign: "center" }}
            >
              Bạn có chắc là muốn đăng xuất ?
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "center", marginTop: "18px" }}
            >
              <Box
                sx={{
                  minWidth: "90px",
                  textAlign: "center",
                  borderRadius: "30px",
                  padding: "8px 16px",
                  boxShadow: GLOBAL_BOXSHADOW,
                  background: GLOBAL_BG_BLUE_900,
                  fontWeight: "bold",
                  color: GLOBAL_COLOR_WHITE,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    backgroundColor: GLOBAL_BG_BLUE_300,
                  },
                }}
                onClick={handleClose}
              >
                Hủy
              </Box>
              <Box
                sx={{
                  minWidth: "90px",
                  textAlign: "center",
                  borderRadius: "30px",
                  padding: "8px 16px",
                  boxShadow: GLOBAL_BOXSHADOW,
                  background: GLOBAL_BG_RED_900,
                  fontWeight: "bold",
                  color: GLOBAL_COLOR_WHITE,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    backgroundColor: GLOBAL_BG_RED_300,
                  },
                }}
                onClick={handler}
              >
                Đăng xuất
              </Box>
            </Stack>
          </Box>
        </Modal>
      </div>
    </Box>
  );
};

export default AppMenu;
