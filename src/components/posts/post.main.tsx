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
  imageListItemBarClasses,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { red } from "@mui/material/colors";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import React, { SetStateAction, useEffect, useId, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import ClearIcon from "@mui/icons-material/Clear";
import { sendRequest } from "../utils/api";
import uploadContentAndFiles, {
  generateUniqueId,
  isFile,
  isImage,
  postReplyCommentApi,
} from "../utils/utils";
import "../../style/post-loading.css";
import Slider from "react-slick";
import CustomPaging from "./media.post";
import { useUser } from "@/lib/custom.content";
import {
  GLOBAL_DELETE_COMMENT_MESSAGE,
  GLOBAL_ERROR_MESSAGE,
  GLOBAL_SHARE_MESSAGE,
  GLOBAL_URL,
} from "../utils/veriable.global";
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
import {
  ImageViewerEdit,
  ImageViewer,
  ImageReplyViewerEdit,
} from "../utils/component.global";
import postCommentApi from "../utils/utils";
import { TransitionProps } from "@mui/material/transitions";
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  handleRemoveImage: (index: number, isComment: boolean) => void;
  isComment: boolean;
}
const PreviewImage: React.FC<PreviewImageProps> = ({
  url,
  index,
  isComment,
  handleRemoveImage,
}) => {
  const imageUrl = URL.createObjectURL(url);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        mr: "8px",
      }}
    >
      <FadeInImage
        src={imageUrl}
        alt={`Preview ${index}`}
        width="68"
        height="68"
      />

      <RemoveButton onClick={() => handleRemoveImage(index, isComment)}>
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const handleOpenPost = () => setOpenPost(true);
  const handleClosePost = () => setOpenPost(false);
  const [dataLoading, setDataLoading] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endPost, setEndPost] = useState<boolean>(false);
  const [endTextPost, setEndTextPost] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comment, setComment] = useState<CommentOfPost[]>([]);
  const [openModalCmt, setOpenModalCmt] = useState(false);
  const [selectPost, setSelectPost] = useState<any>();
  const [showAllComments, setShowAllComments] = useState([]);
  const [isShowReplies, setIsShowReplies] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isLoadingEditComment, setIsLoadingEditComment] = useState(false);
  const [isComment, setIsComment] = useState<boolean>(false);
  const [anchorElArray, setAnchorElArray] = useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);
  const [anchorElArrayReply, setAnchorElArrayReply] = useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);
  const [openArray, setOpenArray] = useState([]);
  const [openArrayReply, setOpenArrayReply] = useState([]);
  const [editingIndexComment, setEditingIndexComment] = useState<string>("");
  const [editedContentComment, setEditedContentComment] = useState("");
  const [editedImageComment, setEditedImageComment] = useState<any>();

  const [editingIndexReplyComment, setEditingIndexReplyComment] =
    useState<string>("");

  const [editedContentReplyComment, setEditedContentReplyComment] =
    useState("");
  const [editedImageReplyComment, setEditedImageReplyComment] = useState<any>();
  const [contentSharePost, setContentSharePost] = useState<string>("");

  const [actionDialog, setActionDialog] = useState<any>({
    actionType: "",
    data: {},
  });

  const [dataSnackbar, setDataSnackbar] = useState<any>({
    openSnackbar: false,
    contentSnackbar: "",
    type: "",
  });

  // const handleClickOpenSnackbar = (content: string) => () => {
  //   setDataSnackbar({
  //     openSnackbar: true,
  //     contentSnackbar: "content",
  //   });
  // };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setDataSnackbar({
      openSnackbar: false,
      contentSnackbar: "",
      type: "",
    });
  };

  const handleClickOpenAlerts = (
    dataId: any,
    actionType: string,
    isComment: boolean,
    index: number,
    isDataLoading: boolean
  ) => {
    if (actionType == "deleteCmt") {
      setActionDialog({
        actionType: actionType,
        data: {
          comment: dataId,
          isComment: isComment,
          index: index,
        },
      });
    } else {
      setContentSharePost("");
      setActionDialog({
        actionType: actionType,
        data: {
          post: dataId,
          isComment: isComment,
          index: index,
          isDataloading: isDataLoading,
        },
      });
    }
    console.log(actionDialog);
    setOpenAlerts(true);
  };

  const handleCloseAlerts = () => {
    setContentSharePost("");
    setOpenAlerts(false);
  };
  const handleAgreeAlerts = () => {
    console.log("agree");
    console.log(contentSharePost);
    if (actionDialog.actionType === "deleteCmt") {
      handleDeleteCommentOrReplyComment(
        actionDialog.data.comment,
        actionDialog.data.isComment,
        actionDialog.data.index
      );
    } else {
      handleSharePost(
        actionDialog.data.post.postId,
        actionDialog.data.isDataloading
      );
    }
    console.log(dataSnackbar);
    handleCloseAlerts();
  };

  const handleOpen3 = (
    index: number,
    event: React.MouseEvent<HTMLElement>,
    isCmt: boolean
  ) => {
    console.log(isCmt);
    const newOpenArray = isCmt
      ? [...openArray]
      : ([...openArrayReply] as boolean[]);
    newOpenArray[index] = true;
    const newAnchorElArray = isCmt
      ? [...anchorElArray]
      : [...anchorElArrayReply];
    newAnchorElArray[index] = event.currentTarget;
    if (isCmt) {
      setOpenArray(newOpenArray as []);
      setAnchorElArray(newAnchorElArray);
    } else {
      setOpenArrayReply(newOpenArray as []);
      setAnchorElArrayReply(newAnchorElArray);
    }
  };

  const handleClose3 = (index: number, isCmt: boolean) => {
    const newOpenArray = isCmt
      ? [...openArray]
      : ([...openArrayReply] as boolean[]);
    newOpenArray[index] = false;
    const newAnchorElArray = isCmt
      ? [...anchorElArray]
      : [...anchorElArrayReply];
    newAnchorElArray[index] = null;
    if (isCmt) {
      setOpenArray(newOpenArray as []);
      setAnchorElArray(newAnchorElArray);
    } else {
      setOpenArrayReply(newOpenArray as []);
      setAnchorElArrayReply(newAnchorElArray);
    }
  };

  const handleEditCommentOrReplyComment = (
    commentObject: any,
    isComment: boolean,
    index: number
  ) => {
    console.log("Edit comment:", commentObject);
    if (isComment) {
      setEditingIndexComment(("comment" + index) as any);
      setEditedContentComment(commentObject.content);
      setEditedImageComment(commentObject.listImageofComment);
    } else {
      setEditingIndexReplyComment(("replycomment" + index) as any);
      setEditedContentReplyComment(commentObject.content);
      setEditedImageReplyComment(commentObject.listPictureOfComment);
    }
    handleClose3(index, isComment);
  };

  const handleCancelEditComment = (isComment: boolean, index: number) => {
    if (isComment) {
      setEditingIndexComment("");
      setEditedContentComment("");
    } else {
      setEditingIndexReplyComment("");
      setEditedContentReplyComment("");
    }
  };

  const handleChangePicEditComment = (
    event: React.ChangeEvent<HTMLInputElement>,
    isComment: boolean
  ) => {
    console.log("change pic edit comment: ", isComment);
    const fileInput = event.target as HTMLInputElement;
    const selected = fileInput.files;

    if (selected && selected.length > 0) {
      if (isComment) {
        setEditedImageComment((prevImages: any) => [
          ...(prevImages as any),
          ...Array.from(selected),
        ]);
      } else {
        setEditedImageReplyComment((prevImages: any) => [
          ...(prevImages as any),
          ...Array.from(selected),
        ]);
      }
    }
  };

  const handleSaveEditComment = async (
    isComment: boolean,
    commentObject: any,
    content: string,
    images: any
  ) => {
    setIsLoadingEditComment(true);
    const imageFiles: File[] = Array.from(images).map((imageName: any) => {
      if (typeof imageName.imageOfCommentUrl === "string") {
        const blob = new Blob([], { type: "application/octet-stream" });
        const fileType = "image/jpeg";
        const fileSize = blob.size;
        const file = new File([blob], imageName.imageOfCommentUrl, {
          type: fileType,
          size: fileSize,
        } as any);
        return file;
      } else {
        return imageName as File;
      }
    });
    const formData = new FormData();
    if (isComment) {
      formData.append("content", content);
      if (imageFiles) {
        imageFiles.forEach((file: any, index: any) => {
          console.log(file);

          formData.append("listImageofComment", file);
        });
      } else {
        formData.append("listImageofComment", "");
      }
      try {
        const response = await fetch(
          GLOBAL_URL + "/api/comment/" + commentObject.id,
          {
            method: "PUT",
            headers: { authorization: `Bearer ${user?.access_token}` },
            body: formData,
          }
        );

        if (response.status == 200) {
          setEditingIndexComment("");
          setEditedContentComment("");
          setEditedImageComment("");
          const data = await response.json();
          console.log(data);
          setComment((prevComments) =>
            prevComments.map((prevComment) =>
              prevComment.id === data.id
                ? { ...prevComment, ...data }
                : prevComment
            )
          );
          setIsLoadingEditComment(false);
        }
      } catch (error) {
        setIsLoadingEditComment(false);
        console.log(error);
      }
    } else {
      setIsLoadingEditComment(true);
      formData.append("content", content);
      if (imageFiles) {
        imageFiles.forEach((file: any, index: any) => {
          console.log(file);
          formData.append("listImageofComment", file);
        });
      } else {
        formData.append("listImageofComment", "");
      }
      try {
        const response = await fetch(
          GLOBAL_URL + "/api/replyComment/" + commentObject.id,
          {
            method: "PUT",
            headers: { authorization: `Bearer ${user?.access_token}` },
            body: formData,
          }
        );

        if (response.status == 200) {
          setEditingIndexReplyComment("");
          setEditedContentReplyComment("");
          setEditedImageReplyComment("");
          const data = await response.json();
          console.log(data);
          setComment((prevComments) => {
            return prevComments.map((comment) => {
              if (comment.id === data.commentID) {
                return {
                  ...comment,
                  listReplyComment: comment.listReplyComment
                    ? comment.listReplyComment.map((reply) =>
                        reply.id === data.id ? data : reply
                      )
                    : [data],
                };
              }
              return comment;
            });
          });
          setIsLoadingEditComment(false);
        }
      } catch (error) {
        setIsLoadingEditComment(false);
        console.log(error);
      }
    }
  };

  const handleDeleteCommentOrReplyComment = async (
    commentObject: any,
    isComment2: boolean,
    index: number
  ) => {
    console.log("Delete:", commentObject);
    const url = isComment2
      ? GLOBAL_URL + "/api/comment/" + commentObject.id
      : GLOBAL_URL + "/api/replyComment/" + commentObject.id;

    const response = await sendRequest<boolean>({
      url,
      headers: { authorization: `Bearer ${user?.access_token}` },
      method: "DELETE",
    });

    console.log(response);

    if (response) {
      if (isComment2) {
        setComment((prevComments) =>
          prevComments.filter((c) => c.id !== commentObject.id)
        );
      } else {
        setComment((prevComments) =>
          prevComments.map((c) =>
            c.id === commentObject.commentID
              ? {
                  ...c,
                  listReplyComment:
                    c.listReplyComment &&
                    c.listReplyComment?.filter(
                      (reply) => reply.id !== commentObject.id
                    ),
                }
              : c
          )
        );
      }
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_DELETE_COMMENT_MESSAGE,
        type: "success",
      });
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
    }
    handleClose3(index, isComment2);
  };

  const [formDataComment, setFormDataComment] =
    React.useState<CommentToPostDTO>({
      content: "",
      listImageofComment: null,
      userToPost: user?.user?.userId,
      postToPost: "",
      userReceive: "",
    });

  const [formDataReplyComment, setFormDataReplyComment] =
    React.useState<ReplyCommentToPostDTO>({
      content: "",
      listImageofComment: null,
      userToPost: user?.user?.userId,
      commentToPost: null as unknown as number,
      userReceive: {} as any,
    });

  const handleCloseModalCmt = () => {
    setOpenModalCmt(false);
    setIsShowReplies(null);
  };

  const handleOpenModalCmt = async (post: Post) => {
    setIsComment(true);
    setFormDataComment({
      content: "",
      listImageofComment: null,
      postToPost: "",
    } as CommentToPostDTO);
    setOpenModalCmt(true);
    console.log(post.postId);
    setSelectPost(post.userPost.fullname);

    const getCommentOfPost = await sendRequest<CommentOfPost[]>({
      url: GLOBAL_URL + "/api/comment/" + post.postId,
      method: "GET",
      queryParams: {
        page: 0,
      },
    });
    setComment(getCommentOfPost);
    setFormDataComment((prevData) => ({
      ...prevData,
      postToPost: post?.postId,
      userReceive: post.userPost.userId,
    }));
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
        url: GLOBAL_URL + "/api/like/" + postId,
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
        url: GLOBAL_URL + "/api/unlike/" + postId,
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

  const handleReplyComment = (cmt: CommentOfPost, user: UserPost) => {
    console.log(cmt);

    console.log(user);

    setIsComment(false);
    setFormDataReplyComment((prevData) => {
      return {
        ...prevData,
        commentToPost: cmt,
        userReceive: user,
      };
    });
  };

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
      url: GLOBAL_URL + "/api/comment",
      method: "POST",
      headers: { authorization: `Bearer ${user?.access_token}` },
      body: { ...postData },
    });
    console.log(">>> check post data: ", response);
  };
  const handleChangeContentComment = (value: string) => {
    if (isComment) {
      setFormDataComment((prevFormData) => ({
        ...prevFormData,
        content: value,
      }));
    } else {
      setFormDataReplyComment((prevFormData) => ({
        ...prevFormData,
        content: value,
      }));
    }
  };

  const handleChangePic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target as HTMLInputElement;
    console.log(fileInput.files);
    const selected = fileInput.files;
    if (isComment) {
      setFormDataComment((prevData) => ({
        ...prevData,
        listImageofComment: [
          ...(prevData.listImageofComment || []),
          ...(selected ? Array.from(selected) : []),
        ] as File[],
      }));
    } else {
      setFormDataReplyComment((prevData) => ({
        ...prevData,
        listImageofComment: [
          ...(prevData.listImageofComment || []),
          ...(selected ? Array.from(selected) : []),
        ] as File[],
      }));
    }
  };

  const handleRemoveImage = (index: number, isComment: boolean) => {
    const newSelectedFiles = isComment
      ? [...formDataComment.listImageofComment]
      : [...formDataReplyComment.listImageofComment];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    console.log(newSelectedFiles);

    if (isComment) {
      setFormDataComment((prevData) => ({
        ...prevData,
        listImageofComment: newSelectedFiles,
      }));
    } else {
      setFormDataReplyComment((prevData) => ({
        ...prevData,
        listImageofComment: newSelectedFiles,
      }));
    }
  };

  const handleRemoveImageEditComment = (nameFile: number) => {
    console.log("close: " + nameFile);
    const newSelectedFiles = [...editedImageComment];
    newSelectedFiles.splice(nameFile, 1);
    // const newImageCommentList = Array.from(editedImageComment).filter(
    //   (editedImage) => editedImage !== nameFile
    // );
    setEditedImageComment(newSelectedFiles as any);
    console.log(newSelectedFiles);
  };

  const handleRemoveImageEditCommentReply = (nameFile: number) => {
    console.log("close: " + nameFile);
    const newSelectedFiles = [...editedImageReplyComment];
    newSelectedFiles.splice(nameFile, 1);
    setEditedImageReplyComment(newSelectedFiles as any);
    console.log(newSelectedFiles);
  };

  const handleCancelReplyComment = () => setIsComment(true);

  const handlePostComment = async () => {
    if (isComment) {
      console.log(formDataComment);
      setIsLoadingComment(true);
      const response = await postCommentApi(formDataComment, user);
      console.log(response);
      if (response != false) {
        setComment((preData) => [response, ...preData]);
        setFormDataComment({
          content: "",
          listImageofComment: null,
          postToPost: "",
        } as CommentToPostDTO);
        setIsLoadingComment(false);
      }
      setIsComment(true);
    } else {
      console.log(formDataReplyComment);
      setIsLoadingComment(true);
      const response = await postReplyCommentApi(formDataReplyComment, user);
      console.log(response);
      if (response != false) {
        setFormDataReplyComment(
          (prevData) =>
            ({
              ...prevData,
              content: "",
              listImageofComment: null,
              // userToPost: user?.user?.userId,
              // commentToPost: null as unknown as number,
            } as ReplyCommentToPostDTO)
        );
        setComment((prevComments) => {
          return prevComments.map((comment) => {
            if (comment.id === response.commentID) {
              return {
                ...comment,
                listReplyComment: [
                  ...(comment.listReplyComment || []),
                  response,
                ],
              };
            }
            return comment;
          });
        });

        setIsLoadingComment(false);
        setIsComment(true);
      }
    }

    setIsLoadingComment(false);
  };

  const handleSharePost = async (postId: string, isDataLoading: boolean) => {
    console.log(postId);
    const response: any = await sendRequest({
      url: GLOBAL_URL + "/api/share/" + postId,
      headers: { authorization: `Bearer ${user?.access_token}` },
      method: "POST",
      queryParams: {
        content: contentSharePost,
      },
    });
    console.log(response);
    if (response.statusCode == 400) {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_SHARE_MESSAGE,
        type: "error",
      });
      console.log(dataSnackbar);
    } else {
      if (isDataLoading) {
        console.log(isDataLoading);
        setDataLoading(
          dataLoading.map((post) =>
            post.postId === postId
              ? {
                  ...post,
                  totalShare: post.totalShare + 1,
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
                  totalShare: post.totalShare + 1,
                }
              : post
          )
        );
      }
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_SHARE_MESSAGE,
        type: "success",
      });
      console.log(dataSnackbar);
    }
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
                //handleSharePost(p.postId, false)
                onClick={() =>
                  handleClickOpenAlerts(p, "share", false, -1, false)
                }
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
                  {p.totalLike}
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
                onClick={() => handleSharePost(p.postId, true)}
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
                      <Box key={"comment" + index + c.id}>
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
                          {editingIndexComment != "comment" + index ? (
                            <Box
                              className="block-comment"
                              sx={{ display: "flex" }}
                            >
                              <Box
                                component={"div"}
                                className="content-comment"
                              >
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
                                <Box sx={{ flexFlow: "wrap", display: "flex" }}>
                                  {c?.listImageofComment?.map((item, index) => (
                                    <Grid
                                      item
                                      key={"imageCmt" + index}
                                      xs={4}
                                      md={4}
                                      lg={3}
                                    >
                                      <ImageViewer imageUrl={item} />
                                    </Grid>
                                  ))}
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
                                    onClick={() =>
                                      handleReplyComment(c, c.userID)
                                    }
                                  >
                                    Phản hồi
                                  </Button>
                                </Box>
                              </Box>
                              <Box className="buttons-action">
                                {c.userID.userId == user.user?.userId && (
                                  <div>
                                    <Button
                                      id={`option-button-${index}`}
                                      aria-controls={
                                        openArray[index]
                                          ? `option-menu-${index}`
                                          : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={
                                        openArray[index] ? "true" : undefined
                                      }
                                      onClick={(event) =>
                                        handleOpen3(index, event, true)
                                      }
                                      sx={{ p: "0px", minWidth: "0px" }}
                                    >
                                      <MoreVertIcon />
                                    </Button>
                                    <Menu
                                      id={`option-menu-${index}`}
                                      anchorEl={anchorElArray[index]}
                                      open={openArray[index]}
                                      onClose={() => handleClose3(index, true)}
                                      MenuListProps={{
                                        "aria-labelledby": `option-button-${index}`,
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() =>
                                          handleEditCommentOrReplyComment(
                                            c,
                                            true,
                                            index
                                          )
                                        }
                                      >
                                        Chỉnh sửa
                                      </MenuItem>
                                      <MenuItem
                                        onClick={
                                          () =>
                                            handleClickOpenAlerts(
                                              c,
                                              "deleteCmt",
                                              true,
                                              index,
                                              false
                                            )
                                          // handleDeleteCommentOrReplyComment(
                                          //   c,
                                          //   true,
                                          //   index
                                          // )
                                        }
                                      >
                                        Xóa bình luận
                                      </MenuItem>
                                    </Menu>
                                  </div>
                                )}
                              </Box>
                            </Box>
                          ) : (
                            //keyEditComment
                            <Box
                              className="block-comment"
                              sx={{ display: "flex", width: "100%" }}
                            >
                              {isLoadingEditComment ? (
                                <Box
                                  sx={{
                                    width: "100%",
                                    alignSelf: "center",
                                    padding: "15px",
                                  }}
                                >
                                  <LinearProgress />
                                </Box>
                              ) : (
                                <Box
                                  component={"div"}
                                  className="content-comment"
                                  sx={{ width: "100%" }}
                                >
                                  <Card
                                    sx={{
                                      backgroundColor: "#3A3B3C",
                                      ml: "7px",
                                      color: "white",
                                      display: "flex",
                                      borderRadius: "15px",
                                      width: "100%",
                                    }}
                                  >
                                    <TextField
                                      id=""
                                      hiddenLabel
                                      // label="Viết bình luận ..."
                                      value={editedContentComment}
                                      multiline
                                      rows={3}
                                      onChange={(e) =>
                                        setEditedContentComment(e.target.value)
                                      }
                                      variant="filled"
                                      size="small"
                                      InputProps={{ sx: { color: "white" } }}
                                      sx={{
                                        color: "white !important",
                                        width: "100%",
                                      }}
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
                                        onChange={(event) =>
                                          handleChangePicEditComment(
                                            event,
                                            true
                                          )
                                        }
                                        multiple
                                        name="listImageofComment"
                                      />
                                    </Button>
                                  </Card>
                                  <Box
                                    sx={{
                                      flexFlow: "wrap",
                                      display: "flex",
                                      mt: "8px",
                                    }}
                                  >
                                    {Array.from(editedImageComment)?.map(
                                      (item, index) => (
                                        <Grid
                                          item
                                          key={"imageCmt" + index}
                                          xs={4}
                                          md={4}
                                          lg={3}
                                        >
                                          <ImageViewerEdit
                                            index={index}
                                            handleRemoveImage={
                                              handleRemoveImageEditComment
                                            }
                                            _imageUrl={item}
                                          />
                                        </Grid>
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
                                    <Button
                                      size="small"
                                      sx={{ color: "gray" }}
                                      onClick={() =>
                                        handleCancelEditComment(true, index)
                                      }
                                    >
                                      Hủy
                                    </Button>
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleSaveEditComment(
                                          true,
                                          c,
                                          editedContentComment,
                                          editedImageComment
                                        )
                                      }
                                    >
                                      Lưu
                                    </Button>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          )}
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
                            (rl: ListReplyComment, ir) => (
                              <Box
                                key={ir}
                                className="reply-comment"
                                sx={{ ml: "2rem" }}
                              >
                                <Box
                                  component={"div"}
                                  sx={{ display: "flex" }}
                                  className="box-reply-comment"
                                >
                                  <Avatar
                                    alt=""
                                    src={rl.userID.profilePicUrl}
                                    sx={{ width: 30, height: 30 }}
                                  />
                                  {editingIndexReplyComment !=
                                  "replycomment" + ir ? (
                                    <Box
                                      className="block-comment"
                                      sx={{ display: "flex" }}
                                    >
                                      <Box
                                        component={"div"}
                                        className="content-comment"
                                      >
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
                                              mt: "5px",
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Chip
                                              avatar={
                                                <Avatar
                                                  alt={
                                                    rl.userReceiveDto
                                                      .profilePicUrl
                                                  }
                                                  src={
                                                    rl.userReceiveDto
                                                      .profilePicUrl
                                                  }
                                                  sx={{
                                                    mx: "0px !important",
                                                  }}
                                                />
                                              }
                                              label={
                                                <>
                                                  Trả lời{" "}
                                                  <span
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {rl.userReceiveDto.fullname}
                                                  </span>
                                                </>
                                              }
                                              sx={{
                                                display: "inline-flex",
                                                flexDirection: "row-reverse",
                                                alignItems: "center",
                                                color: "white",
                                                px: "5px",
                                              }}
                                            />
                                            <Typography
                                              variant="body1"
                                              marginLeft={1}
                                            >
                                              {rl.content}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                        <Box
                                          sx={{ display: "flex", mt: "5px" }}
                                        >
                                          {rl.listPictureOfComment?.map(
                                            (item2: any, imgIndex) => (
                                              <Grid
                                                item
                                                key={"imageReplyCmt" + imgIndex}
                                                xs={6}
                                                md={4}
                                                lg={3}
                                              >
                                                <ImageViewer
                                                  imageUrl={
                                                    item2.imageOfCommentUrl
                                                  }
                                                />
                                              </Grid>
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
                                            title={formatDateString(
                                              c.timeComment
                                            )}
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
                                            onClick={() =>
                                              handleReplyComment(c, rl.userID)
                                            }
                                          >
                                            Phản hồi
                                          </Button>
                                        </Box>
                                      </Box>
                                      {rl.userID.userId ==
                                        user.user?.userId && (
                                        <div>
                                          <Button
                                            id={`option-button-reply-${ir}`}
                                            aria-controls={
                                              openArrayReply[ir]
                                                ? `option-menu-reply-${ir}`
                                                : undefined
                                            }
                                            aria-haspopup="true"
                                            aria-expanded={
                                              openArrayReply[ir]
                                                ? "true"
                                                : undefined
                                            }
                                            onClick={(event) =>
                                              handleOpen3(ir, event, false)
                                            }
                                            sx={{ p: "0px", minWidth: "0px" }}
                                          >
                                            <MoreVertIcon />
                                          </Button>
                                          <Menu
                                            id={`option-menu-reply-${ir}`}
                                            anchorEl={anchorElArrayReply[ir]}
                                            open={openArrayReply[ir]}
                                            onClose={() =>
                                              handleClose3(ir, false)
                                            }
                                            MenuListProps={{
                                              "aria-labelledby": `option-button-reply-${ir}`,
                                            }}
                                          >
                                            <MenuItem
                                              onClick={() =>
                                                handleEditCommentOrReplyComment(
                                                  rl,
                                                  false,
                                                  ir
                                                )
                                              }
                                            >
                                              Chỉnh sửa
                                            </MenuItem>
                                            <MenuItem
                                              onClick={() =>
                                                handleClickOpenAlerts(
                                                  rl,
                                                  "deleteCmt",
                                                  false,
                                                  ir,
                                                  false
                                                )
                                                // handleDeleteCommentOrReplyComment(
                                                //   rl,
                                                //   false,
                                                //   ir
                                                // )
                                              }
                                            >
                                              Xóa bình luận
                                            </MenuItem>
                                          </Menu>
                                        </div>
                                      )}
                                    </Box>
                                  ) : (
                                    <Box
                                      className="block-reply-comment"
                                      sx={{ display: "flex", width: "100%" }}
                                    >
                                      {isLoadingEditComment ? (
                                        <Box
                                          sx={{
                                            width: "100%",
                                            alignSelf: "center",
                                            padding: "15px",
                                          }}
                                        >
                                          <LinearProgress />
                                        </Box>
                                      ) : (
                                        <Box
                                          component={"div"}
                                          className="content-reply-comment"
                                          sx={{ width: "100%" }}
                                        >
                                          <Card
                                            sx={{
                                              backgroundColor: "#3A3B3C",
                                              ml: "7px",
                                              color: "white",
                                              display: "flex",
                                              borderRadius: "15px",
                                              width: "100%",
                                            }}
                                          >
                                            <TextField
                                              id=""
                                              hiddenLabel
                                              // label="Viết bình luận ..."
                                              value={editedContentReplyComment}
                                              multiline
                                              rows={3}
                                              onChange={(e) =>
                                                setEditedContentReplyComment(
                                                  e.target.value
                                                )
                                              }
                                              variant="filled"
                                              size="small"
                                              InputProps={{
                                                sx: { color: "white" },
                                              }}
                                              sx={{
                                                color: "white !important",
                                                width: "100%",
                                              }}
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
                                                  backgroundColor:
                                                    "transparent",
                                                  boxShadow: "none",
                                                },
                                                boxShadow: "none",
                                              }}
                                            >
                                              <VisuallyHiddenInput
                                                type="file"
                                                accept=".jpg, .png "
                                                onChange={(event) =>
                                                  handleChangePicEditComment(
                                                    event,
                                                    false
                                                  )
                                                }
                                                multiple
                                                name="listImageofComment"
                                              />
                                            </Button>
                                          </Card>
                                          <Box
                                            sx={{
                                              flexFlow: "wrap",
                                              display: "flex",
                                              mt: "8px",
                                            }}
                                          >
                                            {Array.from(
                                              editedImageReplyComment
                                            )?.map((item: any, index) => (
                                              <Grid
                                                item
                                                key={"imageReplyCmt" + index}
                                                xs={4}
                                                md={4}
                                                lg={3}
                                              >
                                                {!isFile(item) ? (
                                                  <ImageReplyViewerEdit
                                                    index={index}
                                                    handleRemoveImageReply={
                                                      handleRemoveImageEditCommentReply
                                                    }
                                                    _imageUrl={
                                                      item.imageOfCommentUrl
                                                    }
                                                  />
                                                ) : (
                                                  <ImageReplyViewerEdit
                                                    index={index}
                                                    handleRemoveImageReply={
                                                      handleRemoveImageEditCommentReply
                                                    }
                                                    _imageUrl={item}
                                                  />
                                                )}
                                              </Grid>
                                            ))}
                                          </Box>
                                          <Box
                                            sx={{
                                              mx: "15px",
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Button
                                              size="small"
                                              sx={{ color: "gray" }}
                                              onClick={() =>
                                                handleCancelEditComment(
                                                  false,
                                                  index
                                                )
                                              }
                                            >
                                              Hủy
                                            </Button>
                                            <Button
                                              size="small"
                                              onClick={() =>
                                                handleSaveEditComment(
                                                  false,
                                                  rl,
                                                  editedContentReplyComment,
                                                  editedImageReplyComment
                                                )
                                              }
                                            >
                                              Lưu
                                            </Button>
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  )}
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
                  {!isComment && (
                    <Chip
                      avatar={
                        <Avatar
                          alt={formDataReplyComment.userReceive?.profilePicUrl}
                          src={formDataReplyComment.userReceive?.profilePicUrl}
                          sx={{
                            mx: "0px !important",
                          }}
                        />
                      }
                      label={
                        <>
                          Trả lời{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {formDataReplyComment.userReceive.fullname}
                          </span>
                        </>
                      }
                      onDelete={handleCancelReplyComment}
                      sx={{
                        backgroundColor: "gray",
                        px: "5px",
                        mb: "8px",
                        display: "inline-flex",
                        flexDirection: "row-reverse",
                        alignItems: "center",
                        color: "white",
                        "& .MuiChip-label": {
                          paddingX: "5px",
                          color: "black",
                        },
                        "& .MuiChip-deleteIcon": {
                          margin: "0px",
                        },
                      }}
                    />
                  )}
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
                      value={
                        isComment
                          ? formDataComment.content
                          : formDataReplyComment.content
                      }
                      onChange={(e) =>
                        handleChangeContentComment(e.target.value)
                      }
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
                      disabled={
                        (isComment
                          ? !formDataComment.content || isLoadingComment
                          : !formDataReplyComment.content) || isLoadingComment
                      }
                    >
                      {isLoadingComment ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </Box>
                  {isComment
                    ? formDataComment.listImageofComment?.map(
                        (url: File, index: any) => (
                          <PreviewImage
                            key={index}
                            url={url}
                            index={index}
                            isComment={true}
                            handleRemoveImage={handleRemoveImage}
                          />
                        )
                      )
                    : formDataReplyComment.listImageofComment?.map(
                        (url: File, index: any) => (
                          <PreviewImage
                            key={index}
                            url={url}
                            index={index}
                            isComment={false}
                            handleRemoveImage={handleRemoveImage}
                          />
                        )
                      )}
                </Box>
              </Paper>
            </React.Fragment>
          </Box>
        </Fade>
      </Modal>
      <Dialog
        TransitionComponent={Transition}
        open={openAlerts}
        onClose={handleCloseAlerts}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#3e4042",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: "white", textAlign: "center" }}
        >
          {actionDialog.actionType == "deleteCmt"
            ? "Xóa bình luận?"
            : "Chia sẻ bài viết"}
        </DialogTitle>
        <Divider />
        <DialogContent id="alert-dialog-description">
          {actionDialog.actionType == "deleteCmt" ? (
            <Typography sx={{ color: "white" }}>
              Bạn có chắc chắn muốn xóa bình luận này không?
            </Typography>
          ) : (
            <>
              <TextField
                autoFocus
                required
                margin="dense"
                name="content"
                hiddenLabel
                fullWidth
                variant="standard"
                label="Bạn nghĩ gì về bài viết này ?"
                InputLabelProps={{
                  style: {
                    color: "white",
                  },
                }}
                onChange={(e) => setContentSharePost(e.target.value)}
              />
              <Box
                className="block-post-share"
                sx={{
                  border: "1px solid white",
                  borderRadius: "16px",
                  minWidth: "320px",
                  mt: "8px",
                  backgroundColor: "gray",
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
                      src={actionDialog.data?.post?.userPost?.profilePicUrl}
                    ></Avatar>
                  }
                  title={actionDialog.data?.post?.userPost?.fullname}
                  subheader={formatDateString(actionDialog.data?.post?.time)}
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
                    {actionDialog.data?.post?.content}
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
                  {actionDialog.data?.post?.listHashtag?.map((item: any) => (
                    <Link key={item.id} href="/">
                      {item.hashtagDetailName}
                    </Link>
                  ))}
                </Box>
                <Box sx={{ width: "100%" }} className="slider-container">
                  {/* <Slider {...settings}> */}
                  {actionDialog.data?.post?.listImageofPost?.map(
                    (item: any, index: number) => (
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
                          borderRadius: "16px",
                        }}
                      />
                      // </div>
                    )
                  )}
                  {/* </Slider> */}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlerts} sx={{ color: "gray" }}>
            Không
          </Button>
          <Button onClick={handleAgreeAlerts} autoFocus>
            {actionDialog.actionType === "deleteCmt" ? "Xóa" : "Chia sẻ"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={dataSnackbar.openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert variant="filled" severity={dataSnackbar.type}>
          {dataSnackbar.type == "success"
            ? dataSnackbar.contentSnackbar
            : GLOBAL_ERROR_MESSAGE}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Post;

const top100Films = [{ label: "", year: 0 }];
