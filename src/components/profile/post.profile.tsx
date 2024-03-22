"use client";
import { AddPhotoAlternate } from "@mui/icons-material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import {
  Alert,
  AppBar,
  Autocomplete,
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
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  ListItemIcon,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
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
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { red } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import {
  CubeSpan,
  ImageReplyViewerEdit,
  ImageViewer,
  ImageViewerEdit,
} from "../utils/component.global";
import postCommentApi, {
  calculateHoursDifference,
  formatDateString,
  generateUniqueId,
  isFile,
  isImage,
  postReplyCommentApi,
} from "../utils/utils";
import {
  GLOBAL_DELETE_COMMENT_MESSAGE,
  GLOBAL_ERROR_MESSAGE,
  GLOBAL_NOTIFI,
  GLOBAL_SHARE_MESSAGE,
  GLOBAL_UPLOAD_POST_MESSAGE,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const options = ["Chỉ mình tôi", "Công khai", "Bạn bè"];

const FadeInImage = styled("img")({
  animation: "fadeIn 0.5s ease-in-out",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});
interface PreviewImageOfPostProps {
  url: File;
  index: number;
  handleRemoveImageOfPost: (index: number) => void;
}

const PreviewImageOfPost: React.FC<PreviewImageOfPostProps> = ({
  url,
  index,
  handleRemoveImageOfPost,
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
        width="100%"
        height="100%"
        loading="lazy"
      />

      <RemoveButton onClick={() => handleRemoveImageOfPost(index)}>
        <ClearIcon />
      </RemoveButton>
    </Box>
  );
};

interface PreviewImageProps {
  url: File;
  index: number;
  handleRemoveImage: (index: number, isComment: boolean) => void;
  isComment: boolean;
}

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

const ariaLabel = { "aria-label": "description" };

interface IPros {
  session: User;
  hashTagText?: string;
  profile?: string;
}

const PostProfile = ({ session, hashTagText, profile }: IPros) => {
  //tạo biến xử lý modal report
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );

  let url = profile
    ? profile
    : hashTagText
    ? `/${hashTagText ? `detailhashtag/${hashTagText}` : "post-by-user-logged"}`
    : "/news-feed";

  //get data bài đăng
  const fetchData = async (url: string) => {
    return await sendRequest<ResPost[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: { page: 0 },
    });
  };

  const { data, error, isLoading, mutate }: SWRResponse<ResPost[], any> =
    useSWR(GLOBAL_URL + "/api" + url, fetchData, {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    });

  //xử lý thao tác xóa modal report
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
    postModal: ResPost | null
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(id);
    setPostModal(postModal);
  };
  const handleCloses = () => {
    setAnchorEl(null);
    setPostModal(null);
    setSelectedItemId(null);
  };
  const handleDeletePost = async (postId: string | null) => {
    console.log(">>> check postID: ", postId);
    let res = await sendRequest<ResPost>({
      url: GLOBAL_URL + `/api/post/${postId}/hidden`,
      method: "PUT",
    });
    if (res?.postId) {
      const previousData = data!;
      const index = previousData.findIndex(
        (item) => item?.postId?.postId === postId
      );

      if (index !== -1) {
        previousData && previousData.splice(index, 1);
        mutate(previousData, false);
      }
    }
    handleCloses();
  };

  //tạo biến xử lý modal privacy
  const [anchorEls, setAnchorEls] = React.useState<Array<null | HTMLElement>>(
    Array(options.length).fill(null)
  );
  const [selectedIndexes, setSelectedIndexes] = React.useState<Array<number>>(
    Array(options.length).fill(-1)
  );

  //hàm xử lý modal privacy
  const handleClickListItem =
    (index: number) => async (event: React.MouseEvent<HTMLElement>) => {
      const newAnchorEls = [...anchorEls];
      newAnchorEls[index] = event.currentTarget;

      setAnchorEls(newAnchorEls);
    };
  const handleMenuItemClick =
    (index: number, optionIndex: number, postId: string) => async () => {
      const newSelectedIndexes = [...selectedIndexes];
      newSelectedIndexes[index] = optionIndex;
      setSelectedIndexes(newSelectedIndexes);
      console.log(">>> check options[index]: ", options[optionIndex]);
      await sendRequest<Post>({
        url: GLOBAL_URL + "/api/update-privacy-post/" + postId,
        method: "PUT",
        queryParams: {
          namePrivacy: options[optionIndex],
        },
      });
      setAnchorEls(Array(options.length).fill(null));
    };
  const handleClose = () => () => {
    // const newAnchorEls = [...anchorEls];
    // newAnchorEls[index] = null;
    // setAnchorEls(newAnchorEls);
    setAnchorEl(null);
    setSelectedItemId(null);
    setPostModal(null);
  };

  //copy post.main
  // const { user, setUser } = useUser();
  const fetchImageAsFile = async (imageUrl: string): Promise<File | null> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], imageUrl, { type: "image/png" });
      return file;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const [openAlerts, setOpenAlerts] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [searchValueHashtag, setSearchValueHashtag] = useState("");
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [hashtagData, setHashtagData] = useState<HashtagInfor[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [postModal, setPostModal] = useState<ResPost | null>(null);
  const [postData, setPostData] = useState<AddPost>({
    postId: "",
    content: "",
    time: new Date(),
    timelineUserId: new Date(),
    userId: session ? session?.user?.userId : "",
    listImageofPost: null,
    privacyPostDetails: 1,
    listHashtag: [],
  });
  const handleOpenPost = () => {
    setPostData({
      postId: "",
      content: "",
      time: new Date(),
      timelineUserId: new Date(),
      userId: session ? session?.user?.userId : "",
      listImageofPost: null,
      privacyPostDetails: 1,
      listHashtag: [],
    });
    setIsEditPost(false);
    setOpenPost(true);
  };
  const handleEditPost = async (post: ResPost) => {
    setHashtagData([]);
    setSearchValueHashtag("");
    setIsEditPost(true);
    handleClose();
    console.log(post);
    setOpenPost(true);
    const selectedPrivacy = post?.postId?.privacyPostDetails.find(
      (privacy) => privacy?.status == true
    );
    console.log(post?.postId?.listImageofPost);
    const editedPostData: AddPost = {
      postId: post?.postId?.postId,
      content: post?.postId?.content,
      time: new Date(),
      timelineUserId: new Date(),
      userId: post?.postId?.userPost?.userId,
      listImageofPost: (await Promise.all(
        post?.postId?.listImageofPost?.map(async (image) => {
          const file = await fetchImageAsFile(image.imageUrl);
          return file;
        })
      )) as File[],
      privacyPostDetails: selectedPrivacy?.privacyPostId as number,
      listHashtag: post?.postId?.listHashtag.map(
        (hashtag) => hashtag.hashtagDetailName
      ),
    };
    console.log(">>> check editedPostData: ", selectedPrivacy);
    setPostData(editedPostData);
  };
  const handleClosePost = () => setOpenPost(false);
  const [dataLoading, setDataLoading] = useState<ResPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endPost, setEndPost] = useState<boolean>(false);
  const [endTextPost, setEndTextPost] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<ResPost[]>([]);
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

  const handleChangePrivacyPost = async (event: SelectChangeEvent) => {
    console.log();

    setPostData((prevData) => ({
      ...prevData,
      privacyPostDetails: event.target.value as unknown as number,
    }));
    console.log(await postData);
  };

  const handleContentPost = (value: string) => {
    setPostData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };
  const formatHashtagText = (hashtagText: any) => {
    if (hashtagText && typeof hashtagText === "string") {
      return hashtagText.trim().replace(/\s/g, "-");
    } else {
      return hashtagText.hashtagText;
    }
  };
  const handleHashtagPost = (
    event: React.ChangeEvent<{}>,
    newValue: string[] | null
  ) => {
    const formattedValues = newValue
      ? newValue.map((tag) => formatHashtagText(tag))
      : [];
    console.log(formattedValues);

    setPostData((prevData) => ({
      ...prevData,
      listHashtag: formattedValues,
    }));
  };
  const handleTextFieldChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    console.log(value);
    if (value == " ") {
      setHashtagData([]);
      setSearchValueHashtag("");
    }
    const formattedValue = value.replace(/\s/g, "-");
    event.target.value = formattedValue;
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(async () => {
      console.log("Stop typing");
      if (value != " ") {
        setSearchValueHashtag(event.target.value);
      }
    }, 1500);

    setTimer(newTimer);
  };
  const handleChangePicturePost = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const selected = fileInput.files;
    console.log(selected);
    setPostData((prevData) => ({
      ...prevData,
      listImageofPost: [
        ...(prevData.listImageofPost || []),
        ...(selected ? Array.from(selected) : []),
      ] as File[],
    }));
  };
  const handleSaveEditPost = async () => {
    console.log(postData);
    const formData = new FormData();
    formData.append(
      "postDTO",
      new Blob(
        [
          JSON.stringify({
            postId: postData.postId,
            content: postData.content,
            listHashtag: postData.listHashtag,
            timelineUserId: postData.timelineUserId,
            time: postData.time,
            privacyPostDetails: postData.privacyPostDetails,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (postData.listImageofPost) {
      postData.listImageofPost.forEach((file: any, index: any) => {
        formData.append("listImageofPost", file);
      });
    } else {
      formData.append("listImageofPost", "");
    }
    const response = await fetch(
      GLOBAL_URL + "/api/update-post/" + postData.postId,
      {
        method: "PUT",
        headers: { authorization: `Bearer ${session?.access_token}` },
        body: formData,
      }
    );
    console.log(">>> check post update: ", response.status);
    if (response.status == 200) {
      const data: ResPost = await response.json();
      console.log(data);

      setPosts((prev) =>
        prev.map((p) =>
          p?.postId?.postId === data?.postId?.postId ? { ...p, ...data } : p
        )
      );
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
    }
  };
  const handlePost = async () => {
    setOpenBackdrop(true);
    setPostData((prevData) => ({
      ...prevData,
      postId: generateUniqueId(),
    }));
    console.log(">>> check postid: ", postData.postId);
    const formData = new FormData();
    formData.append(
      "postDTO",
      new Blob(
        [
          JSON.stringify({
            content: postData.content,
            listHashtag: postData.listHashtag,
            timelineUserId: postData.timelineUserId,
            time: postData.time,
            privacyPostDetails: postData.privacyPostDetails,
            postId: postData.postId,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (postData.listImageofPost) {
      postData.listImageofPost.forEach((file: any, index: any) => {
        formData.append("listImageofPost", file);
      });
    } else {
      formData.append("listImageofPost", "");
    }
    const response = await fetch(GLOBAL_URL + "/api/post", {
      method: "POST",
      headers: { authorization: `Bearer ${session?.access_token}` },
      body: formData,
    });
    console.log(">>> check post data: ", response.status);
    if (response.status == 200) {
      const data = await response.json();
      console.log(data);
      setPosts((prevData) => [data, ...prevData]);
      setOpenPost(false);
      setOpenBackdrop(false);
      setPostData({
        postId: "",
        content: "",
        time: new Date(),
        timelineUserId: new Date(),
        userId: session ? session?.user?.userId : "",
        listImageofPost: null,
        privacyPostDetails: 1,
        listHashtag: [],
      });
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_UPLOAD_POST_MESSAGE,
        type: "success",
      });
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
    }
  };
  const handleRemoveImageOfPost = (index: number) => {
    const newSelectedFiles = [...(postData.listImageofPost as File[])];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    console.log(newSelectedFiles);
    setPostData((prevData) => ({
      ...prevData,
      listImageofPost: newSelectedFiles,
    }));
  };

  // ham copy post.main
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
      headers: { authorization: `Bearer ${session?.access_token}` },
      method: "DELETE",
    });

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
  const toggleShowReplyCmt = (cmtId: any) => {
    setIsShowReplies((prev) => (prev === cmtId ? null : cmtId));
  };

  // const { data, error, isLoading }: SWRResponse<Post[], any> = useSWR(
  //   GLOBAL_URL+"/api/news-feed",
  //   fetchData,
  //   {
  //     shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
  //     revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
  //   }
  // );

  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(socket);

  useEffect(() => {
    const fetchDataHashtag = async () => {
      console.log("Fetching data for:", searchValueHashtag);
      try {
        const getHashtag = await sendRequest<HashtagInfor[]>({
          url: GLOBAL_URL + "/api/search-detailhashtag",
          method: "GET",
          queryParams: {
            keyword: searchValueHashtag,
          },
        });
        console.log(getHashtag);

        setHashtagData(getHashtag);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (searchValueHashtag) {
      fetchDataHashtag();
    }

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
          const newData = await sendRequest<ResPost[]>({
            url: GLOBAL_URL + "/api/friend-posts",
            method: "GET",
            headers: { authorization: `Bearer ${session?.access_token}` },
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
  }, [loading, data, dataLoading, searchValueHashtag]);

  const handleLike = async (
    postId: string,
    post: ResPost,
    isDataLoading: boolean
  ) => {
    await setPosts(
      posts.map((resPost) => {
        if (resPost?.postId?.postId === postId) {
          return {
            ...resPost,
            postId: {
              ...resPost.postId,
              likeByUserLogged: true,
              totalLike: resPost.postId.totalLike + 1,
              isProcessingLike: true,
            },
          };
        }
        return resPost;
      })
    );
    try {
      const response = await sendRequest({
        url: GLOBAL_URL + "/api/like/" + postId,
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
      });
      console.log(response);
      if (response) {
        setPosts(
          posts.map((resPost) =>
            resPost?.postId?.postId === postId
              ? {
                  ...resPost,
                  postId: {
                    ...resPost.postId,
                    likeByUserLogged: true,
                    totalLike: resPost.postId.totalLike + 1,
                    isProcessingLike: false,
                  },
                }
              : resPost
          )
        );
        console.log(data);
        if (session?.user?.userId !== post?.postId?.userPost?.userId) {
          const notificationToPostDTO: notificationToPostDTO = {
            message: "like",
            receiverId: `${post?.postId?.userPost.userId}`,
            senderId: session?.user?.userId,
            postId: post?.postId?.postId,
            shareId: "",
            type: "post",
          };
          stompClient.send(
            `${GLOBAL_NOTIFI}/${post?.postId?.userPost?.userId}`,
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

  const handleUnlike = async (postId: string, isDataLoading: boolean) => {
    console.log("unlike: " + postId);

    setPosts(
      posts.map((resPost) =>
        resPost?.postId?.postId === postId
          ? {
              ...resPost,
              postId: {
                ...resPost.postId,
                likeByUserLogged: false,
                totalLike: resPost.postId.totalLike - 1,
                isProcessingLike: true,
              },
            }
          : resPost
      )
    );

    try {
      const response = await sendRequest<Post[]>({
        url: GLOBAL_URL + "/api/unlike/" + postId,
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
      });

      console.log(response);
      if (response) {
        // Kết thúc xử lý API cho bài viết này

        setPosts(
          posts.map((resPost) =>
            resPost?.postId?.postId === postId
              ? {
                  ...resPost,
                  postId: {
                    ...resPost.postId,
                    likeByUserLogged: false,
                    totalLike: resPost.postId.totalLike - 1,
                    isProcessingLike: false,
                  },
                }
              : resPost
          )
        );

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
      console.log( formDataComment);
      setIsLoadingComment(true);
      const response = await postCommentApi(formDataComment, session);

      if (response != false) {
        setComment((preData) => [response, ...preData]);
        setFormDataComment({
          content: "",
          listImageofComment: null,
          postToPost: "",
        } as CommentToPostDTO);
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
        if (
          session?.user?.userId !== formDataReplyComment?.userReceive?.userId
        ) {
          const notificationToPostDTO: notificationToPostDTO = {
            message: "replyComment",
            receiverId: `${formDataComment?.userReceive}`,
            senderId: session?.user?.userId,
            postId: formDataComment?.postToPost,
            shareId: "",
            type: "replyComment",
          };
          stompClient.send(
            `${GLOBAL_NOTIFI}/${formDataComment?.userReceive}`,
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
  const handleSharePost = async (postId: string, isDataLoading: boolean) => {
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
      if (isDataLoading) {
        console.log(isDataLoading);
        setDataLoading(
          dataLoading.map((resPost) =>
            resPost?.postId?.postId === postId
              ? {
                  ...resPost,
                  totalShare: resPost?.postId?.totalShare + 1,
                }
              : resPost
          )
        );
      } else {
        setPosts(
          posts.map((resPost) =>
            resPost?.postId?.postId === postId
              ? {
                  ...resPost,
                  totalShare: resPost?.postId?.totalShare + 1,
                }
              : resPost
          )
        );
      }
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_SHARE_MESSAGE,
        type: "success",
      });

      if (session?.user?.userId !== response?.postId?.userPost?.userId) {
        const notificationToPostDTO: notificationToPostDTO = {
          message: "share",
          receiverId: response.userPostDto.userId,
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "100px",
          height: "86vh",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="cube-loader">
            <div className="cube-top"></div>
            <div className="cube-wrapper">
              {[0, 1, 2, 3].map((index) => (
                <CubeSpan key={index} index={index} />
              ))}
            </div>
          </div>
        </Box>
      </Box>
    );
  }
  return (
    <>
      <Box
        sx={{
          borderRadius: "5px",
          boxShadow: "0px 1px 2px #3335",
          backgroundColor: "#fff",
          padding: "10px",
          marginBottom: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #3333",
            paddingBottom: "10px",
          }}
        >
          <Box
            sx={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              marginRight: "6px",
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
                session?.user?.profileImageUrl
                  ? session?.user?.profileImageUrl
                  : "/profile/user.jpg"
              }`}
            />
          </Box>
          <Box
            onClick={handleOpenPost}
            sx={{
              position: "relative",
              width: "100%",
              padding: "7px 10px",
              boxSizing: "border-box",
              borderRadius: "25px",
              backgroundColor: "#E4E6EB",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#D8DADF",
              },
            }}
          >
            <Typography
              component={"span"}
              sx={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "15px",
                color: "#333",
              }}
            >
              Bạn đang nghĩ gì ?
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            padding: "10px 0px 0px 0px",
          }}
        >
          <Box
            sx={{
              width: "50%",
              maxWidth: "160px",
              padding: "5px",
              boxSizing: "border-box",
              backgroundColor: "#fff",
              borderRadius: "20px",
              marginRight: "8px",
              filter: "drop-shadow(0 0 0.1rem crimson)",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#E4E6EB",
              },
            }}
          >
            <Typography
              component={"p"}
              sx={{
                padding: "5px 0px",
                textAlign: "center",
                fontSize: "14px",
                color: "#333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VideoFileIcon sx={{ color: "#E42645" }} />
              <Typography component={"span"} sx={{ marginLeft: "6px" }}>
                Video
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              width: "50%",
              padding: "5px",
              maxWidth: "160px",
              boxSizing: "border-box",
              backgroundColor: "#fff",
              borderRadius: "20px",
              filter: "drop-shadow(0 0 0.1rem green)",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#E4E6EB",
              },
            }}
          >
            <Typography
              component={"p"}
              sx={{
                padding: "5px 0px",
                textAlign: "center",
                fontSize: "14px",
                color: "#333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddAPhotoIcon sx={{ color: "#41B35D" }} />
              <Typography component={"span"} sx={{ marginLeft: "6px" }}>
                Photo
              </Typography>
            </Typography>
          </Box>
        </Box>
        <Dialog
          open={openPost}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClosePost}
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              backgroundColor: "#242526",
              width: "100%",
            },
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              console.log(formJson);
              handleClosePost();
            },
          }}
        >
          <Box className="dialog-header">
            <DialogTitle
              id="alert-dialog-title"
              sx={{ color: "white", textAlign: "center", p: "10px" }}
            >
              Tạo bài viết
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClosePost}
              sx={{
                position: "absolute",
                right: 8,
                top: 5,
                color: (theme) => theme.palette.grey[500],
                backgroundColor: "#3a3b3c",
                "&:hover": {
                  backgroundColor: "#7d7d7d",
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
          <Divider />
          <DialogContent sx={{ p: "8px" }}>
            <Card
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                color: "white",
                border: "none",
                width: "100%",
              }}
            >
              <CardHeader
                sx={{
                  color: "#000000",
                  py: "5px",
                }}
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                    alt={session?.user?.lastName}
                    src={session?.user?.profileImageUrl}
                  ></Avatar>
                }
                title={
                  <>
                    <Typography fontSize={16} color={"white"}>
                      {session?.user?.firstName +
                        " " +
                        session?.user?.middleName +
                        " " +
                        session?.user?.lastName}
                    </Typography>
                  </>
                }
                action={
                  <>
                    <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
                      <Select
                        id="demo-simple-select-autowidth"
                        value={postData.privacyPostDetails + ""}
                        onChange={handleChangePrivacyPost}
                        autoWidth
                        sx={{
                          color: "white",
                          "&.MuiSelect-root": {
                            backgroundColor: "#3a3b3c",
                            border: "1px solid white",
                          },
                          "& fieldset": {
                            border: "1px solid white",
                          },
                          "& fieldset:focus": {
                            border: "1px solid white",
                          },
                          "& svg": {
                            color: " white",
                          },
                        }}
                      >
                        <MenuItem value={1}>Công khai</MenuItem>
                        <MenuItem value={2}>Riêng tư</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                }
              />

              <CardContent
                sx={{
                  color: "white",
                  py: "5px",
                }}
                className="contentPost"
              >
                <Input
                  placeholder={
                    session?.user?.firstName +
                    " " +
                    session?.user?.middleName +
                    " " +
                    session?.user?.lastName +
                    " ơi, Bạn đang nghĩ gì thế ?"
                  }
                  inputProps={ariaLabel}
                  onChange={(e) => handleContentPost(e.target.value)}
                  multiline
                  sx={{
                    color: "white",
                    fontSize: "1.5rem",
                  }}
                  fullWidth
                  disableUnderline
                  value={postData.content}
                />
              </CardContent>
              <CardContent
                sx={{
                  color: "white !important",
                  py: "5px",
                }}
              >
                <Autocomplete
                  size="small"
                  multiple
                  freeSolo
                  id="tags-standard"
                  options={hashtagData as HashtagInfor[]}
                  // value={postData.listHashtag as any}
                  value={
                    hashtagData.length > 0
                      ? postData.listHashtag?.map((oldTag) => {
                          const matchingTag = hashtagData.find(
                            (newTag) => newTag.hashtagText === oldTag
                          );
                          return matchingTag ? matchingTag : oldTag;
                        }) || postData.listHashtag
                      : (postData.listHashtag as any)
                  }
                  getOptionLabel={(option: any) => {
                    return formatHashtagText(
                      typeof option === "string" ? option : option.hashtagText
                    );
                  }}
                  onChange={(event, values: any) =>
                    handleHashtagPost(event, values)
                  }
                  renderOption={(props, option, { selected }) => (
                    <Box
                      component="li"
                      sx={{
                        backgroundColor: selected
                          ? "#262B30 !important"
                          : "#3a3b3c !important",
                        color: "white !important",
                        "&:hover": {
                          backgroundColor: "#262B30 !important",
                        },
                        py: "10px !important",
                      }}
                      {...props}
                      key={option.hashtagText}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" color="white" mr="10px">
                          {option.hashtagText}
                        </Typography>
                        {selected ? (
                          <CheckIcon color="success" fontWeight="Bold" />
                        ) : "" + selected ? (
                          selected
                        ) : (
                          selected
                        )}
                        <Chip
                          label={option.countHashtagOfDetail + " bài viết"}
                          variant="outlined"
                          sx={{
                            color: "white",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hashtag"
                      placeholder="Nhập từ khóa tìm kiếm"
                      sx={{
                        backgroundColor: "#242526",
                        color: "white !important",
                        borderRadius: "4px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "white" },
                          "&.Mui-focused fieldset": { borderColor: "white" },
                          "& .MuiInputBase-input": {
                            color: "white",
                          },
                        },
                      }}
                      onChange={handleTextFieldChange}
                      value={searchValueHashtag}
                      InputLabelProps={{
                        style: {
                          color: "white",
                        },
                      }}
                    />
                  )}
                  ChipProps={{
                    style: {
                      color: "white",
                      backgroundColor: "#4d4d4d",
                    },
                  }}
                  disableCloseOnSelect
                  fullWidth
                  loading
                  loadingText={
                    !searchValueHashtag
                      ? ""
                      : `Thêm từ khóa "${searchValueHashtag}" vào danh sách Hashtag`
                  }
                />
                {postData.listHashtag?.length == 0 ? (
                  <FormHelperText sx={{ color: "whitesmoke" }}>
                    Hãy chọn hashtag để bài viết được nhiều người tiếp cận hơn
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </CardContent>
              <CardContent
                sx={{
                  color: "white !important",
                  py: "5px !important",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  sx={{
                    p: "8px",
                    // backgroundColor: "transparent",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "gray",
                      boxShadow: "none",
                    },
                    boxShadow: "none",
                  }}
                >
                  <AddPhotoAlternate />
                  Thêm ảnh hoặc Video
                  <VisuallyHiddenInput
                    type="file"
                    accept=".jpg, .png , .mp4"
                    onChange={(event) => handleChangePicturePost(event)}
                    multiple
                    name="listImageofComment"
                  />
                </Button>
              </CardContent>
              <Grid container rowSpacing={1} mt={1}>
                {postData.listImageofPost?.map((url: File, index: any) => (
                  <Grid item xs={12} key={"imageOfPost" + index} sm={6}>
                    <PreviewImageOfPost
                      // key={index}
                      url={url}
                      index={index}
                      handleRemoveImageOfPost={handleRemoveImageOfPost}
                    />
                  </Grid>
                ))}
              </Grid>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePost}
              sx={{
                color: "gray",
              }}
            >
              Hủy
            </Button>
            {isEditPost ? (
              <Button onClick={handleSaveEditPost}>Lưu</Button>
            ) : (
              <Button onClick={handlePost}>Đăng</Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
      {
        //@ts-ignore
        posts &&
          posts?.map((item, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: "5px",
                boxShadow: "0px 1px 2px #3335",
                backgroundColor: "#fff",
                marginBottom: "15px",
                height: "auto",
                transition: "all 0.25s linear",
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
              {item?.typePost === "share" && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "8px 16px",
                    boxShadow: "1px 1px 1px 1px gray",
                    backgroundColor: "#bed1b491",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      component={"p"}
                      sx={{ fontWeight: "bold", marginRight: "6px" }}
                    >
                      {item?.fullname}
                    </Typography>
                    <Typography component={"p"}>
                      {`đã chi sẻ bài viết`}
                    </Typography>
                  </Box>
                  <Typography component={"p"}>{item?.content}</Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "50%",
                      width: "45px",
                      height: "45px",
                      marginRight: "4px",
                      "& img": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <a href="#">
                      <img
                        src={`${
                          session?.user?.profileImageUrl
                            ? session?.user?.profileImageUrl
                            : "/profile/user.jpg"
                        }`}
                      />
                    </a>
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
                      {item?.postId?.userPost?.fullname}
                    </Typography>
                    <Box
                      sx={{
                        color: "#3339",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {session?.user?.userId ===
                        item?.postId?.userPost?.userId && (
                        <React.Fragment>
                          <List
                            component="nav"
                            aria-label="Device settings"
                            sx={{ bgcolor: "background.paper", padding: 0 }}
                          >
                            <ListItemButton
                              id={`lock-button-${index}`}
                              aria-haspopup="listbox"
                              aria-controls={`lock-menu-${index}`}
                              aria-label="when device is locked"
                              aria-expanded={
                                Boolean(anchorEls[index]) ? "true" : undefined
                              }
                              onClick={handleClickListItem(index)}
                              sx={{ padding: 0 }}
                            >
                              <LockIcon sx={{ fontSize: "18px" }} />
                              {options[selectedIndexes[index]] ||
                                item?.postId?.privacyPostDetails[0]
                                  ?.namePrivacy}
                            </ListItemButton>
                          </List>
                          <Menu
                            id={`lock-menu-${index}`}
                            anchorEl={anchorEls[index]}
                            open={Boolean(anchorEls[index])}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": `lock-button-${index}`,
                              role: "listbox",
                            }}
                          >
                            {options.map((option, optionIndex) => (
                              <MenuItem
                                key={option}
                                selected={
                                  optionIndex === selectedIndexes[index]
                                }
                                onClick={handleMenuItemClick(
                                  index,
                                  optionIndex,
                                  item?.postId?.postId
                                )}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </React.Fragment>
                      )}
                      <Typography
                        component={"span"}
                        sx={{ textDecoration: "none", marginLeft: "6px" }}
                      >
                        {formatDateString(item?.postId?.time)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    transform: "rotate(90deg)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transition: "all 0.2s linear",
                      "&:hover": {
                        backgroundColor: "#eeeeee",
                      },
                    }}
                    onClick={(event) =>
                      handleClick(event, item?.postId?.postId, item)
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        padding: "8px 4px ",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <MoreVertIcon />
                    </Box>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id={`account-menu-${index}`}
                    open={Boolean(anchorEl)}
                    onClose={handleCloses}
                    onClick={handleCloses}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.32))",
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
                    <MenuItem onClick={() => handleDeletePost(selectedItemId)}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      Xóa bài viết
                    </MenuItem>
                    <MenuItem onClick={() => handleEditPost(postModal!)}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      Chỉnh sửa bài viết
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <Link href={`/post?id=${item?.postId?.postId}`}>
                <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
                  {item?.postId?.content}
                </Box>
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
                  {item?.postId?.listHashtag?.map((hashtag) => (
                    <Link key={hashtag.id} href="/">
                      {hashtag?.hashtagDetailName}
                    </Link>
                  ))}
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    color: "#fff",
                    width: "100%",
                    height: "auto",
                    // height: `${
                    //   item?.listImageofPost?.length > 1 ? "350px" : "auto"
                    // }`,
                    boxSizing: "border-box",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: `${
                      item?.postId?.listImageofPost?.length == 1
                        ? "1fr"
                        : "1fr 1fr"
                    }`,
                    gridColumnGap: `${
                      item?.postId?.listImageofPost?.length > 1 ? "3px" : "0"
                    }`,
                  }}
                >
                  {item?.postId?.listImageofPost?.length < 3 ? (
                    item?.postId?.listImageofPost?.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
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
                    ))
                  ) : item?.postId?.listImageofPost?.length == 3 ? (
                    <React.Fragment key={index}>
                      <Box
                        sx={{
                          "& img": {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <img
                          src={item?.postId?.listImageofPost[0].imageUrl}
                          alt="photo"
                        />
                      </Box>
                      <Box>
                        {item?.postId?.listImageofPost?.map((item, index) => (
                          <React.Fragment key={index}>
                            {index > 0 ? (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "50%",
                                  backgroundColor: "#3335",
                                  borderBottom: `${
                                    index == 1 ? "3px solid #fff" : "0"
                                  }`,
                                  boxSizing: "border-box",
                                  "& img": {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <img src={item?.imageUrl} alt="photo" />
                              </Box>
                            ) : (
                              <React.Fragment key={index}></React.Fragment>
                            )}
                          </React.Fragment>
                        ))}
                      </Box>
                    </React.Fragment>
                  ) : item?.postId?.listImageofPost?.length == 4 ? (
                    item?.postId?.listImageofPost?.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
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
                    ))
                  ) : (
                    item?.postId?.listImageofPost?.map((i, index) => (
                      <React.Fragment key={index}>
                        {index < 3 ? (
                          <Box
                            sx={{
                              "& img": {
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "pointer",
                              },
                            }}
                          >
                            <img src={i.imageUrl} alt="photo" />
                          </Box>
                        ) : (
                          <React.Fragment key={index}>
                            {index == 4 ? (
                              <Box
                                sx={{
                                  position: "relative",
                                  "& img": {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <img src={i.imageUrl} alt="photo" />
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "0px",
                                    backgroundColor: "#6d6868a3",
                                    width: "100%",
                                    height: "100%",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item?.postId?.listImageofPost?.length - 4}
                                </Box>
                              </Box>
                            ) : (
                              <React.Fragment key={index}></React.Fragment>
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </Box>
              </Link>
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
                          "linear-gradient(to bottom, #FD5976, #E81E44)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FavoriteBorderIcon
                        sx={{
                          color: "white",
                          fontSize: "12px",
                          margin: "auto",
                        }}
                      />
                    </Box>
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
                      {item?.postId?.totalLike}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Typography
                      component={"p"}
                      sx={{
                        color: "#3339",
                      }}
                    >
                      {item?.postId?.totalComment} Comments
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        color: "#3339",
                        marginLeft: "12px",
                      }}
                    >
                      1 Share
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
                    // padding: "10px 0px",
                    fontSize: "14px",
                    textAlign: "center",
                    color: item?.postId?.likeByUserLogged
                      ? "#ff0000"
                      : "#57585b",
                    // color: "#707070",
                    display: "flex",
                    justifyContent: "center",
                    paddingY: 0,
                    alignItems: "center",
                    transition: "all 0.2s linear",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#E4E6E9",
                    },
                  }}
                >
                  <IconButton
                    aria-label="add to favorites"
                    sx={{
                      // borderRadius: "10px",
                      width: "100%",
                      borderRadius: "0",
                      // paddingY: 2,

                      color: item?.postId?.likeByUserLogged
                        ? "#ff0000"
                        : "#57585b",
                    }}
                    onClick={() =>
                      item?.postId?.likeByUserLogged
                        ? handleUnlike(item?.postId?.postId, false)
                        : handleLike(item?.postId?.postId, item, false)
                    }
                    disabled={item?.postId?.isProcessingLike}
                  >
                    {item?.postId?.isProcessingLike ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      <>
                        <ThumbUpOffAltIcon />
                        <Typography
                          component={"span"}
                          sx={{ marginLeft: "5px" }}
                        >
                          Like
                        </Typography>
                      </>
                    )}
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{
                    // padding: "10px 0px",
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
                >
                  <IconButton
                    aria-label="comment"
                    sx={{
                      width: "100%",
                      borderRadius: "0",
                    }}
                    onClick={() => handleOpenModalCmt(item?.postId)}
                  >
                    <CommentIcon />
                    <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                      Comment
                    </Typography>
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
                >
                  <ShareIcon />
                  <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                    Share
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))
      }
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
              bgcolor: "#1c1e21",
              borderRadius: "12px",
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
                  src={session?.user?.profileImageUrl}
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
    </>
  );
};
export default PostProfile;
