import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedIcon from "@mui/icons-material/Feed";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Divider,
  List,
  ListSubheader,
} from "@mui/material";
import {
  GLOBAL_BG,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
} from "@/components/utils/veriable.global";
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
        // maxWidth: 250,
        borderRadius: "12px",
        boxShadow: GLOBAL_BOXSHADOW,
        bgcolor: GLOBAL_BG,
      }}
    >
      <List
        sx={{
          width: "100%",
          color: "white",
          marginTop: "12px",
          "& p": {
            color: "white",
          },
        }}
        component="nav"
        aria-label="main mailbox folders"
        subheader={
          <ListSubheader
            sx={{
              bgcolor: GLOBAL_BG,
              color: GLOBAL_COLOR_BLACK,
              borderRadius: "12px",
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
          >
            Suggest Mentor
          </ListSubheader>
        }
      >
        <Divider />
        {acountAccept.map((item, index) => {
          return (
            <Card
              sx={{ maxWidth: 345, bgcolor: GLOBAL_BG, padding: "12px 0" }}
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
                  sx={{
                    borderRadius: "30px",
                    backgroundColor: "#eeeeee",
                    color: "#4d3869",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      outline: "none",
                      border: "none",
                    },
                  }}
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
