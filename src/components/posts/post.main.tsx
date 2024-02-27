"use client";
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
  Paper,
  TextField,
  Typography,
  Tooltip,
  Zoom,
  IconButtonProps,
  styled,
  ToggleButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { red } from "@mui/material/colors";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import ClearIcon from "@mui/icons-material/Clear";
import { sendRequest } from "../utils/api";
import { generateUniqueId, isImage } from "../utils/utils";
import "../../style/post-loading.css";
import Slider from "react-slick";
import CustomPaging from "./media.post";
import { useUser } from "@/lib/custom.content";
import { GLOBAL_URL } from "../utils/veriable.global";
import useSWR, { SWRResponse } from "swr";
import SendIcon from "@mui/icons-material/Send";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { AddPhotoAlternate } from "@mui/icons-material";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function ScrollTop(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 0,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}
const formatDateString = (input: string | null): string => {
  if (input) {
    const dateObject = parseISO(input);
    const formattedDate = format(dateObject, "HH:mm:ss dd/MM/yyyy");
    return formattedDate;
  } else {
    return "";
  }
};
function calculateHoursDifference(existingTime: string): number | string {
  const existingDate = new Date(existingTime);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - existingDate.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  if (hoursDifference > 24) {
    const daysDifference = Math.round(hoursDifference / 24);
    return `${daysDifference} ngày trước`;
  } else {
    return `${Math.round(hoursDifference)} giờ trước`;
  }
}

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
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const styleModalComment = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "#1c1e21",
  borderRadius: "12px",
  boxShadow: 24,
  // p: 2,
  "@media (max-width: 768px)": {
    width: "90%",
  },
  "@media (max-width: 480px)": {
    width: "80%",
  },
  "@media (max-width: 320px)": {
    width: "90%",
  },
};

const FadeInImage = styled("img")({
  animation: "fadeIn 0.5s ease-in-out",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const RemoveButton = styled(Button)({
  position: "absolute",
  top: 0,
  right: 0,
  minWidth: "10px",
  transform: "translate(30%, -30%)",
  color: "#7b7b7b",
  borderRadius: "15px",
  backgroundColor: "#30363d",
  padding: "0px !important",
});
// TypeScript interface for props
interface PreviewImageProps {
  url: File;
  index: number;
  handleRemoveImage: (index: number) => void;
}
const PreviewImage: React.FC<PreviewImageProps> = ({ url, index, handleRemoveImage }) => {
  const imageUrl = URL.createObjectURL(url);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        mr: "8px",
      }}
    >
      <FadeInImage src={imageUrl} alt={`Preview ${index}`} width="68" height="68" />
      <RemoveButton onClick={() => handleRemoveImage(index)}>
        <ClearIcon />
      </RemoveButton>
    </Box>
  );
};
interface IPros {
  user: User;
  post?: Post[];
}

const Post = ({ user, post }: IPros, props: Props) => {
  // const { user, setUser } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl2);

  const [openPost, setOpenPost] = React.useState(false);
  const handleOpenPost = () => setOpenPost(true);
  const handleClosePost = () => setOpenPost(false);
  const [dataLoading, setDataLoading] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endPost, setEndPost] = useState<boolean>(false);
  const [endTextPost, setEndTextPost] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comment, setComment] = useState<CommentOfPost[]>([]);
  const [openModalCmt, setOpenModalCmt] = React.useState(false);
  const [selectPost, setSelectPost] = useState<any>();
  const [showAllComments, setShowAllComments] = useState([]);
  const [isShowReplies, setIsShowReplies] = useState(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = React.useState<string[]>([]);
  const [formDataComment, setFormDataComment] =
    React.useState<CommentOfPostToPost>({
      content: "",
      listImageofComment: null,
      userID: user.user.userId,
    });
  const handleCloseModalCmt = () => setOpenModalCmt(false);

  const handleOpenModalCmt = async (post: Post) => {
    setOpenModalCmt(true);
    console.log(post.postId);
    setSelectPost(post.userPost.fullname);

    const getCommentOfPost = await sendRequest<CommentOfPost[]>({
      url: "http://localhost:8080/api/comment/" + post.postId,
      method: "GET",
      queryParams: {
        page: 0,
      },
    });
    setComment(getCommentOfPost);

    console.log(comment);
  };

  const toggleShowReplyCmt = (cmtId: any) => {
    console.log("show cmt");
    setIsShowReplies((prev) => (prev === cmtId ? null : cmtId));
  };

  const fetchData = async (url: string) => {
    return await sendRequest<Post[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${user?.access_token}` },
      queryParams: {
        page: 0,
      },
    });
  };

  const { data, error, isLoading }: SWRResponse<Post[], any> = useSWR(
    "http://localhost:8080/api/news-feed",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  useEffect(() => {
    console.log(data);
    if (data && !error) {
      setPosts(data);
    }
    const handleScroll = () => {
      const element = document.documentElement;
      const isAtBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight;
      if (isAtBottom && !loading) {
        const fetchData = async () => {
          !endPost ? setLoading(true) : setEndTextPost("Bạn đã xem hết !");
          const newData = await sendRequest<Post[]>({
            url: GLOBAL_URL + "/api/news-feed",
            method: "GET",
            headers: { authorization: `Bearer ${user?.access_token}` },
            queryParams: {
              page: `${page}`,
            },
          });
          //@ts-ignore
          if (error || isLoading) {
            setEndPost(true);
          } else {
            data && setDataLoading((prevData) => [...prevData, ...data]);
            setPage((prevPage) => prevPage + 1);
            setLoading(false);
          }
        };
        fetchData();
      }
    };

    !endPost && window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, data, dataLoading]);

  const handleLike = async (postId: string, isDataLoading: boolean) => {
    console.log("like: " + postId);

    if (isDataLoading) {
      console.log(isDataLoading);
      setDataLoading(
        dataLoading.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likeByUserLogged: true,
                totalLike: post.totalLike + 1,
                isProcessingLike: true,
              }
            : post
        )
      );
    } else {
      setPosts(
        posts.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likeByUserLogged: true,
                totalLike: post.totalLike + 1,
                isProcessingLike: true,
              }
            : post
        )
      );
    }
    try {
      const response = await sendRequest<Post[]>({
        url: "http://localhost:8080/api/like/" + postId,
        method: "POST",
        headers: { authorization: `Bearer ${user?.access_token}` },
      });

      console.log(response);
      if (response) {
        // Kết thúc xử lý API cho bài viết này
        if (isDataLoading) {
          console.log(isDataLoading);
          setDataLoading(
            dataLoading.map((post) =>
              post.postId === postId
                ? {
                    ...post,
                    likeByUserLogged: true,
                    totalLike: post.totalLike + 1,
                    isProcessingLike: false,
                  }
                : post
            )
          );
        } else {
          setPosts(
            posts.map((post) =>
              post.postId === postId
                ? {
                    ...post,
                    likeByUserLogged: true,
                    totalLike: post.totalLike + 1,
                    isProcessingLike: false,
                  }
                : post
            )
          );
        }
        console.log(data);
      } else {
        console.log("something wrong");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleUnlike = async (postId: string, isDataLoading: boolean) => {
    console.log("unlike: " + postId);

    if (isDataLoading) {
      console.log(isDataLoading);
      setDataLoading(
        dataLoading.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likeByUserLogged: false,
                totalLike: post.totalLike - 1,
                isProcessingLike: true,
              }
            : post
        )
      );
    } else {
      setPosts(
        posts.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likeByUserLogged: false,
                totalLike: post.totalLike - 1,
                isProcessingLike: true,
              }
            : post
        )
      );
    }
    try {
      const response = await sendRequest<Post[]>({
        url: "http://localhost:8080/api/unlike/" + postId,
        method: "POST",
        headers: { authorization: `Bearer ${user?.access_token}` },
      });

      console.log(response);
      if (response) {
        // Kết thúc xử lý API cho bài viết này
        if (isDataLoading) {
          console.log(isDataLoading);
          setDataLoading(
            dataLoading.map((post) =>
              post.postId === postId
                ? {
                    ...post,
                    likeByUserLogged: false,
                    totalLike: post.totalLike - 1,
                    isProcessingLike: false,
                  }
                : post
            )
          );
        } else {
          setPosts(
            posts.map((post) =>
              post.postId === postId
                ? {
                    ...post,
                    likeByUserLogged: false,
                    totalLike: post.totalLike - 1,
                    isProcessingLike: false,
                  }
                : post
            )
          );
        }
        console.log(data);
      } else {
        console.log("something wrong");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleReplyComment = (cmtId: number) => {
    console.log(cmtId);
  };

  const handleExpandClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [postData, setPostData] = useState<AddPost>({
    postId: "",
    content: "",
    time: new Date(),
    timelineUserId: new Date(),
    userId: user ? user?.user?.userId : "",
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
  const handleChangeContentComment = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormDataComment((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChangePic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target as HTMLInputElement;
    console.log(fileInput.files);
    const selected = fileInput.files;
    setFormDataComment((prevData) => ({
      ...prevData,
      listImageofComment: [
        ...(prevData.listImageofComment || []),
        ...(selected ? Array.from(selected) : []),
      ] as File[],
    }));
     if (selected || (selected == null && selectedFiles.length > 0)) {
    const newSelectedFiles = Array.from(
      selected == null ? selectedFiles : selected
    );
    setSelectedFiles(newSelectedFiles);

    const newPreviewURLs: string[] = [];

    newSelectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewURLs.push(reader.result as string);
        setPreviewURLs([...newPreviewURLs]);
      };
      reader.readAsDataURL(file);
    });
  } else {
    setSelectedFiles([]);
    setPreviewURLs([]);
  }
  };

  const handleRemoveImage = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);

    const newPreviewURLs = [...previewURLs];
    newPreviewURLs.splice(index, 1);
    setPreviewURLs(newPreviewURLs);
    setFormDataComment((prevData) => ({
      ...prevData,
      "listImageofComment": newSelectedFiles
    }));
  };

  const handlePostComment = () => {
    console.log(formDataComment);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "100px",
          height: "86vh",
          alignItems: "center",
          // width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%" }}>
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
              src={user?.user?.profileImageUrl}
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
              {user?.user?.lastName + " ơi, Bạn đang nghĩ gì thế ?"}
            </Button>
          }
        />

        {/* <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>

          <IconButton aria-label="share">
            <CommentIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions> */}
      </Card>
      {posts &&
        posts?.map((p, index) => (
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
              title={p?.userPost?.fullname}
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
              {p?.listImageofPost?.map((item, index) => (
                // <div key={item.id}>
                <CardMedia
                  key={index + item.id}
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

            <CardActions
              disableSpacing
              sx={{
                marginX: "2rem",
                display: "flex",
                justifyContent: "space-evenly",
                borderTop: "1px solid gray",
              }}
            >
              <IconButton
                aria-label="add to favorites"
                sx={{
                  borderRadius: "10px",
                  color: p.likeByUserLogged ? "#ff0000" : "#57585b",
                }}
                onClick={() =>
                  p.likeByUserLogged
                    ? handleUnlike(p?.postId, false)
                    : handleLike(p?.postId, false)
                }
                disabled={p.isProcessingLike}
              >
                <Box
                  sx={{
                    color: "#57585b",
                    fontWeight: "bold",
                    marginRight: "0.75rem",
                  }}
                >
                  {p.totalLike}
                </Box>
                {p.isProcessingLike ? (
                  <CircularProgress size={24} color="secondary" />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <IconButton
                aria-label="comment"
                sx={{
                  borderRadius: "10px",
                }}
                onClick={() => handleOpenModalCmt(p)}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    marginRight: "0.75rem",
                  }}
                >
                  {p.totalComment}
                </Box>
                <CommentIcon />
              </IconButton>

              <IconButton
                aria-label="share"
                sx={{
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    marginRight: "0.75rem",
                  }}
                >
                  {p.totalShare}
                </Box>
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
      {dataLoading &&
        dataLoading?.map((p, index) => (
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
              title={p?.userPost?.fullname}
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
                  key={item.id}
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

            <CardActions
              disableSpacing
              sx={{
                marginX: "2rem",
                display: "flex",
                justifyContent: "space-evenly",
                borderTop: "1px solid gray",
              }}
            >
              <IconButton
                aria-label="add to favorites"
                sx={{
                  borderRadius: "10px",
                  color: p.likeByUserLogged ? "#ff0000" : "#57585b",
                }}
                onClick={() =>
                  p.likeByUserLogged
                    ? handleUnlike(p?.postId, true)
                    : handleLike(p?.postId, true)
                }
              >
                <Box
                  sx={{
                    color: "#57585b",
                    fontWeight: "bold",
                    marginRight: "0.75rem",
                  }}
                >
                  {p.totalLike} {p.likeByUserLogged ? "true" : "false"}
                </Box>
                <FavoriteIcon />
              </IconButton>
              <IconButton
                aria-label="comment"
                sx={{
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    marginRight: "0.75rem",
                  }}
                >
                  {p.totalComment}
                </Box>
                <CommentIcon />
              </IconButton>

              <IconButton
                aria-label="share"
                sx={{
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    marginRight: "0.75rem",
                  }}
                >
                  {p.totalShare}
                </Box>
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {loading ? <div className="loader"></div> : <div>{endTextPost}</div>}
      </Box>
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
                    src={user?.user?.profileImageUrl}
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

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalCmt}
        onClose={handleCloseModalCmt}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModalCmt}>
          <Box sx={styleModalComment}>
            <React.Fragment>
              <CssBaseline />
              <AppBar
                sx={{ backgroundColor: "#1c1e21", padding: "0px !important" }}
              >
                <Toolbar
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="h6" component="div">
                    Bài viết của {selectPost}
                  </Typography>
                  <IconButton
                    onClick={handleCloseModalCmt}
                    size="small"
                    aria-controls={openPost ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openPost ? "true" : undefined}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, backgroundColor: "gray" }}
                    >
                      <ClearIcon />
                    </Avatar>
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Toolbar id="back-to-top-anchor" />
              <Container
                sx={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  backgroundColor: "#1c1e21",
                }}
              >
                <Box sx={{ my: 2, color: "white" }}>
                  {comment &&
                    comment?.map((c: CommentOfPost, index) => (
                      <Box key={index + c.id}>
                        <Box
                          component={"div"}
                          sx={{ display: "flex" }}
                          className="box-comment"
                        >
                          <Avatar
                            alt=""
                            src={c.userID.profilePicUrl}
                            sx={{ width: 36, height: 36 }}
                          />
                          <Box>
                            <Card
                              sx={{
                                backgroundColor: "#3A3B3C",
                                ml: "7px",
                                color: "white",
                                display: "inline-block ",
                                borderRadius: "15px",
                              }}
                            >
                              <Link
                                href="/1"
                                style={{ textDecoration: "none" }}
                              >
                                <CardHeader
                                  title={c.userID.fullname}
                                  subheader={""}
                                  sx={{
                                    fontSize: "10px",
                                    paddingY: "7px",
                                    color: "white !important",
                                    mb: "0px",
                                    paddingBottom: "0px",
                                  }}
                                  titleTypographyProps={{
                                    fontSize: "1rem",
                                  }}
                                />
                              </Link>
                              <CardContent
                                sx={{
                                  paddingBottom: "7px !important",
                                  paddingTop: "0px ",
                                }}
                              >
                                <Typography variant="body1">
                                  {c.content}
                                </Typography>
                              </CardContent>
                            </Card>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              {c?.listImageofComment?.map(
                                (item: any, index) => (
                                  <CardMedia
                                    key={index + item}
                                    component={
                                      isImage(item.imageOfCommentUrl) ===
                                      "image"
                                        ? "img"
                                        : isImage(item.imageOfCommentUrl) ===
                                          "video"
                                        ? "video"
                                        : "div"
                                    }
                                    // autoPlay={isImage(item.imageUrl) === "video"}
                                    controls={
                                      isImage(item.imageOfCommentUrl) ===
                                      "video"
                                    }
                                    image={item.imageOfCommentUrl}
                                    alt={item.imageOfCommentUrl}
                                    sx={{
                                      objectFit: "cover",
                                      width: `20%`,
                                      mx: "8px",
                                      borderRadius: "15px",
                                    }}
                                  />
                                )
                              )}
                            </Box>
                            <Box
                              sx={{
                                mx: "15px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Tooltip
                                title={formatDateString(c.timeComment)}
                                TransitionComponent={Zoom}
                                slotProps={{
                                  popper: {
                                    modifiers: [
                                      {
                                        name: "offset",
                                        options: {
                                          offset: [0, -14],
                                        },
                                      },
                                    ],
                                  },
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  display="block"
                                  gutterBottom
                                  sx={{
                                    mb: "0px",
                                    color: "#a5a8ad",
                                    mr: "7px",
                                  }}
                                >
                                  {calculateHoursDifference(c.timeComment)}
                                </Typography>
                              </Tooltip>
                              <Button
                                size="small"
                                onClick={() => handleReplyComment(c.id)}
                              >
                                Phản hồi
                              </Button>
                            </Box>
                          </Box>
                          {/* <div>
                            <Button
                              id="basic-button"
                              aria-controls={open2 ? "basic-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open2 ? "true" : undefined}
                              onClick={handleExpandClick}
                              sx={{
                                p: "0px",
                                minWidth: "20px !important",
                                borderRadius: "50%",
                                ml: "5px",
                              }}
                            >
                              <MoreVertIcon />
                            </Button>
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl2}
                              open={open2}
                              onClose={handleClose2}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              <MenuItem onClick={handleClose2}>
                                Xóa bình luận
                              </MenuItem>
                            </Menu>
                          </div> */}
                        </Box>
                        {c.listReplyComment &&
                          c.listReplyComment?.length > 0 && (
                            <Button
                              sx={{
                                ml: "2rem",
                                color: "#a5a8ad",
                                paddingTop: "5px",
                                marginBottom: "7px",
                              }}
                              startIcon={<SubdirectoryArrowRightIcon />}
                              onClick={() => toggleShowReplyCmt(c.id)}
                            >
                              {isShowReplies === c.id
                                ? "Ẩn"
                                : `Xem tất cả ${c.listReplyComment.length} bình luận`}
                            </Button>
                          )}
                        {isShowReplies === c.id &&
                          c.listReplyComment &&
                          c.listReplyComment?.map(
                            (rl: ListReplyComment, index) => (
                              <Box
                                key={index}
                                className="reply-comment"
                                sx={{ ml: "2rem" }}
                              >
                                <Box
                                  component={"div"}
                                  sx={{ display: "flex" }}
                                  className="box-comment"
                                >
                                  <Avatar
                                    alt=""
                                    src={rl.userID.profilePicUrl}
                                    sx={{ width: 30, height: 30 }}
                                  />
                                  <Box>
                                    <Card
                                      sx={{
                                        backgroundColor: "#3A3B3C",
                                        ml: "7px",
                                        color: "white",
                                        display: "inline-block ",
                                        borderRadius: "15px",
                                      }}
                                    >
                                      <Link
                                        href="/1"
                                        style={{ textDecoration: "none" }}
                                      >
                                        <CardHeader
                                          title={rl.userID.fullname}
                                          subheader={""}
                                          sx={{
                                            fontSize: "10px",
                                            paddingY: "7px",
                                            color: "white !important",
                                            paddingBottom: "0px",
                                          }}
                                          titleTypographyProps={{
                                            fontSize: "1rem",
                                          }}
                                        />
                                      </Link>
                                      <CardContent
                                        sx={{
                                          paddingBottom: "7px !important",
                                          paddingTop: "0px ",
                                        }}
                                      >
                                        <Typography variant="body1">
                                          {rl.content}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Box sx={{ display: "flex", mt: "5px" }}>
                                      {rl.listPictureOfComment?.map(
                                        (item2: any, index) => (
                                          <CardMedia
                                            key={index + item2}
                                            component={
                                              isImage(
                                                item2.imageOfCommentUrl
                                              ) === "image"
                                                ? "img"
                                                : isImage(
                                                    item2.imageOfCommentUrl
                                                  ) === "video"
                                                ? "video"
                                                : "div"
                                            }
                                            // autoPlay={isImage(item2.imageUrl) === "video"}
                                            controls={
                                              isImage(
                                                item2.imageOfCommentUrl
                                              ) === "video"
                                            }
                                            image={item2.imageOfCommentUrl}
                                            alt={item2.imageOfCommentUrl}
                                            sx={{
                                              objectFit: "cover",
                                              width: `20%`,
                                              mx: "8px",
                                              borderRadius: "15px",
                                            }}
                                          />
                                        )
                                      )}
                                    </Box>
                                    <Box
                                      sx={{
                                        mx: "15px",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Tooltip
                                        title={formatDateString(c.timeComment)}
                                        TransitionComponent={Zoom}
                                        slotProps={{
                                          popper: {
                                            modifiers: [
                                              {
                                                name: "offset",
                                                options: {
                                                  offset: [0, -14],
                                                },
                                              },
                                            ],
                                          },
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          display="block"
                                          gutterBottom
                                          sx={{
                                            mb: "0px",
                                            color: "#a5a8ad",
                                            mr: "7px",
                                          }}
                                        >
                                          {calculateHoursDifference(
                                            c.timeComment
                                          )}
                                        </Typography>
                                      </Tooltip>
                                      <Button
                                        size="small"
                                        onClick={() => handleReplyComment(c.id)}
                                      >
                                        Phản hồi
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            )
                          )}
                      </Box>
                    ))}
                </Box>
              </Container>
              {/*  <ScrollTop {...props}>
                <Fab size="small" aria-label="scroll back to top">
                  <KeyboardArrowUpIcon />
                </Fab>
              </ScrollTop>
              */}
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: "#1c1e21",
                  padding: "16px",
                  display: "flex",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: red[500],
                    color: "#000000",
                    marginRight: "12px",
                  }}
                  aria-label="recipe"
                  alt="Profile Picture"
                  src={user?.user?.profileImageUrl}
                ></Avatar>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: "8px" }}
                  >
                    <TextField
                      name="content"
                      label="Viết bình luận..."
                      variant="outlined"
                      multiline
                      rows={3}
                      fullWidth
                      sx={{
                        backgroundColor: "#1c1e21",
                        borderRadius: "7px",
                        color: "white",
                        "& label.Mui-focused": { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "white" },
                          "&.Mui-focused fieldset": { borderColor: "white" },
                        },
                        "& label": { color: "white" },
                      }}
                      InputProps={{ sx: { color: "white" } }}
                      value={formDataComment.content}
                      onChange={handleChangeContentComment}
                    />
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<AddPhotoAlternate />}
                      sx={{
                        p: "0px",
                        backgroundColor: "transparent",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                        boxShadow: "none",
                      }}
                    >
                      <VisuallyHiddenInput
                        type="file"
                        accept=".jpg, .png "
                        onChange={handleChangePic}
                        multiple
                        name="listImageofComment"
                      />
                    </Button>
                    <IconButton
                      color="primary"
                      sx={{
                        marginLeft: "8px",
                        backgroundColor: "#30363d",
                        "&:hover": { backgroundColor: "#50595f" },
                      }}
                      onClick={handlePostComment}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                  {formDataComment.listImageofComment?.map((url, index) => (
                    <PreviewImage
                      key={index}
                      url={url}
                      index={index}
                      handleRemoveImage={handleRemoveImage}
                    />
                  ))}
                </Box>
              </Paper>
            </React.Fragment>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Post;

const top100Films = [{ label: "", year: 0 }];
