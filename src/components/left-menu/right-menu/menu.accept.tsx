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
              sx={{ paddingBottom: "24px" }}
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
                    marginRight: "24px",
                  }}
                  className="rounded-full"
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
                spacing={1}
                className="flex justify-center"
              >
                <Button
                  variant="contained"
                  className="bg-sky-700 rounded-[30px] px-5"
                >
                  Đồng ý
                </Button>
                <Button
                  // variant="outlined"
                  className="bg-neutral-300 rounded-[30px] px-5"
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
