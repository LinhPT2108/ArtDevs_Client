import {
  Autocomplete,
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { red } from "@mui/material/colors";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import React, { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import ClearIcon from "@mui/icons-material/Clear";
import { sendRequest } from "../utils/api";
import { generateUniqueId, isImage } from "../utils/utils";
import Slider from "react-slick";
import CustomPaging from "./media.post";

const formatDateString = (input: string | null): string => {
  if (input) {
    const dateObject = parseISO(input);
    const formattedDate = format(dateObject, "HH:mm:ss dd/MM/yyyy");
    return formattedDate;
  } else {
    return "";
  }
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  // border: "2px solid #000",
  // p: 4,
};

interface IPros {
  post?: Post[];
  user: User | null;
}

const Post = (pros: IPros) => {
  const { post, user } = pros;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openPost, setOpenPost] = React.useState(false);
  const handleOpenPost = () => setOpenPost(true);
  const handleClosePost = () => setOpenPost(false);

  // Số lượng phần tử muốn thêm khi cuộn tới phần tử cuối cùng

  // Thực hiện khi cuộn tới phần tử cuối cùng
  // const handleScroll = (event: React.UIEvent<HTMLElement>) => {
  //   const element = event.target as HTMLElement;

  //   // Kiểm tra xem đã cuộn tới phần tử cuối cùng chưa
  //   if (element.scrollHeight - element.scrollTop === element.clientHeight) {
  //     // Tăng số lượng phần tử hiển thị lên
  //     setVisibleItems((prev) => prev + itemsToAdd);
  //   }
  // };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [postData, setPostData] = useState<AddPost>({
    postId: "",
    content: "",
    time: new Date(),
    timelineUserId: new Date(),
    userId: user ? user?.user.userId : "",
    listImageofPost: null,
    privacyPostDetails: 1,
    listHashtag: null,
  });

  const handleContentPost = (value: string) => {
    setPostData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };
  const handlePost = async () => {
    setPostData((prevData) => ({
      ...prevData,
      postId: generateUniqueId(),
    }));
    console.log(">>> check post data: ", postData.postId);
    const response = await sendRequest({
      // url: "https://artdevs-server.azurewebsites.net/api/register",
      // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/register",
      url: "http://localhost:8080/api/post",
      method: "POST",
      headers: { authorization: `Bearer ${user?.access_token}` },
      body: { ...postData },
    });
    console.log(">>> check post data: ", response);
  };

  if (post?.length == 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "100px",
          height: "86vh",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box sx={{ overflowY: "auto", height: "100%" }}>
      <Card
        sx={{
          borderRadius: "12px",
          backgroundColor: "#bdc0c7",
          margin: `0 0 24px 0`,
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 2px 4px",
          color: "white",
          "& p": {
            color: "white",
          },
        }}
      >
        <CardHeader
          sx={{
            color: "#000000",
          }}
          avatar={
            <Avatar
              sx={{
                bgcolor: red[500],
                color: "#000000",
                display: "flex",
                alignItems: "center",
                "& .MuiButton-root": {
                  flex: 1,
                },
              }}
              aria-label="recipe"
              alt="Profile Picture"
              src={user?.user?.profilePicUrl}
            ></Avatar>
          }
          title={
            <Button
              onClick={handleOpenPost}
              sx={{
                width: "100%",
                textAlign: "start",
                appearance: "none",
                backgroundColor: "#FAFBFC",
                border: "1px solid rgba(27, 31, 35, 0.15)",
                borderRadius: "30px",
                boxShadow:
                  "rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset",
                boxSizing: "border-box",
                color: "#757575",
                cursor: "default",
                display: "inline-block",
                fontFamily:
                  '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                listStyle: "none",
                padding: "6px 16px 6px 24px",
                position: "relative",
                transition:
                  "background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1)",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "manipulation",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                wordWrap: "break-word",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                  textDecoration: "none",
                  transitionDuration: "0.1s",
                },
                "&:disabled": {
                  backgroundColor: "#FAFBFC",
                  borderColor: "rgba(27, 31, 35, 0.15)",
                  color: "#959DA5",
                  cursor: "default",
                },
                "&:active": {
                  backgroundColor: "#EDEFF2",
                  boxShadow: "rgba(225, 228, 232, 0.2) 0 1px 0 inset",
                  transition: "none 0s",
                },
                "&:focus": {
                  outline: "1px transparent",
                },
                "&:before": {
                  display: "none",
                },
                "&:-webkit-details-marker": {
                  display: "none",
                },
              }}
            >
              {user?.user?.username}
            </Button>
          }
        />

        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <CommentIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
      {post &&
        post?.map((p, index) => (
          <Card
            sx={{
              borderRadius: "12px",
              backgroundColor: "#bdc0c7",
              margin: `0 0 24px 0`,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 2px 4px",
              color: "white",
              "& p": {
                color: "white",
              },
            }}
            key={index + p.userPost.userId}
          >
            <CardHeader
              sx={{
                color: "#000000",
              }}
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500] }}
                  aria-label="recipe"
                  alt="Profile Picture"
                  src={p?.userPost?.profilePicUrl}
                ></Avatar>
              }
              action={
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <MoreVertIcon />
                  </Avatar>
                </IconButton>
              }
              title={p?.userPost?.username}
              subheader={formatDateString(p?.time)}
            />

            <CardContent
              sx={{
                pt: 0,
                "& p": {
                  color: "black",
                },
              }}
            >
              <Typography variant="body2" sx={{ color: "black" }}>
                {p.content}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                paddingX: "16px",
                paddingBottom: "16px",
                "& a": {
                  backgroundColor: "#d6e8fa",
                  color: "#0c3b6a",
                  borderRadius: "4px",
                  fontSize: "12px",
                  // fontWeight: "400",
                  padding: "4.8px 6px",
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  margin: "0 2px 2px 0",
                  border: "1px solid #BDC0C7",
                  textDecoration: "none",
                  gridArea: "auto",
                  "&:hover": {
                    transform: "translateY(-1px) translateX(0)",
                    boxShadow: "0 1px 0 0 #BDC0C7",
                  },
                },
              }}
            >
              {p?.listHashtag?.map((item) => (
                <Link key={item.id} href="/">
                  {item.hashtagDetailName}
                </Link>
              ))}
            </Box>
            <Box sx={{ width: "100%" }} className="slider-container">
              {/* <Slider {...settings}> */}
              {p?.listImageofPost?.map((item) => (
                // <div key={item.id}>
                <CardMedia
                  component={
                    isImage(item.imageUrl) === "image"
                      ? "img"
                      : isImage(item.imageUrl) === "video"
                      ? "video"
                      : "div"
                  }
                  // autoPlay={isImage(item.imageUrl) === "video"}
                  controls={isImage(item.imageUrl) === "video"}
                  image={item?.imageUrl}
                  alt={item?.postID}
                  sx={{
                    objectFit: "cover",
                    maxWidth: "100%",
                    width: ` 100%`,
                  }}
                />
                // </div>
              ))}
              {/* </Slider> */}
            </Box>

            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <CommentIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            </CardActions>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  // filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <ReportGmailerrorredOutlinedIcon sx={{ marginRight: "6px" }} />
                Báo cáo bài viết
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <FlagOutlinedIcon sx={{ marginRight: "6px" }} />
                Báo cáo vi phạm
              </MenuItem>
            </Menu>
          </Card>
        ))}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openPost}
        onClose={handleClosePost}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openPost}>
          <Box sx={style}>
            <Card
              sx={{
                borderTopRightRadius: "12px",
                borderTopLeftRadius: "12px",
                backgroundColor: "#ffffff",
                boxShadow:
                  "rgba(0, 0, 0, 0.16) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 2px 4px",
                color: "white",
                "& p": {
                  color: "white",
                },
              }}
            >
              <CardHeader
                sx={{
                  color: "#000000",
                }}
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                    alt="Profile Picture"
                    src={user?.user?.profilePicUrl}
                  ></Avatar>
                }
                action={
                  <IconButton
                    onClick={handleClosePost}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={openPost ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openPost ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <ClearIcon />
                    </Avatar>
                  </IconButton>
                }
                title={user?.user?.username}
              />

              <CardContent
                sx={{
                  color: "black",
                }}
                className="123"
              >
                <TextField
                  onChange={(e) => handleContentPost(e.target.value)}
                  multiline
                  rows={4}
                  label={`${user?.user?.username} ơi, bạn đang nghĩ gì thế?`}
                  variant="outlined"
                  fullWidth
                  sx={{ outline: "none", border: "none", borderWidth: 0 }}
                />
              </CardContent>
              <CardContent>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  options={top100Films}
                  renderInput={(params) => (
                    <TextField {...params} label="Hash tag" />
                  )}
                />
              </CardContent>
            </Card>
            <Box sx={{ width: "100%", padding: " 6px 16px" }}>
              <Button
                variant="contained"
                fullWidth
                sx={{}}
                onClick={() => handlePost()}
              >
                Đăng
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Post;

const top100Films = [{ label: "", year: 0 }];
