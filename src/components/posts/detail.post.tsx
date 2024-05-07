"use client";
import { AddPhotoAlternate } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import CommentIcon from "@mui/icons-material/Comment";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { badWords } from "vn-badwords";

import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import {
  Alert,
  AppBar,
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Slide,
  Snackbar,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import {
  ImageReplyViewerEdit,
  ImageViewer,
  ImageViewerEdit,
} from "../utils/component.global";
import postCommentApi, {
  calculateHoursDifference,
  formatDateString,
  isFile,
  isImage,
  postReplyCommentApi,
} from "../utils/utils";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CssBaseline } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  GLOBAL_BG,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BG_NOTIFY,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_DELETE_COMMENT_MESSAGE,
  GLOBAL_DELETE_POST_MESSAGE,
  GLOBAL_ERROR_MESSAGE,
  GLOBAL_NOTIFI,
  GLOBAL_SHARE_MESSAGE,
  GLOBAL_URL,
} from "../utils/veriable.global";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { TransitionProps } from "@mui/material/transitions";
import { red } from "@mui/material/colors";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";

const options = ["Công khai", "Chỉ mình tôi"];
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

interface PreviewImageProps {
  url: File;
  index: number;
  handleRemoveImage: (index: number, isComment: boolean) => void;
  isComment: boolean;
}

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// const socket = new SockJS("http://localhost:8080/wss");
const socket = new SockJS("https://artdevs-server.azurewebsites.net/wss");
const stompClient = Stomp.over(socket);

const DetailPost = ({ session }: { session: User }) => {
  const [openModalCmt, setOpenModalCmt] = useState(false);

  // lấy id
  let searchParams = useSearchParams();
  let postId = searchParams.get("id");
  const router = useRouter();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  //xử lý report
  const [anchorElReport, setAnchorElReport] = useState<null | HTMLElement>(
    null
  );
  const openReport = Boolean(anchorElReport);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElReport(event.currentTarget);
  };
  const handleCloseReport = () => {
    setAnchorElReport(null);
  };

  //xử lý quyền
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const open = Boolean(anchorEl);

  const [actionDialog, setActionDialog] = useState<any>({
    actionType: "",
    data: {},
  });
  const [openAlerts, setOpenAlerts] = useState(false);

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const [selectPost, setSelectPost] = useState<any>();
  const [comment, setComment] = useState<CommentOfPost[]>([]);
  const [editingIndexComment, setEditingIndexComment] = useState<string>("");
  const [openArray, setOpenArray] = useState([]);
  const [openArrayReply, setOpenArrayReply] = useState([]);
  const [anchorElArray, setAnchorElArray] = useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);
  const [anchorElArrayReply, setAnchorElArrayReply] = useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);
  const [isShowReplies, setIsShowReplies] = useState(null);
  const [editedContentComment, setEditedContentComment] = useState("");
  const [editedImageComment, setEditedImageComment] = useState<any>();
  const [editingIndexReplyComment, setEditingIndexReplyComment] =
    useState<string>("");
  const [editedContentReplyComment, setEditedContentReplyComment] =
    useState("");
  const [editedImageReplyComment, setEditedImageReplyComment] = useState<any>();

  const [isComment, setIsComment] = useState<boolean>(false);
  const [contentSharePost, setContentSharePost] = useState<string>("");
  const [dataSnackbar, setDataSnackbar] = useState<any>({
    openSnackbar: false,
    contentSnackbar: "",
    type: "success",
  });
  const [formDataComment, setFormDataComment] =
    React.useState<CommentToPostDTO>({
      content: "",
      listImageofComment: null,
      userToPost: session?.user?.userId,
      postToPost: "",
      userReceive: "",
    });
  const [formDataReplyComment, setFormDataReplyComment] =
    React.useState<ReplyCommentToPostDTO>({
      content: "",
      listImageofComment: null,
      userToPost: session?.user?.userId,
      commentToPost: null as unknown as number,
      userReceive: {} as any,
    });
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    await sendRequest<Post>({
      url: GLOBAL_URL + "/api/update-privacy-post/" + postId,
      method: "PUT",
      queryParams: {
        namePrivacy: options[index],
      },
    });
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchData = async (url: string) => {
    return await sendRequest<Post>({
      url: url,
      method: "GET",
      queryParams: {
        postId: postId,
      },
    });
  };
  const { data, error, isLoading, mutate }: SWRResponse<Post, any> = useSWR(
    GLOBAL_URL + "/api/post-with-id",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  if (
    (!isLoading && !data) ||
    //@ts-ignore
    data?.statusCode ||
    error
  ) {
    return <Box>Không tồn tại bài viết nào !</Box>;
  }

  const handleLike = async (entityId: string, item: Post) => {
    data &&
      mutate(
        {
          ...data,
          isProcessingLike: true,
          likeByUserLogged: true,
          totalLike: data.totalLike + 1,
        },
        false
      );
    try {
      const response = await sendRequest({
        url: GLOBAL_URL + "/api/like/" + entityId,
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
      });
      console.log(response);
      if (response) {
        data &&
          mutate(
            {
              ...data,
              isProcessingLike: false,
              likeByUserLogged: true,
              totalLike: data.totalLike + 1,
            },
            false
          );
        console.log(data);
        if (session?.user?.userId !== item?.userPost?.userId) {
          const notificationToPostDTO: notificationToPostDTO = {
            message: "like",
            receiverId: `${item?.userPost.userId}`,
            senderId: session?.user?.userId,
            postId: item?.postId,
            shareId: "",
            type: "post",
          };
          stompClient.send(
            `${GLOBAL_NOTIFI}/${item?.userPost?.userId}`,
            {},
            JSON.stringify(notificationToPostDTO)
          );
        }
      } else {
        console.log("something wrong");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleUnLike = async (entityId: string) => {
    data &&
      mutate(
        {
          ...data,
          isProcessingLike: true,
          likeByUserLogged: false,
          totalLike: data.totalLike - 1,
        },
        false
      );
    try {
      const response = await sendRequest({
        url: GLOBAL_URL + "/api/unlike/" + entityId,
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
      });
      console.log(response);
      if (response) {
        data &&
          mutate(
            {
              ...data,
              isProcessingLike: false,
              likeByUserLogged: false,
              totalLike: data.totalLike - 1,
            },
            false
          );
        console.log(data);
      } else {
        console.log("something wrong");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleDeleteCommentOrReplyComment = async (
    commentObject: any,
    isComment2: boolean,
    index: number
  ) => {
    handleOpenBackdrop();
    console.log("Delete:", commentObject);
    const url = isComment2
      ? GLOBAL_URL + "/api/comment/" + commentObject.id
      : GLOBAL_URL + "/api/replyComment/" + commentObject.id;

    const response = await sendRequest<boolean>({
      url,
      headers: { authorization: `Bearer ${session?.access_token}` },
      method: "DELETE",
    });

    if (response) {
      handleCloseBackdrop();
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

  const [isLoadingEditComment, setIsLoadingEditComment] = useState(false);

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
    itemS: ResPost | null
  ) => {
    console.log(dataId);

    if (actionType == "deleteCmt") {
      setActionDialog({
        actionType: actionType,
        data: {
          comment: dataId,
          isComment: isComment,
          index: index,
        },
      });
    } else if (actionType == "deletePost") {
      setActionDialog({
        actionType: actionType,
        data: {
          postId: dataId,
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
        },
      });
    }
    console.log(actionDialog);
    setOpenAlerts(true);
  };

  const handleSharePost = async (postId: string) => {
    console.log(postId);
    const response: any = await sendRequest({
      url: GLOBAL_URL + "/api/share/" + postId,
      headers: { authorization: `Bearer ${session?.access_token}` },
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
      data &&
        mutate(
          {
            ...data,
            totalShare: data?.totalShare + 1,
          },
          false
        );
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_SHARE_MESSAGE,
        type: "success",
      });

      if (session?.user?.userId !== response?.postId?.userPost?.userId) {
        const notificationToPostDTO: notificationToPostDTO = {
          message: "share",
          receiverId: response.postId?.userPost?.userId,
          senderId: session?.user?.userId,
          postId: "",
          shareId: response?.id,
          type: "share",
        };
        stompClient.send(
          `${GLOBAL_NOTIFI}/${response?.postId?.userPost?.userId}`,
          {},
          JSON.stringify(notificationToPostDTO)
        );
      }
    }
  };

  const [open2, setOpen2] = React.useState([]);

  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );
  const [postModal, setPostModal] = useState<Post | null>(null);

  const handleDeletePost = async (postId: string | null, ind: number) => {
    console.log(">>> check postID: ", postId);
    let res = await sendRequest<ResPost>({
      url: GLOBAL_URL + `/api/post/${postId}/hidden`,
      method: "PUT",
    });
    if (res?.postId) {
      router.push("/");
      router.refresh();
      // setDataSnackbar({
      //   openSnackbar: true,
      //   contentSnackbar: GLOBAL_DELETE_POST_MESSAGE,
      //   type: "success",
      // });
    }
    // handleCloseReport();
  };
  const handleCloseAlerts = () => {
    setContentSharePost("");
    setOpenAlerts(false);
  };
  const handleAgreeAlerts = () => {
    console.log("agree");
    console.log(contentSharePost);
    if (actionDialog.actionType == "deleteCmt") {
      handleDeleteCommentOrReplyComment(
        actionDialog.data.comment,
        actionDialog.data.isComment,
        actionDialog.data.index
      );
    } else if (actionDialog.actionType == "deletePost") {
      handleDeletePost(actionDialog.data.postId, actionDialog.data.index);
    } else {
      handleSharePost(actionDialog.data.post.postId);
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

  const handleChangeContentComment = (value: string) => {
    if (isComment) {
      setFormDataComment((prevFormData) => ({
        ...prevFormData,
        content: value,
      }));

      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(async () => {
        console.log("Stop typing");
        const content = badWords(value, {
          replacement: "*",
          blackList: (defaultList) => [
            ...defaultList,
            "mẹ mày",
            "cc",
            "nigga",
            "đmm",
            "mm",
            "đmm",
          ],
        });
        console.log(content);
        if (value.trim() != "") {
          setFormDataComment((prevFormData) => ({
            ...prevFormData,
            content: content.toString(),
          }));
        }
      }, 1000);

      setTimer(newTimer);
    } else {
      setFormDataReplyComment((prevFormData) => ({
        ...prevFormData,
        content: value,
      }));

      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(async () => {
        console.log("Stop typing");
        const content = badWords(value, {
          replacement: "*",
          blackList: (defaultList) => [
            ...defaultList,
            "mẹ mày",
            "cc",
            "nigga",
            "đmm",
            "mm",
            "đmm",
          ],
        });
        console.log(content);
        if (value.trim() != "") {
          setFormDataReplyComment((prevFormData) => ({
            ...prevFormData,
            content: content.toString(),
          }));
        }
      }, 1000);

      setTimer(newTimer);
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
    // setSelectedFiles(newSelectedFiles);
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
  const handleCloseModalCmt = () => {
    setOpenModalCmt(false);
    setIsShowReplies(null);
    setEditedContentComment("");
    setEditedContentReplyComment("");
    setFormDataComment({
      content: "",
      listImageofComment: null,
      postToPost: "",
      userToPost: "",
      userReceive: "",
    } as CommentToPostDTO);
  };

  const handleOpenModalCmt = async (post: Post) => {
    setIsComment(true);
    setOpenModalCmt(true);

    //comment
    setFormDataComment({
      content: "",
      listImageofComment: null,
      postToPost: "",
    } as CommentToPostDTO);
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
            headers: { authorization: `Bearer ${session?.access_token}` },
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
            headers: { authorization: `Bearer ${session?.access_token}` },
            body: formData,
          }
        );

        if (response.status == 200) {
          setEditingIndexReplyComment("");
          setEditedContentReplyComment("");
          setEditedImageReplyComment("");
          const data = await response.json();
          console.log(data);
          setComment((prevComments: any) => {
            return prevComments.map((comment: CommentOfPost) => {
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

  const toggleShowReplyCmt = (cmtId: any) => {
    setIsShowReplies((prev) => (prev === cmtId ? null : cmtId));
  };

  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const handlePostComment = async () => {
    if (isComment) {
      console.log(formDataComment);
      setIsLoadingComment(true);
      const response: any = await postCommentApi(formDataComment, session);

      if (response != false) {
        setComment((preData) => [response, ...preData]);
        setFormDataComment(
          (prevData) =>
            ({
              ...prevData,
              content: "",
              listImageofComment: null,
            } as CommentToPostDTO)
        );

        setIsLoadingComment(false);

        if (session?.user?.userId !== formDataComment?.userReceive) {
          const notificationToPostDTO: notificationToPostDTO = {
            message: "comment",
            receiverId: `${formDataComment?.userReceive}`,
            senderId: session?.user?.userId,
            postId: formDataComment?.postToPost,
            shareId: "",
            type: "comment",
          };
          stompClient.send(
            `${GLOBAL_NOTIFI}/${formDataComment?.userReceive}`,
            {},
            JSON.stringify(notificationToPostDTO)
          );
        }
      }
      setIsComment(true);
    } else {
      console.log(formDataReplyComment);
      setIsLoadingComment(true);
      const response = await postReplyCommentApi(formDataReplyComment, session);
      console.log(response);
      if (response != false) {
        setFormDataReplyComment(
          (prevData) =>
            ({
              ...prevData,
              content: "",
              listImageofComment: null,
            } as ReplyCommentToPostDTO)
        );
        setComment((prevComments: any) => {
          return prevComments.map((comment: CommentOfPost) => {
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
        if (
          session?.user?.userId !== formDataReplyComment?.userReceive?.userId
        ) {
          const notificationToPostDTO: notificationToPostDTO = {
            message: "replyComment",
            receiverId: `${formDataReplyComment?.userReceive.userId}`,
            senderId: session?.user?.userId,
            postId: formDataComment?.postToPost,
            shareId: "",
            type: "replyComment",
          };
          stompClient.send(
            `${GLOBAL_NOTIFI}/${formDataReplyComment?.userReceive.userId}`,
            {},
            JSON.stringify(notificationToPostDTO)
          );
        }

        setIsLoadingComment(false);
        setIsComment(true);
      }
    }

    setIsLoadingComment(false);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => router.back()}
          >
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
          <Typography component={"h4"} variant="h4">
            Chi tiết bài viết
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: "24px" }} />
        <Box
          sx={{
            borderRadius: "5px",
            boxShadow: "0px 1px 2px #3335",
            backgroundColor: "#fff",
            marginBottom: "15px",
            "& img": {
              width: "100%",
              cursor: "pointer",
              objectFit: "cover",
            },
            " & a": {
              textDecoration: "none",
              color: "#000",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                padding: "10px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "50%",
                  marginRight: "12px",
                  width: "45px",
                  height: "45px",
                  "& img": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  },
                }}
              >
                <img
                  src={`${
                    data?.userPost?.profilePicUrl
                      ? data?.userPost?.profilePicUrl
                      : "/profile/user.jpg"
                  }`}
                />
              </Box>
              <Box
                sx={{
                  marginLeft: "7px",
                }}
              >
                <Typography
                  component={"h2"}
                  sx={{
                    fontSize: "18px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  {data?.userPost?.fullname}
                </Typography>

                <Box
                  sx={{ color: "#3339", display: "flex", alignItems: "center" }}
                >
                  {session?.user?.userId === data?.userPost?.userId && (
                    <React.Fragment>
                      <List
                        component="nav"
                        aria-label="Device settings"
                        sx={{
                          bgcolor: "background.paper",
                          padding: 0,
                          marginRight: "6px",
                        }}
                      >
                        <ListItemButton
                          id="lock-button"
                          aria-haspopup="listbox"
                          aria-controls="lock-menu"
                          aria-label="when device is locked"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClickListItem}
                          sx={{ padding: 0 }}
                        >
                          <LockIcon sx={{ fontSize: "18px" }} />
                          {options[selectedIndex] ||
                            data?.privacyPostDetails[0]?.namePrivacy}
                        </ListItemButton>
                      </List>
                      <Menu
                        id="lock-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "lock-button",
                          role: "listbox",
                        }}
                      >
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>{" "}
                    </React.Fragment>
                  )}
                  <Typography
                    component={"span"}
                    sx={{ textDecoration: "none" }}
                  >
                    {formatDateString(data?.time)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              className="123123"
              sx={{
                transform: "translate(-50%,-15%) rotate(90deg)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openReport ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openReport ? "true" : undefined}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Menu
                anchorEl={anchorElReport}
                id="account-menu"
                open={openReport}
                onClose={handleCloseReport}
                onClick={handleCloseReport}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px  1px 1px rgba(0,0,0,0.1))",
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
                <MenuItem onClick={handleCloseReport}>
                  Báo cáo bài viết
                </MenuItem>
                {/* <MenuItem onClick={handleCloseReport}>Ẩn bài viết</MenuItem> */}
              </Menu>
            </Box>
          </Box>
          <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
            {data?.content}
          </Box>
          {data && data?.listHashtag.length > 0 && (
            <>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: GLOBAL_COLOR_MENU,
                  fontStyle: "italic",
                  display: "block",
                  marginX: "16px",
                  borderBottom: "1px solid gray",
                  width: "50px",
                  marginBottom: "8px",
                }}
              >
                hashtag
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingX: "16px",
                  flexWrap: "wrap",
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
                {data &&
                  data?.listHashtag?.map((hashtag) => (
                    <Link
                      key={hashtag.id}
                      href={`/hash-tag/${hashtag?.hashtagDetailName}`}
                    >
                      {hashtag?.hashtagDetailName}
                    </Link>
                  ))}
              </Box>
            </>
          )}

          <Box
            sx={{
              backgroundColor: "#fff",
              color: "#fff",
              width: "100%",
              height: "auto",
              boxSizing: "border-box",
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr",
              gridColumnGap: "0",
            }}
          >
            {data &&
              data?.listImageofPost.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    paddingY: "12px",
                    boxShadow: "1px 1px 1px 1px gray",
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    },
                  }}
                >
                  <img src={item.imageUrl} alt="photo" />
                </Box>
              ))}
          </Box>
          <Box sx={{ padding: "10px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "22px",
                    height: "22px",
                    boxSizing: "border-box",
                    borderRadius: "50%",
                    border: "1px solid #fff",
                    display: "flex",
                    backgroundImage:
                      "linear-gradient(to bottom, #11A6FC, #036FE4)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ThumbUpOffAltIcon
                    sx={{
                      color: "white",
                      fontSize: "12px",
                      margin: "auto",
                    }}
                  />
                </Box>
                <Typography component={"p"} sx={{ marginLeft: "6px" }}>
                  {/* {data?.typePost=="share":data?.totalLike:data?.po} */}
                  {data?.totalLike}
                </Typography>
              </Box>

              <Box sx={{ display: "flex" }}>
                <Typography
                  component={"p"}
                  sx={{
                    color: "#3339",
                  }}
                >
                  {data?.totalComment} Bình luận
                </Typography>
                <Typography
                  component={"p"}
                  sx={{
                    color: "#3339",
                    marginLeft: "12px",
                  }}
                >
                  {data?.totalShare} Chia sẻ
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid
            container
            columns={3}
            sx={{
              borderTop: " 1px solid #3333",
            }}
          >
            <Grid
              item
              xs={1}
              sx={{
                padding: "10px 0px",
                fontSize: "14px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.2s linear",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#E4E6E9",
                },
                color: data?.likeByUserLogged ? "#ff0000" : "#57585b",
              }}
            >
              <IconButton
                aria-label="Thích bài viết"
                sx={{
                  width: "100%",
                  borderRadius: "0",
                  color: data?.likeByUserLogged ? "#ff0000" : "#57585b",
                  m: 0,
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
                onClick={() =>
                  data?.likeByUserLogged
                    ? handleUnLike(data?.postId)
                    : data && handleLike(data?.postId, data)
                }
                disabled={data?.isProcessingLike}
              >
                {data?.isProcessingLike ? (
                  <CircularProgress size={24} color="secondary" />
                ) : (
                  <>
                    <ThumbUpOffAltIcon />
                    <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                      Thích
                    </Typography>
                  </>
                )}
              </IconButton>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                padding: "10px 0px",
                fontSize: "14px",
                textAlign: "center",
                color: "#707070",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.2s linear",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#E4E6E9",
                },
              }}
              onClick={() => data && handleOpenModalCmt(data)}
            >
              <CommentIcon />
              <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                Bình luận
              </Typography>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                padding: "10px 0px",
                fontSize: "14px",
                textAlign: "center",
                color: "#707070",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.2s linear",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#E4E6E9",
                },
              }}
              onClick={() =>
                handleClickOpenAlerts(data, "share", false, -1, null)
              }
            >
              <ShareIcon />
              <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                Chia sẻ
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
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
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 700,
              bgcolor: GLOBAL_BG,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: 24,
              "@media (max-width: 768px)": {
                width: "90%",
              },
              "@media (max-width: 480px)": {
                width: "80%",
              },
              "@media (max-width: 320px)": {
                width: "90%",
              },
            }}
          >
            <React.Fragment>
              <AppBar
                sx={{
                  backgroundColor: GLOBAL_BG,
                  color: GLOBAL_COLOR_BLACK,
                  padding: "0px !important",
                }}
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
                    aria-controls={openModalCmt ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openModalCmt ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "gray",
                        border: "1px solid gray",
                      }}
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
                  backgroundColor: GLOBAL_BG,
                }}
              >
                <Box sx={{ my: 2, color: GLOBAL_COLOR_BLACK }}>
                  {comment.length == 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItem: "center",
                        flexDirection: "column",
                        p: 2,
                      }}
                    >
                      <CommentsDisabledIcon
                        sx={{
                          mx: "auto",
                          fontSize: "5rem",
                          color: "gray",
                        }}
                      />
                      <Typography
                        variant="body1"
                        color="gray"
                        fontWeight={"bold"}
                        mx={"auto"}
                      >
                        Bài viết chưa có bình luận
                      </Typography>
                    </Box>
                  )}
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
                                    backgroundColor: GLOBAL_BG_NOTIFY,
                                    ml: "7px",
                                    color: GLOBAL_COLOR_BLACK,
                                    display: "inline-block ",
                                    borderRadius: "15px",
                                    padding: "0 12px",
                                  }}
                                >
                                  <Link
                                    href={`/profile?userId=${c.userID}`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    <Typography
                                      sx={{
                                        paddingY: "7px",
                                        color: GLOBAL_COLOR_MENU,
                                        fontWeight: "700",
                                        mb: "0px",
                                        paddingBottom: "0px",
                                      }}
                                    >
                                      {c.userID.fullname}
                                    </Typography>
                                  </Link>
                                  <CardContent
                                    sx={{
                                      paddingBottom: "7px !important",
                                      padding: "0px ",
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
                                {c.userID.userId == session?.user?.userId && (
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
                                              null
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
                                      backgroundColor: GLOBAL_BG_NOTIFY,
                                      ml: "7px",
                                      color: GLOBAL_COLOR_BLACK,
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
                                      InputProps={{
                                        sx: { color: GLOBAL_COLOR_BLACK },
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
                                        color: GLOBAL_COLOR_BLACK,
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
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <Button
                                      color="error"
                                      variant="outlined"
                                      size="small"
                                      onClick={() =>
                                        handleCancelEditComment(true, index)
                                      }
                                      sx={{ marginRight: "6px" }}
                                    >
                                      Hủy
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
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
                                    src={rl.userAction.profilePicUrl}
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
                                            backgroundColor: GLOBAL_BG_NOTIFY,
                                            ml: "7px",
                                            color: GLOBAL_COLOR_BLACK,
                                            display: "inline-block ",
                                            borderRadius: "15px",
                                          }}
                                        >
                                          <Link
                                            href={`/profile?userId=${rl.userAction.userId}`}
                                            style={{ textDecoration: "none" }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "16px",
                                                padding: "8px 16px",
                                                color: GLOBAL_COLOR_MENU,
                                                paddingBottom: "0px",
                                                fontWeight: 700,
                                              }}
                                            >
                                              {rl.userAction.fullname}
                                            </Typography>
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
                                                color: GLOBAL_COLOR_BLACK,
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
                                                <ImageViewer imageUrl={item2} />
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
                                              handleReplyComment(
                                                c,
                                                rl.userAction
                                              )
                                            }
                                          >
                                            Phản hồi
                                          </Button>
                                        </Box>
                                      </Box>
                                      {rl.userAction.userId ==
                                        session?.user?.userId && (
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
                                              onClick={
                                                () =>
                                                  handleClickOpenAlerts(
                                                    rl,
                                                    "deleteCmt",
                                                    false,
                                                    ir,
                                                    null
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
                                              backgroundColor: GLOBAL_BG_NOTIFY,
                                              ml: "7px",
                                              color: GLOBAL_COLOR_BLACK,
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
                                                sx: {
                                                  color: GLOBAL_COLOR_BLACK,
                                                },
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
                                                color: GLOBAL_COLOR_BLACK,
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
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: GLOBAL_BG,
                  padding: "16px",
                  display: "flex",
                }}
              >
                <Avatar
                  sx={{
                    // bgcolor: red[500],
                    color: "#000000",
                    marginRight: "12px",
                  }}
                  aria-label="recipe"
                  alt="Profile Picture"
                  src={
                    session?.user?.profileImageUrl
                      ? session?.user?.profileImageUrl
                      : "/profile/user.jpg"
                  }
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
                        backgroundColor: GLOBAL_BG_NOTIFY,
                        px: "5px",
                        mb: "8px",
                        display: "inline-flex",
                        flexDirection: "row-reverse",
                        alignItems: "center",
                        color: GLOBAL_COLOR_BLACK,
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
                      fullWidth
                      sx={{
                        backgroundColor: GLOBAL_BG,
                        borderRadius: "7px",
                        color: GLOBAL_COLOR_BLACK,
                        "& label.Mui-focused": { color: GLOBAL_COLOR_BLACK },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: GLOBAL_BG_BLUE_900 },
                          "&:hover fieldset": {
                            borderColor: GLOBAL_BG_BLUE_900,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: GLOBAL_BG_BLUE_900,
                          },
                        },
                        "& label": { color: GLOBAL_COLOR_BLACK },
                      }}
                      InputProps={{ sx: { color: GLOBAL_COLOR_BLACK } }}
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
                        // p: "0px",
                        backgroundColor: "transparent",
                        color: GLOBAL_COLOR_BLACK,
                        "&:hover": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                        boxShadow: "none",
                        height: "100%",
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
                        // marginLeft: "8px",
                        // backgroundColor: "#30363d",
                        "&:hover": { backgroundColor: "#c1c1c1" },
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
            backgroundColor: GLOBAL_BG_NOTIFY,
          },
        }}
        sx={{
          "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: GLOBAL_COLOR_BLACK, textAlign: "center" }}
        >
          {actionDialog.actionType == "deleteCmt"
            ? "Xóa bình luận?"
            : actionDialog.actionType == "deletePost"
            ? "Xóa bài viết"
            : "Chia sẻ bài viết"}
        </DialogTitle>
        <Divider />
        <DialogContent id="alert-dialog-description">
          {actionDialog.actionType == "deleteCmt" ? (
            <Typography sx={{ color: GLOBAL_COLOR_BLACK }}>
              Bạn có chắc chắn muốn xóa bình luận này không?
            </Typography>
          ) : actionDialog.actionType == "deletePost" ? (
            <Typography sx={{ color: GLOBAL_COLOR_BLACK }}>
              Bạn có chắc chắn muốn xóa bài viết này không?
            </Typography>
          ) : (
            <>
              <Box
                className="block-post-share"
                sx={{
                  border: "1px solid white",
                  borderRadius: "16px",
                  minWidth: "320px",
                  mt: "8px",
                  backgroundColor: "#fff",
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
                <Typography
                  sx={{
                    borderBottom: "1px solid gray",
                    width: "60px",
                    margin: "0 16px 6px 16px",
                    fontStyle: "italic",
                  }}
                >
                  hashtag
                </Typography>
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
                <Box
                  sx={{
                    width: "100%",
                    "& .swiper-wrapper": {
                      alignItems: "center",
                    },
                  }}
                  className="slider-container"
                >
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    freeMode={true}
                    pagination={{
                      type: "fraction",
                      clickable: true,
                    }}
                    modules={[FreeMode, Pagination]}
                    className="mySwiper"
                    loop={true}
                  >
                    {actionDialog.data?.post?.listImageofPost?.map(
                      (item: any, index: number) => (
                        <SwiperSlide key={item.id}>
                          <CardMedia
                            loading="lazy"
                            key={index + item.id}
                            component={
                              isImage(item.imageUrl) === "image"
                                ? "img"
                                : isImage(item.imageUrl) === "video"
                                ? "video"
                                : "div"
                            }
                            controls={isImage(item.imageUrl) === "video"}
                            image={item?.imageUrl}
                            alt={item?.postID}
                            sx={{
                              objectFit: "cover",
                              maxWidth: "100%",
                              width: `100%`,
                              borderRadius: "16px",
                              maxHeight: "500px",
                            }}
                          />
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                </Box>
              </Box>
              <TextField
                autoFocus
                margin="dense"
                name="content"
                hiddenLabel
                fullWidth
                variant="standard"
                label="Nhập nội dung chia sẻ ?"
                InputLabelProps={{
                  style: {
                    color: GLOBAL_COLOR_BLACK,
                  },
                }}
                value={contentSharePost}
                onChange={(e) => {
                  setContentSharePost(e.target.value);

                  if (timer) {
                    clearTimeout(timer);
                  }

                  const newTimer = setTimeout(async () => {
                    console.log("Stop typing");
                    const content = badWords(e.target.value, {
                      replacement: "*",
                      blackList: (defaultList) => [
                        ...defaultList,
                        "mẹ mày",
                        "cc",
                        "nigga",
                        "đmm",
                        "mm",
                        "đmm",
                      ],
                    });
                    console.log(content);
                    if (e.target.value.trim() != "") {
                      setContentSharePost(content.toString());
                    }
                  }, 1000);

                  setTimer(newTimer);
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color={`${
              actionDialog.actionType == "deleteCmt" ||
              actionDialog.actionType == "deletePost"
                ? "primary"
                : "error"
            }`}
            variant="outlined"
            onClick={handleCloseAlerts}
          >
            Không
          </Button>
          <Button
            color={`${
              actionDialog.actionType == "deleteCmt" ||
              actionDialog.actionType == "deletePost" ||
              actionDialog.actionType == "deletePostShare"
                ? "error"
                : "primary"
            }`}
            variant="contained"
            onClick={handleAgreeAlerts}
            autoFocus
            sx={{ minWidth: "80px" }}
          >
            {actionDialog.actionType == "deleteCmt" ||
            actionDialog.actionType == "deletePost" ||
            actionDialog.actionType == "deletePostShare"
              ? "Xóa"
              : actionDialog.actionType == "updateShare"
              ? "Lưu"
              : "Chia sẻ"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={dataSnackbar.openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        {dataSnackbar.openSnackbar && (
          <Alert variant="filled" severity={dataSnackbar.type}>
            {dataSnackbar.type == "success"
              ? dataSnackbar.contentSnackbar
              : GLOBAL_ERROR_MESSAGE}
          </Alert>
        )}
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: 999999 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default DetailPost;
