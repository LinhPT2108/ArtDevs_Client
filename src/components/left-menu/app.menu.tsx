import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import FeedIcon from "@mui/icons-material/Feed";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmsIcon from "@mui/icons-material/Sms";
import Link from "next/link";

const AppMenu = () => {
  const leftMenu = [];
  const info: ListItem[] = [
    {
      index: 0,
      content: "Bảng tin",
      icon: <FeedIcon />,
      bgColor: "#9b2828",
      url: "/bang-tin",
    },
    {
      index: 1,
      content: "Giảng viên",
      icon: <PersonSearchIcon />,
      bgColor: "#9c933c",
      url: "/mentor",
    },
    {
      index: 2,
      content: "Hash tag",
      icon: <BookmarksIcon />,
      bgColor: "#1e8d10",
      url: "/hash-tag",
    },
    {
      index: 3,
      content: "Trang cá nhân",
      icon: <AccountCircleIcon />,
      bgColor: "#263797",
      url: "/trang-ca-nhan",
    },
  ];
  const recent: ListItem[] = [
    {
      index: 4,
      content: "Hộp thư điện tử",
      icon: <SmsIcon />,
      bgColor: "#263797",
      url: "/chat",
    },
    {
      index: 5,
      content: "Near post",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/near-post",
    },
    {
      index: 6,
      content: "Last event",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/last-event",
    },
    {
      index: 7,
      content: "Live",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/live",
    },
  ];
  const setting: ListItem[] = [
    {
      index: 8,
      content: "Cài đặt",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/cai-dat",
    },
    {
      index: 9,
      content: "Thống kê",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/thong-ke",
    },
    {
      index: 10,
      content: "Quyền riêng tư",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/quyen-rieng-tu",
    },
    {
      index: 11,
      content: "Đăng xuất",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/api/auth/signout",
    },
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
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: { xs: "58px", sm: "85px" },
          left: { xs: "0", sm: "12px" },
          overflow: "auto",
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
                bgcolor: "#293145",
                color: "white",
                marginTop: "12px",
                borderRadius: "6px",
              }}
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
                    borderRadius: "6px",
                  }}
                  component="div"
                  id="nested-list-subheader"
                >
                  {titleMenu[index]}
                </ListSubheader>
              }
            >
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
                          color: "white",
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
                          color: "#ffffff",
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
    </Box>
  );
};

export default AppMenu;
