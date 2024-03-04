import {
  Box,
  Button,
  CardMedia,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { MouseEventHandler } from "react";
import FeedIcon from "@mui/icons-material/Feed";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmsIcon from "@mui/icons-material/Sms";
import Link from "next/link";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession, signOut } from "next-auth/react";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
const AppMenu = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const leftMenu = [];
  const info: ListItem[] = [
    {
      index: 0,
      content: "Bảng tin",
      icon: <FeedIcon />,
      bgColor: "#9b2828",
      url: "/",
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
      content: "Bạn bè",
      icon: <AccountCircleIcon />,
      bgColor: "#1e8d10",
      url: "/friend",
    },
    {
      index: 3,
      content: "Hash tag",
      icon: <BookmarksIcon />,
      bgColor: "#1e8d10",
      url: "/hash-tag",
    },
    {
      index: 4,
      content: "Trang cá nhân",
      icon: <AccountCircleIcon />,
      bgColor: "#263797",
      url: "/profile",
    },
  ];
  const recent: ListItem[] = [
    {
      index: 5,
      content: "Hộp thư điện tử",
      icon: <SmsIcon />,
      bgColor: "#263797",
      url: "/chat",
    },
    {
      index: 6,
      content: "Near post",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/near-post",
    },
    {
      index: 7,
      content: "Last event",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/last-event",
    },
    {
      index: 8,
      content: "Live",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/live",
    },
  ];
  const setting: ListItem[] = [
    {
      index: 9,
      content: "Cài đặt",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/setting",
    },
    {
      index: 10,
      content: "Thống kê",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/statistical",
    },
    {
      index: 11,
      content: "Quyền riêng tư",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/secure",
    },
    {
      index: 12,
      content: "Đăng xuất",
      icon: <FeedIcon />,
      bgColor: "#263797",
      url: "/",
      // url: "/api/auth/signout",
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
    if (index == 11) {
      handleOpen();
    }
    setSelectedIndex(index);
  };

  const handler = async () => {
    try {
      const session = await getSession();
      console.log(">>> session: ", session);
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
              <Button variant="contained" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="contained" color="error" onClick={handler}>
                Đăng xuất
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </Box>
  );
};

export default AppMenu;
