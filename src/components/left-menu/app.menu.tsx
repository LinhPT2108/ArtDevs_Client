import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import React from "react";
import FeedIcon from "@mui/icons-material/Feed";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "@/style/left-menu.css";

const AppMenu = () => {
  const leftMenu = [];
  const info: ListItem[] = [
    { index: 0, content: "Bản tin", icon: <FeedIcon />, bgColor: "#9b2828" },
    {
      index: 1,
      content: "Giảng viên",
      icon: <PersonSearchIcon />,
      bgColor: "#9c933c",
    },
    {
      index: 2,
      content: "Hash tag",
      icon: <BookmarksIcon />,
      bgColor: "#1e8d10",
    },
    {
      index: 3,
      content: "Trang cá nhân",
      icon: <AccountCircleIcon />,
      bgColor: "#263797",
    },
  ];
  const recent: ListItem[] = [
    {
      index: 4,
      content: "Hộp thư điện tử",
      icon: <FeedIcon />,
      bgColor: "#263797",
    },
    { index: 5, content: "Near post", icon: <FeedIcon />, bgColor: "#263797" },
    { index: 6, content: "Last event", icon: <FeedIcon />, bgColor: "#263797" },
    { index: 7, content: "Live", icon: <FeedIcon />, bgColor: "#263797" },
  ];
  const setting: ListItem[] = [
    { index: 8, content: "Cài đặt", icon: <FeedIcon />, bgColor: "#263797" },
    { index: 9, content: "Thống kê", icon: <FeedIcon />, bgColor: "#263797" },
    {
      index: 10,
      content: "Quyền riêng tư",
      icon: <FeedIcon />,
      bgColor: "#263797",
    },
    { index: 11, content: "Đăng xuất", icon: <FeedIcon />, bgColor: "#263797" },
  ];
  leftMenu.push(info);
  leftMenu.push(recent);
  leftMenu.push(setting);
  const titleMenu = ["Thông tin", "Gần đây", "Thiết lập"];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
      }}
    >
      {leftMenu.map((items, index) => {
        return (
          <List
            key={index}
            sx={{
              width: "100%",
              bgcolor: "#293145",
              color: "white",
              marginTop: "12px",
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
            {items?.map((item) => {
              return (
                <ListItemButton
                  sx={{ padding: "6px 12px", margin: " 0" }}
                  key={item.index}
                  selected={selectedIndex === item.index}
                  onClick={(event) => handleListItemClick(event, item.index)}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      backgroundColor: `${item.bgColor}`,
                      padding: "8px",
                      minWidth: "40px",
                      marginRight: "24px",
                    }}
                    className="rounded-full"
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.content} />
                </ListItemButton>
              );
            })}
          </List>
        );
      })}
    </Box>
  );
};

export default AppMenu;
