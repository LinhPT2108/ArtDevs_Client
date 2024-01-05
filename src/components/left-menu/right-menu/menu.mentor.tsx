import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedIcon from "@mui/icons-material/Feed";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
const MenuMentor = () => {
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
            className="rounded-t-md border-b"
          >
            Suggest Mentor
          </ListSubheader>
        }
      >
        {acountAccept.map((item, index) => {
          return (
            <Card
              sx={{ maxWidth: 345, bgcolor: "#293145", padding: "12px 0" }}
              key={index}
            >
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/Art_Devs_y-removebg-preview.png"
              />
              <CardActions className="justify-center">
                <Button
                  size="small"
                  variant="contained"
                  className="bg-gray-200 text-stone-950 rounded-[30px] hover:bg-gray-600 hover:text-white"
                >
                  Mentor được yêu thích
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </List>
    </Box>
  );
};
export default MenuMentor;
