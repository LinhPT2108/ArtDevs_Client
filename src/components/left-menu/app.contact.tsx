import {
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

interface IUser {
  user: ListItem;
  active: boolean;
  timeActive: Date;
}
interface IPros {
  openContact: boolean;
}

type Anchor = "top" | "left" | "bottom" | "right";

export const openDrawer = () => {
  const body = document.body;
  body.classList.add("drawer-open");
};

export const closeDrawer = () => {
  const body = document.body;
  body.classList.remove("drawer-open");
};

const ContactMenu = (pros: IPros) => {
  const { openContact } = pros;
  const rightMenu = [];
  const info: IUser[] = [
    {
      user: {
        index: 0,
        content: "Linh Phan",
        icon: <AccountCircleIcon />,
        bgColor: "#9b2828",
        url: "/",
      },
      active: false,
      timeActive: new Date(new Date().getTime() - 2 * 60 * 1000),
    },
    {
      user: {
        index: 1,
        content: "Trần Chí Nguyễn",
        icon: <AccountCircleIcon />,
        bgColor: "#9c933c",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 2,
        content: "Vinh Olo",
        icon: <AccountCircleIcon />,
        bgColor: "#1e8d10",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 3,
        content: "Vương Gia Khánh",
        icon: <AccountCircleIcon />,
        bgColor: "#263797",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 4,
        content: "Linh Phan",
        icon: <AccountCircleIcon />,
        bgColor: "#9b2828",
        url: "/",
      },
      active: false,
      timeActive: new Date(new Date().getTime() - 2 * 60 * 1000),
    },
    {
      user: {
        index: 5,
        content: "Trần Chí Nguyễn",
        icon: <AccountCircleIcon />,
        bgColor: "#9c933c",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 6,
        content: "Vinh Olo",
        icon: <AccountCircleIcon />,
        bgColor: "#1e8d10",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 7,
        content: "Vương Gia Khánh",
        icon: <AccountCircleIcon />,
        bgColor: "#263797",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 8,
        content: "Linh Phan",
        icon: <AccountCircleIcon />,
        bgColor: "#9b2828",
        url: "/",
      },
      active: false,
      timeActive: new Date(new Date().getTime() - 2 * 60 * 1000),
    },
    {
      user: {
        index: 9,
        content: "Trần Chí Nguyễn",
        icon: <AccountCircleIcon />,
        bgColor: "#9c933c",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 10,
        content: "Vinh Olo",
        icon: <AccountCircleIcon />,
        bgColor: "#1e8d10",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 11,
        content: "Vương Gia Khánh",
        icon: <AccountCircleIcon />,
        bgColor: "#263797",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
  ];
  const recent: IUser[] = [
    {
      user: {
        index: 12,
        content: "Nguyễn C2BT",
        icon: <AccountCircleIcon />,
        bgColor: "pink",
        url: "/",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 13,
        content: "Thầy Vinh",
        icon: <AccountCircleIcon />,
        bgColor: "pink",
        url: "/",
      },
      active: false,
      timeActive: new Date(new Date().getTime() - 18 * 60 * 1000),
    },
  ];

  rightMenu.push(info);
  rightMenu.push(recent);
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
  const [user, setUser] = React.useState<IUser>();
  const toggleDrawer =
    (anchor: Anchor, open: boolean, item: IUser) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      {
        anchor == "right" && !open && setOpenMessages(open);
      }
      {
        open ? openDrawer() : closeDrawer();
      }
      setUser(item);
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
      />
    </Box>
  );
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 320,
        marginTop: { xs: "0", md: "85px" },
        zIndex: "2000",
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          maxHeight: { xs: "calc(100vh - 120px)", md: "calc(100vh - 85px)" },
          "&::-webkit-scrollbar": {
            width: "1px",
          },
        }}
      >
        {rightMenu?.map((items, index) => {
          return (
            <List
              key={`${index}-out${items[index].user.index}`}
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
                  {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}

                  {items?.map((item, index) => {
                    return (
                      <ListItemButton
                        sx={{
                          padding: { xs: "6px" },
                          margin: " 0",
                        }}
                        key={index}
                        selected={selectedIndex === item.user.index}
                        onClick={toggleDrawer(anchor, true, item)}
                      >
                        <ListItemIcon
                          sx={{
                            color: "white",
                            backgroundColor: `${item?.user.bgColor}`,
                            padding: "8px",
                            minWidth: "40px",
                            marginRight: { xs: "6px" },
                            borderRadius: "100%",
                          }}
                        >
                          {item.user.icon}
                        </ListItemIcon>

                        <ListItemText
                          primary={item.user.content}
                          secondary={`${
                            item.active
                              ? ""
                              : formatTimeDifference(
                                  new Date(),
                                  item.timeActive
                                )
                          }`}
                        />

                        <ListItemIcon
                          sx={{
                            color: "white",
                            backgroundColor: `${
                              item.active ? "success.main" : "#7a837e"
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
