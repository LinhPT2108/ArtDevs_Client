import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedIcon from "@mui/icons-material/Feed";
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
} from "@mui/material";
const MenuAccept = () => {
  const acountAccept: AccountExample[] = [
    { name: "Bản tin", avatar: <FeedIcon />, manualFriend: "12 bạn chung" },
    {
      name: "Giảng viên",
      avatar: <PersonSearchIcon />,
      manualFriend: "9 bạn chung",
    },
    {
      name: "Hash tag",
      avatar: <BookmarksIcon />,
      manualFriend: "12 bạn chung",
    },
    {
      name: "Trang cá nhân",
      avatar: <AccountCircleIcon />,
      manualFriend: "7 bạn chung",
    },
  ];
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
      }}
    >
      <List
        sx={{
          width: "100%",
          bgcolor: "#293145",
          color: "white",
          marginTop: "12px",
          "& p": {
            color: "white",
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
              "@media (min-width: 900px)": {
                "&": {
                  fontSize: "12px",
                },
              },
              "@media (min-width: 1023px)": {
                "&": {
                  fontSize: "14px",
                },
              },
            }}
            component="div"
            id="nested-list-subheader"
            className="rounded-md"
          >
            Yêu cầu kết bạn
          </ListSubheader>
        }
      >
        {acountAccept.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                paddingBottom: "24px",
                "& p": {
                  fontSize: { md: "10px", lg: "14px" },
                },
                "& span": {
                  fontSize: { md: "14px", lg: "16px" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
              className={`${index < acountAccept.length - 1 ? "border-b" : ""}`}
            >
              <ListItemButton
                sx={{ padding: "6px 12px", margin: " 0" }}
                //   selected={selectedIndex === item.index}
                //   onClick={(event) => handleListItemClick(event, item.index)}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    backgroundColor: `gray`,
                    padding: "8px",
                    minWidth: "40px",
                    marginRight: { md: "6px", lg: "24px" },
                    borderRadius: "100%",
                  }}
                >
                  {item.avatar}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={item.manualFriend}
                />
              </ListItemButton>
              <Stack
                direction="row"
                spacing={0}
                className="flex min-[1023px]:pl-3 justify-center min-[1023px]:justify-start"
              >
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: "30px",
                    "@media (min-width: 900px)": {
                      "&": {
                        fontSize: "10px",
                        paddingX: "4px",
                      },
                    },
                    "@media (min-width: 1023px)": {
                      "&": {
                        paddingX: "12px",
                      },
                    },
                    "@media (min-width: 1200px)": {
                      "&": {
                        fontSize: "14px",
                        paddingX: "16px",
                      },
                    },
                  }}
                >
                  Đồng ý
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "30px",
                    backgroundColor: "#eeeeee",
                    color: "#4d3869",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      outline: "none",
                      border: "none",
                    },
                    "@media (min-width: 900px)": {
                      "&": {
                        fontSize: "10px",
                        marginLeft: "4px",
                        paddingX: "10px",
                      },
                    },
                    "@media (min-width: 1200px)": {
                      "&": {
                        fontSize: "14px",
                        marginLeft: "8px",
                        paddingX: "16px",
                      },
                    },
                  }}
                >
                  Từ chối
                </Button>
              </Stack>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};
export default MenuAccept;
