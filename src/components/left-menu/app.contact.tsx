import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "@/style/left-menu.css";
interface IUser {
  user: ListItem;
  active: boolean;
  timeActive: Date;
}

const ContactMenu = () => {
  const rightMenu = [];
  const info: IUser[] = [
    {
      user: {
        index: 0,
        content: "Linh Phan",
        icon: <AccountCircleIcon />,
        bgColor: "#9b2828",
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
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 0,
        content: "Linh Phan",
        icon: <AccountCircleIcon />,
        bgColor: "#9b2828",
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
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 0,
        content: "Linh Phan",
        icon: <AccountCircleIcon />,
        bgColor: "#9b2828",
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
      },
      active: true,
      timeActive: new Date(),
    },
  ];
  const recent: IUser[] = [
    {
      user: {
        index: 4,
        content: "Nguyễn C2BT",
        icon: <AccountCircleIcon />,
        bgColor: "pink",
      },
      active: true,
      timeActive: new Date(),
    },
    {
      user: {
        index: 5,
        content: "Thầy Vinh",
        icon: <AccountCircleIcon />,
        bgColor: "pink",
      },
      active: false,
      timeActive: new Date(new Date().getTime() - 18 * 60 * 1000),
    },
  ];

  rightMenu.push(info);
  rightMenu.push(recent);
  const titleMenu = ["Bạn bè", "Mentor"];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };
  function formatTimeDifference(startTime: Date, endTime: Date): string {
    const differenceInMilliseconds = startTime.getTime() - endTime.getTime();

    // Chuyển đổi sang giây, phút, giờ và ngày
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Lựa chọn đơn vị thời gian phù hợp để hiển thị
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
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
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
            {items?.map((item, index) => {
              return (
                <ListItemButton
                  sx={{ padding: "6px 12px", margin: " 0" }}
                  key={index}
                  //   selected={selectedIndex === item.index}
                  //   onClick={(event) => handleListItemClick(event, item.index)}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      backgroundColor: `${item?.user.bgColor}`,
                      padding: "8px",
                      minWidth: "40px",
                      marginRight: "24px",
                    }}
                    className="rounded-full"
                  >
                    {item.user.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.user.content}
                    secondary={`${
                      item.active
                        ? ""
                        : formatTimeDifference(new Date(), item.timeActive)
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
          </List>
        );
      })}
    </Box>
  );
};

export default ContactMenu;
