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
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ImageViewer2 from "react-simple-image-viewer";
import * as nsfwjs from "nsfwjs";
import { badWords, blackList } from "vn-badwords";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css";
import { FreeMode, Pagination } from "swiper/modules";
import { CldUploadWidget } from "next-cloudinary";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
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
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
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
  useTheme,
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
import React, { useCallback, useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  CubeSpan,
  CustomizedDialogs,
  ImageReplyViewerEdit,
  ImageViewer,
  ImageViewerEdit,
  Loader,
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
  GLOBAL_BG,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BG_NAV,
  GLOBAL_BG_NOTIFY,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_COLOR_WHITE,
  GLOBAL_DELETE_COMMENT_MESSAGE,
  GLOBAL_DELETE_POST_MESSAGE,
  GLOBAL_DELETE_POST_SHARE_MESSAGE,
  GLOBAL_ERROR_MESSAGE,
  GLOBAL_NOTIFI,
  GLOBAL_REPORT_POST,
  GLOBAL_SHARE_MESSAGE,
  GLOBAL_UPDATE_POST_MESSAGE,
  GLOBAL_UPLOAD_POST_MESSAGE,
  GLOBAL_URL,
  GLOBAL_URL_SOCKET,
  // stompClient,
} from "../utils/veriable.global";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useRouter, useSearchParams } from "next/navigation";
import InfiniteScroll from "../hash-tag/Infinite.scroll";
import PostSkeleton from "../posts/post.skeleton";
import ContentPost from "./post.content";
import HashtagPost from "./post.hashtag";
import { analyzeImage, findMaxValue } from "../utils/sightengineAPI";
import Image from "next/image";
const options = ["Riêng tư", "Công khai"];
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
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
interface PreviewImageOfPostProps2 {
  url: ImageofPost;
  index: number;
  handleRemoveImageOfPost: (index: number) => void;
}

const PreviewImageOfPost2: React.FC<PreviewImageOfPostProps2> = ({
  url,
  index,
  handleRemoveImageOfPost,
}) => {
  const imageUrl = url.imageUrl;
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        mr: "8px",
        height: "100%",
        width: "100%",
      }}
    >
      <FadeInImage
        src={imageUrl}
        alt={`Preview ${index}`}
        width="100%"
        height="100%"
        loading="lazy"
        style={{
          filter: url.valid ? "none" : "blur(5px)",
          objectFit: "contain",
          borderRadius: "10px",
          backgroundColor: "rgb(145 145 145 / 50%)",
        }}
      />

      <RemoveButton onClick={() => handleRemoveImageOfPost(index)}>
        <ClearIcon />
      </RemoveButton>
    </Box>
  );
};

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
  sessionGuest?: UserLogin;
  hashTagText?: string;
  profile?: string;
  search?: string;
  friendPost?: string;
}
const socket = new SockJS("http://localhost:8080/wss");
const stompClient = Stomp.over(socket);
const PostProfile = ({
  session,
  hashTagText,
  sessionGuest,
  profile,
  search,
  friendPost,
}: IPros) => {
  // console.log(stompClient);
  const themeS = useTheme();
  const [validPost, setValidPost] = React.useState<boolean>(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [countImgCloud, setCountImgCloud] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  //tạo biến xử lý modal report
  const [anchorEl, setAnchorEl] = React.useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);

  const [open2, setOpen2] = React.useState([]);

  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );
  const [openDialogReport, setOpenDialogReport] = React.useState<{
    openDialog: boolean;
    resPost: ResPost;
  }>({
    openDialog: false as boolean,
    resPost: null as unknown as ResPost,
  });
  const [reportDTO, setReportDTO] = React.useState<ReportDTO>({
    reportDetail: "",
    postId: openDialogReport.resPost?.postId?.postId,
  });
  let url = profile
    ? profile
    : // : hashTagText
      // ? `/${hashTagText ? `detailhashtag/${hashTagText}` : "post-by-user-logged"}`
      // : search
      // ? search
      // : friendPost
      // ? friendPost
      "/news-feed";
  // console.log(">>> check url: ", url);
  const searchParams = useSearchParams();

  //get data bài đăng
  const fetchData = async (url: string) => {
    return await sendRequest<IModelPaginate<ResPost>>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: { page: 0, keyword: searchParams.get("keyword") as string },
    });
  };

  const {
    data,
    error,
    isLoading,
    mutate,
  }: SWRResponse<IModelPaginate<ResPost>, any> = useSWR(
    GLOBAL_URL + "/api" + url,
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  //get data language
  const fetchDataLanguage = async (url: string) => {
    return await sendRequest<MyLanguageProgram[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };

  const {
    data: programingLanguage,
    error: errorProgramingLanguage,
    isLoading: isLoadingProgramingLanguage,
  }: SWRResponse<MyLanguageProgram[], any> = useSWR(
    GLOBAL_URL + "/api/programingLanguage",
    fetchDataLanguage,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    const handleChangeSession = async () => {
      console.log(">>> check url1111: ", url);
      const newData = await sendRequest<IModelPaginate<ResPost>>({
        url: GLOBAL_URL + "/api" + url,
        method: "GET",
        headers: { authorization: `Bearer ${session?.access_token}` },
        queryParams: {
          page: 0,
          keyword: searchParams.get("keyword") as string,
        },
      });
      newData && mutate(newData, true);
    };
    handleChangeSession();
  }, [sessionGuest]);
  //xử lý thao tác xóa modal report
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
    postModal: ResPost | null,
    index: number
  ) => {
    const newOpenArray = [...open2] as boolean[];
    newOpenArray[index] = true;

    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;

    setOpen2(newOpenArray as []);
    setAnchorEl(newAnchorEl);
    setSelectedItemId(id);
    setPostModal(postModal);
  };

  const handleCloses = (index: number) => {
    const newOpenArray = [...open2] as boolean[];
    newOpenArray[index] = false;

    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;

    setOpen2(newOpenArray as []);
    setAnchorEl(newAnchorEl);
    setPostModal(null);
    setSelectedItemId(null);
  };
  const handleDeletePost = async (postId: string | null, ind: number) => {
    console.log(">>> check postID: ", postId);
    let res = await sendRequest<ResPost>({
      url: GLOBAL_URL + `/api/post/${postId}/hidden`,
      method: "PUT",
    });
    if (res?.postId) {
      const previousData = data?.result!;
      const index = previousData.findIndex(
        (item) => item?.postId?.postId === postId
      );

      if (index !== -1) {
        previousData && previousData.splice(index, 1);
        const newData: IModelPaginate<ResPost> = {
          meta: data
            ? data.meta
            : { current: 0, pageSize: 0, pages: 0, total: 0 },
          result: previousData,
        };
        mutate(newData, false);
      }

      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_DELETE_POST_MESSAGE,
        type: "success",
      });
    }
    handleCloses(ind);
  };

  const handleDeletePostShare = async (postId: string | null, ind: number) => {
    console.log(">>> check postID: ", postId);
    let res = await sendRequest<boolean>({
      url: GLOBAL_URL + `/api/deleteshare/${postId}`,
      headers: { authorization: `Bearer ${session?.access_token}` },
      method: "POST",
    });
    if (res) {
      const previousData = data?.result!;
      if (ind !== -1) {
        previousData && previousData.splice(ind, 1);
        const newData: IModelPaginate<ResPost> = {
          meta: data
            ? data.meta
            : { current: 0, pageSize: 0, pages: 0, total: 0 },
          result: previousData,
        };
        mutate(newData, false);
      }
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_DELETE_POST_SHARE_MESSAGE,
        type: "success",
      });
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
    }
    handleCloses(ind);
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

    setAnchorEl([]);
    setSelectedItemId(null);
    setPostModal(null);
  };

  const handleOpenDialogReportPost = (post: ResPost) => {
    console.log(post);
    setOpenDialogReport({
      openDialog: true as boolean,
      resPost: post as unknown as ResPost,
    });
    setReportDTO({
      postId: post.postId.postId,
      reportDetail: "",
    });
  };
  const handleCloseDialogReportPost = () => {
    setOpenDialogReport({
      openDialog: false as boolean,
      resPost: null as unknown as ResPost,
    });
    console.log("close modal report");
  };
  const handleSendReport = async () => {
    console.log(reportDTO);
    const response = await sendRequest<number>({
      url: GLOBAL_URL + "/api/report",
      headers: { authorization: `Bearer ${session?.access_token}` },
      method: "POST",
      body: reportDTO,
    });
    if (response == 200) {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_REPORT_POST,
        type: "success",
      });
      handleCloseDialogReportPost();
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
      handleCloseDialogReportPost();
    }
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
  const [timerContent, setTimerContent] = useState<NodeJS.Timeout | null>(null);
  const [postModal, setPostModal] = useState<ResPost | null>(null);
  const [postData, setPostData] = useState<AddPost>({
    postId: "",
    content: "",
    time: new Date(),
    timelineUserId: new Date(),
    userId: session ? session?.user?.userId : "",
    listImageofPost: [],
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
      listImageofPost: post?.postId?.listImageofPost?.map((image) => ({
        ...image,
        valid: true,
      })),
      // listImageofPost: (await Promise.all(
      //   post?.postId?.listImageofPost?.map(async (image) => {
      //     const file = await fetchImageAsFile(image.imageUrl);
      //     return file;
      //   })
      // )) as File[],
      privacyPostDetails: selectedPrivacy?.privacyPostId as number,
      listHashtag: post?.postId?.listHashtag.map(
        (hashtag) => hashtag.hashtagDetailName
      ),
    };
    console.log(">>> check editedPostData: ", editedPostData);
    setPostData(editedPostData);
  };
  const handleClosePost = () => setOpenPost(false);
  const [dataLoading, setDataLoading] = useState<ResPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endPost, setEndPost] = useState<boolean>(false);
  const [endTextPost, setEndTextPost] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<ResPost[]>([]);
  const [comment, setComment] = useState<CommentOfPost[]>([]);
  const [commentOfShare, setCommentOfShare] = useState<
    CommentOfShareToGetDTO[]
  >([]);
  const [share, setShare] = useState<boolean>(false);
  const [openModalCmt, setOpenModalCmt] = useState(false);
  const [selectPost, setSelectPost] = useState<any>();
  const [showAllComments, setShowAllComments] = useState([]);
  const [isShowReplies, setIsShowReplies] = useState(null);
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<ImageofPost[]>([]);
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
    type: "success",
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
        setPostData((prevData) => ({
          ...prevData,
          content: content.toString(),
        }));
      }
    }, 1000);

    setTimer(newTimer);
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
  const handleChangePicturePost = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = event.target as HTMLInputElement;
    const selected = fileInput.files;
    // setPostData((prevData) => ({
    //   ...prevData,
    //   listImageofPost: [
    //     ...(prevData.listImageofPost || []),
    //     ...(selected ? Array.from(selected) : []),
    //   ] as File[],
    // }));
  };

  const handleChangeImageByCloud = async (imageOfPostdto: ImageofPost) => {
    console.log("check image");
    console.log(await analyzeImage(imageOfPostdto.imageUrl));
    const resp = await analyzeImage(imageOfPostdto.imageUrl);
    const { property, value } = findMaxValue(resp);
    console.log(property, value);
    if (value > 0.5) {
      imageOfPostdto.valid = false;
      setValidPost(false);
    }
    setPostData((prevData) => ({
      ...prevData,
      listImageofPost: [
        ...(prevData.listImageofPost || []),
        imageOfPostdto,
      ] as ImageofPost[],
    }));
  };

  const handleSaveEditPost = async () => {
    console.log(postData);
    handleClickOpenLoaderPost();
    const response = await fetch(
      GLOBAL_URL + "/api/update-post/" + postData.postId,
      {
        method: "PUT",
        headers: {
          authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postData.content,
          listHashtag: postData.listHashtag,
          timelineUserId: postData.timelineUserId,
          time: postData.time,
          privacyPostDetails: postData.privacyPostDetails,
          postId: postData.postId,
          listImageofPost: postData.listImageofPost,
        }),
      }
    );
    console.log(">>> check post update: ", response.status);
    if (response.status == 200) {
      handleCloseLoaderPost();
      handleClosePost();
      const data: ResPost = await response.json();
      console.log(data);

      setPosts((prev) =>
        prev.map((p) =>
          p?.postId?.postId === data?.postId?.postId ? { ...p, ...data } : p
        )
      );
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_UPDATE_POST_MESSAGE,
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
  const handlePost = async () => {
    handleClickOpenLoaderPost();
    setOpenBackdrop(true);
    setPostData((prevData) => ({
      ...prevData,
      postId: generateUniqueId(),
    }));
    console.log(">>> check postid: ", postData.postId);
    const formData = new FormData();
    formData.append(
      "postDTO",
      // new Blob(
      //   [
      JSON.stringify({
        content: postData.content,
        listHashtag: postData.listHashtag,
        timelineUserId: postData.timelineUserId,
        time: postData.time,
        privacyPostDetails: postData.privacyPostDetails,
        postId: postData.postId,
      })
      //   ],
      //   { type: "application/json" }
      // )
    );
    console.log(postData.listImageofPost);
    if (postData.listImageofPost) {
      console.log("có ảnh");

      postData.listImageofPost.forEach(
        (imageOfPost: ImageofPost, index: number) => {
          const imageJson = JSON.stringify(imageOfPost);
          formData.append(`listImageofPost`, imageJson);
        }
      );
      // postData.listImageofPost.forEach((file: ImageofPost, index: any) => {
      //   formData.append(
      //     "listImageofPost",
      //     new Blob(
      //       [
      //         JSON.stringify({
      //           cloudinaryPublicId: file.cloudinaryPublicId,
      //           imageUrl: file.imageUrl,
      //           postID: file.postID,
      //           time: file.time,
      //         }),
      //       ],
      //       { type: "application/json" }
      //     )
      //   );
      // });
    } else {
      console.log("rỗng ảnh");
      formData.append("listImageofPost", "");
    }
    const response = await fetch(GLOBAL_URL + "/api/post", {
      method: "POST",
      headers: {
        authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: postData.content,
        listHashtag: postData.listHashtag,
        timelineUserId: postData.timelineUserId,
        time: postData.time,
        privacyPostDetails: postData.privacyPostDetails,
        postId: postData.postId,
        listImageofPost: postData.listImageofPost,
      }),
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
      handleCloseLoaderPost();
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
    // const newSelectedFiles = [...(postData.listImageofPost as File[])];
    const newSelectedFiles = [...(postData.listImageofPost as ImageofPost[])];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    console.log(newSelectedFiles);
    setPostData((prevData) => ({
      ...prevData,
      listImageofPost: newSelectedFiles,
    }));
  };

  useEffect(() => {
    console.log(postData);
    let isStill = false;
    if (postData.listImageofPost) {
      if (postData.listImageofPost?.length > 0) {
        postData.listImageofPost?.map((i) => {
          if (!i.valid) {
            isStill = true;
            return;
          }
        });
      } else {
        setValidPost(true);
      }
    }
    if (isStill) {
      setValidPost(false);
    } else {
      setValidPost(true);
    }
  }, [postData]);

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
    } else if (actionType == "deletePostShare") {
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
    if (actionDialog.actionType == "deleteCmt") {
      handleDeleteCommentOrReplyComment(
        actionDialog.data.comment,
        actionDialog.data.isComment,
        actionDialog.data.index
      );
    } else if (actionDialog.actionType == "deletePost") {
      handleDeletePost(actionDialog.data.postId, actionDialog.data.index);
    } else if (actionDialog.actionType == "deletePostShare") {
      handleDeletePostShare(actionDialog.data.postId, actionDialog.data.index);
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
        const response = share
          ? await fetch(GLOBAL_URL + "/api/share/comment/" + commentObject.id, {
              method: "PUT",
              headers: { authorization: `Bearer ${session?.access_token}` },
              body: formData,
            })
          : await fetch(GLOBAL_URL + "/api/comment/" + commentObject.id, {
              method: "PUT",
              headers: { authorization: `Bearer ${session?.access_token}` },
              body: formData,
            });

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
        const response = share
          ? await fetch(
              GLOBAL_URL + "/api/share/replyComment/" + commentObject.id,
              {
                method: "PUT",
                headers: { authorization: `Bearer ${session?.access_token}` },
                body: formData,
              }
            )
          : await fetch(GLOBAL_URL + "/api/replyComment/" + commentObject.id, {
              method: "PUT",
              headers: { authorization: `Bearer ${session?.access_token}` },
              body: formData,
            });

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
  const handleDeleteCommentOrReplyComment = async (
    commentObject: any,
    isComment2: boolean,
    index: number
  ) => {
    console.log("Delete:", commentObject);
    const url = isComment2
      ? share
        ? GLOBAL_URL + "/api/share/comment/" + commentObject.id
        : GLOBAL_URL + "/api/comment/" + commentObject.id
      : share
      ? GLOBAL_URL + "/api/share/replyComment/" + commentObject.id
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
  const [formDataCommentOfShare, setFormDataCommentOfShare] =
    React.useState<CommentOfShareToPostDTO>({
      content: "",
      listImageofComment: null,
      userToPost: session?.user?.userId,
      shareId: "",
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
    setShare(false);
    setEditedContentComment("");
    setEditedContentReplyComment("");
    setFormDataComment({
      content: "",
      listImageofComment: null,
      postToPost: "",
      userToPost: "",
      userReceive: "",
    } as CommentToPostDTO);
    setFormDataCommentOfShare({
      content: "",
      listImageofComment: null,
      shareId: "",
      userToPost: "",
      userReceive: "",
    } as CommentOfShareToPostDTO);
  };
  const handleOpenModalCmt = async (
    post: Post,
    resPost: ResPost,
    isShare: boolean
  ) => {
    setIsComment(true);
    setOpenModalCmt(true);
    setShare(isShare);
    if (isShare) {
      //share
      setSelectPost(post.userPost.fullname);
      const newData = await sendRequest<IModelPaginate<CommentOfShareToGetDTO>>(
        {
          url: GLOBAL_URL + "/api/share/comment/" + resPost.id,
          method: "GET",
          headers: { authorization: `Bearer ${session?.access_token}` },
          queryParams: {
            page: 0,
            // keyword: searchParams.get("keyword") as string,
          },
        }
      );
      console.log(newData);
      // setCommentOfShare(newData?.result);
      setComment(newData?.result);
      setFormDataCommentOfShare((prevData) => ({
        ...prevData,
        shareId: resPost?.id,
        userReceive: post.userPost.userId,
      }));
    } else {
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
    }
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

  console.log(">>> check posts: ", data);

  const handleLike = async (
    entityId: string,
    item: ResPost,
    isShare: boolean
  ) => {
    if (isShare) {
      console.log("shareId: ", entityId);

      await setPosts(
        posts.map((resPost) => {
          if (resPost?.id === entityId) {
            return {
              ...resPost,
              isProcessingLike: true,
              likeByUserLogged: true,
              totalLike: resPost.totalLike + 1,
            };
          }
          return resPost;
        })
      );
      try {
        const response = await sendRequest({
          url: GLOBAL_URL + "/api/share/like/" + entityId,
          method: "POST",
          headers: { authorization: `Bearer ${session?.access_token}` },
        });
        console.log(response);
        if (response) {
          setPosts(
            posts.map((resPost) =>
              resPost?.id == entityId
                ? {
                    ...resPost,
                    isProcessingLike: false,
                    likeByUserLogged: true,
                    totalLike: resPost.totalLike + 1,
                  }
                : resPost
            )
          );
          // console.log(data);
          if (session?.user?.userId != item?.userPostDto.userId) {
            const notificationToPostDTO: notificationToPostDTO = {
              message: "likeShare",
              receiverId: `${item?.userPostDto.userId}`,
              senderId: session?.user?.userId,
              postId: "",
              shareId: entityId,
              type: "share",
            };
            stompClient.send(
              `${GLOBAL_NOTIFI}/${item?.userPostDto.userId}`,
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
    } else {
      await setPosts(
        posts.map((resPost) => {
          if (resPost?.postId?.postId === entityId) {
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
          url: GLOBAL_URL + "/api/like/" + entityId,
          method: "POST",
          headers: { authorization: `Bearer ${session?.access_token}` },
        });
        console.log(response);
        if (response) {
          setPosts(
            posts.map((resPost) =>
              resPost?.postId?.postId === entityId
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
          if (session?.user?.userId !== item?.postId?.userPost?.userId) {
            const notificationToPostDTO: notificationToPostDTO = {
              message: "like",
              receiverId: `${item?.postId?.userPost.userId}`,
              senderId: session?.user?.userId,
              postId: item?.postId?.postId,
              shareId: "",
              type: "post",
            };
            stompClient.send(
              `${GLOBAL_NOTIFI}/${item?.postId?.userPost?.userId}`,
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
    }
  };

  const handleUnlike = async (entityId: string, isShare: boolean) => {
    console.log("unlike: " + entityId);
    if (isShare) {
      setPosts(
        posts.map((resPost) =>
          resPost?.id == entityId
            ? {
                ...resPost,
                likeByUserLogged: false,
                totalLike: resPost.postId.totalLike - 1,
                isProcessingLike: true,
              }
            : resPost
        )
      );
      try {
        const response = await sendRequest<Post[]>({
          url: GLOBAL_URL + "/api/share/unlike/" + entityId,
          method: "POST",
          headers: { authorization: `Bearer ${session?.access_token}` },
        });

        console.log(response);
        if (response) {
          setPosts(
            posts.map((resPost) =>
              resPost?.id == entityId
                ? {
                    ...resPost,
                    likeByUserLogged: false,
                    totalLike: resPost.postId.totalLike - 1,
                    isProcessingLike: false,
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
    } else {
      setPosts(
        posts.map((resPost) =>
          resPost?.postId?.postId === entityId
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
          url: GLOBAL_URL + "/api/share/unlike/" + entityId,
          method: "POST",
          headers: { authorization: `Bearer ${session?.access_token}` },
        });

        console.log(response);
        if (response) {
          setPosts(
            posts.map((resPost) =>
              resPost?.postId?.postId === entityId
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
      if (share) {
        setFormDataCommentOfShare((prevFormData) => ({
          ...prevFormData,
          content: value,
        }));
      } else {
        setFormDataComment((prevFormData) => ({
          ...prevFormData,
          content: value,
        }));
      }
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
      if (share) {
        setFormDataCommentOfShare((prevData) => ({
          ...prevData,
          listImageofComment: [
            ...(prevData.listImageofComment || []),
            ...(selected ? Array.from(selected) : []),
          ] as File[],
        }));
      } else {
        setFormDataComment((prevData) => ({
          ...prevData,
          listImageofComment: [
            ...(prevData.listImageofComment || []),
            ...(selected ? Array.from(selected) : []),
          ] as File[],
        }));
      }
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
      ? share
        ? [...formDataCommentOfShare.listImageofComment]
        : [...formDataComment.listImageofComment]
      : [...formDataReplyComment.listImageofComment];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    console.log(newSelectedFiles);

    if (isComment) {
      if (share) {
        setFormDataCommentOfShare((prevData) => ({
          ...prevData,
          listImageofComment: newSelectedFiles,
        }));
      } else {
        setFormDataComment((prevData) => ({
          ...prevData,
          listImageofComment: newSelectedFiles,
        }));
      }
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

  const postReplyCommentOfShareApi = async (
    replyCommentToPostDTO: ReplyCommentToPostDTO,
    session: User
  ) => {
    const formData = new FormData();
    formData.append(
      "repcommentDTO",
      new Blob(
        [
          JSON.stringify({
            content: replyCommentToPostDTO.content,
            commentToPost: replyCommentToPostDTO.commentToPost.id,
            userToPost: replyCommentToPostDTO.userToPost,
            userReceive: replyCommentToPostDTO.userReceive.userId,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (replyCommentToPostDTO.listImageofComment) {
      replyCommentToPostDTO.listImageofComment.forEach(
        (file: any, index: any) => {
          formData.append("listImageofComment", file);
        }
      );
    } else {
      formData.append("listImageofComment", "");
    }
    console.log(formData.getAll("listImageofComment"));

    try {
      // let urlThis =
      //   GLOBAL_URL +
      //   "/api/share/repcomment/" +
      //   replyCommentToPostDTO.commentToPost.id;
      const response = await fetch(
        `${GLOBAL_URL}/api/share/repcomment/${replyCommentToPostDTO.commentToPost.id}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${session?.access_token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        return false;
      }

      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error("Error uploading content and files: ", error);
      throw error;
    }
  };

  const postCommentOfShareApi = async (
    commentToPostDTO: CommentOfShareToPostDTO,
    session: User
  ) => {
    const formData = new FormData();
    formData.append(
      "commentOfShareToPostDTO",
      new Blob(
        [
          JSON.stringify({
            content: commentToPostDTO.content,
            shareId: commentToPostDTO.shareId,
            userToPost: commentToPostDTO.userToPost,
            userReceive: commentToPostDTO.userReceive,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (commentToPostDTO.listImageofComment) {
      commentToPostDTO.listImageofComment.forEach((file: any, index: any) => {
        formData.append("listImageofComment", file);
      });
    } else {
      formData.append("listImageofComment", "");
    }
    console.log(formData.getAll("listImageofComment"));

    try {
      const response = await fetch(GLOBAL_URL + "/api/share/comment", {
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
        body: formData,
      });

      if (!response.ok) {
        return false;
      }

      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error("Error uploading content and files: ", error);
      throw error;
    }
  };
  const handlePostComment = async () => {
    if (isComment) {
      console.log(formDataComment);
      setIsLoadingComment(true);
      const response: any = share
        ? await postCommentOfShareApi(formDataCommentOfShare, session)
        : await postCommentApi(formDataComment, session);

      if (response != false) {
        setComment((preData) => [response, ...preData]);
        setFormDataComment(
          (prevData) =>
            ({
              ...prevData,
              content: "",
              listImageofComment: null,
              // postToPost: "",
            } as CommentToPostDTO)
        );

        setIsLoadingComment(false);
        if (share) {
          if (session?.user?.userId !== formDataCommentOfShare?.userReceive) {
            const notificationToPostDTO: notificationToPostDTO = {
              message: "commentShare",
              receiverId: `${formDataCommentOfShare?.userReceive}`,
              senderId: session?.user?.userId,
              postId: "",
              shareId: formDataCommentOfShare?.shareId,
              type: "commentShare",
            };
            stompClient.send(
              `${GLOBAL_NOTIFI}/${formDataComment?.userReceive}`,
              {},
              JSON.stringify(notificationToPostDTO)
            );
          }
        } else {
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
              `${GLOBAL_NOTIFI}/${formDataCommentOfShare?.userReceive}`,
              {},
              JSON.stringify(notificationToPostDTO)
            );
          }
        }
        if (share) {
          setFormDataCommentOfShare({
            content: "",
            listImageofComment: null,
            shareId: "",
            userToPost: "",
            userReceive: "",
          } as CommentOfShareToPostDTO);
        } else {
          setFormDataComment({
            content: "",
            listImageofComment: null,
            postToPost: "",
            userToPost: "",
            userReceive: "",
          } as CommentToPostDTO);
        }
      }
      setIsComment(true);
    } else {
      console.log(formDataReplyComment);
      setIsLoadingComment(true);
      const response = share
        ? await postReplyCommentOfShareApi(formDataReplyComment, session)
        : await postReplyCommentApi(formDataReplyComment, session);
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

  // modal loading openLoaderPost
  const [openLoaderPost, setOpenLoaderPost] = useState<boolean>(false);

  //xử lý mở modal loading
  const handleClickOpenLoaderPost = () => {
    setOpenLoaderPost(true);
  };

  //xử lý đóng modal loading
  const handleCloseLoaderPost = () => {
    setOpenLoaderPost(false);
  };

  // console.log(">>> check data posst: ", data);

  useEffect(() => {
    (async () => {
      if (page) {
        console.log(">>> check url234234: ", url);
        const response = await sendRequest<IModelPaginate<ResPost>>({
          url: GLOBAL_URL + "/api" + url,
          method: "GET",
          headers: { authorization: `Bearer ${session?.access_token}` },
          queryParams: {
            page: page,
            keyword: searchParams.get("keyword") as string,
          },
        });
        const has = data?.result ? data?.result : [];
        const resHash = response?.result ? response?.result : [];
        const newData: ResPost[] = [...has, ...resHash];
        setPosts(newData);
        mutate({ meta: response?.meta, result: newData! }, false);
      } else {
        data && setPosts(data?.result);
      }
    })();
  }, [page]);

  useEffect(() => {
    if (data && !error) {
      setPosts(data?.result);
    }
  }, [data]);
  useEffect(() => {
    const fetchDataHashtag = async () => {
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

    // if (data && !error) {
    //   setPosts(data?.result);
    // }
  }, [loading, dataLoading, searchValueHashtag]);

  //biến chuyển hướng
  const router = useRouter();
  // xử lý chuyển hướng trang cá nhân
  const handleRouterProfile = (id: string) => {
    router.push(`/profile?id=${id}`);
  };

  // xử lý thay đổi nội dung tìm kiếm bài viết
  // useEffect(() => {
  //   const dataFilter: {
  //     sort?: string;
  //     sortLike?: string;
  //     start?: string;
  //     end?: string;
  //   } = {};
  //   searchParams.get("sort") &&
  //     (dataFilter.sort =
  //       (searchParams.get("sort") as string) == "false" ? "asc" : "desc");
  //   searchParams.get("sortLike") &&
  //     (dataFilter.sortLike =
  //       (searchParams.get("sortLike") as string) == "false" ? "asc" : "desc");
  //   searchParams.get("startDate") &&
  //     (dataFilter.start = searchParams.get("startDate") as string);
  //   searchParams.get("endDate") &&
  //     (dataFilter.end = searchParams.get("endDate") as string);

  //   const refeshDataSearch = async () => {
  //     const newDataSearch = await sendRequest<IModelPaginate<ResPost>>({
  //       url: GLOBAL_URL + "/api" + url,
  //       method: "GET",
  //       headers: { authorization: `Bearer ${session?.access_token}` },
  //       queryParams: {
  //         page: 0,
  //         keyword: searchParams.get("keyword") as string,
  //         ...dataFilter,
  //       },
  //     });
  //     console.log(">>> check dataFilter: ", dataFilter);
  //     console.log(">>> check seaerch: ", newDataSearch);
  //     mutate(newDataSearch, false);
  //     newDataSearch && setPosts(newDataSearch?.result);
  //     console.log(">>> check newDataSearch: ", newDataSearch);
  //   };
  //   refeshDataSearch();
  // }, [
  //   searchParams.get("keyword") as string,
  //   searchParams.get("sort") as string,
  //   searchParams.get("sortLike") as string,
  //   searchParams.get("startDate") as string,
  //   searchParams.get("endDate") as string,
  // ]);

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [listStringImg, setListStringImg] = useState<string[]>([]);
  const openImageViewer = useCallback((index: any, item: ResPost) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
    console.log(index);
    setListStringImg(item?.postId?.listImageofPost?.map((i) => i.imageUrl));
    console.log(item);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
    setListStringImg([]);
  };

  if (isLoading) {
    return <PostSkeleton />;
  }
  // console.log(">>> check posts123: ", posts);
  return (
    <>
      {!searchParams.get("id") && (
        <Box
          sx={{
            borderRadius: "5px",
            boxShadow: "0px 1px 2px #3335",
            backgroundColor: "#fff",
            padding: "10px",
            marginBottom: "15px",
            display: `${search ? "none" : "block"}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
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
                  sessionGuest?.profileImageUrl
                    ? sessionGuest?.profileImageUrl
                    : session?.user?.profileImageUrl
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
                Bạn có câu hỏi hoặc kinh nghiệm gì chia sẻ không ?
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
                backgroundColor: GLOBAL_BG_NOTIFY,
                width: "100%",
                borderRadius: "12px",
              },
              // component: "form",
              // onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              //   event.preventDefault();
              //   const formData = new FormData(event.currentTarget);
              //   const formJson = Object.fromEntries(
              //     (formData as any).entries()
              //   );
              //   console.log(formJson);
              //   handleClosePost();
              // },
            }}
          >
            <Box className="dialog-header">
              <DialogTitle
                id="alert-dialog-title"
                sx={{
                  color: GLOBAL_COLOR_MENU,
                  textAlign: "center",
                  p: "10px",
                }}
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
                  color: (theme) => theme.palette.grey[900],
                  backgroundColor: "#c4c4c4",
                  transition: "all .2s linear",
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
                  color: GLOBAL_COLOR_BLACK,
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
                      <Typography
                        fontSize={16}
                        sx={{
                          color: GLOBAL_COLOR_BLACK,
                        }}
                      >
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
                            color: GLOBAL_COLOR_MENU,
                            "&.MuiSelect-root": {
                              backgroundColor: GLOBAL_BG_NOTIFY,
                              border: "1px solid white",
                            },
                            "& fieldset": {
                              border: "1px solid #323235",
                            },
                            "& fieldset:focus": {
                              border: "1px solid white",
                            },
                            "& svg": {
                              color: "#323235",
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
                    color: GLOBAL_COLOR_BLACK,
                    py: "5px",
                  }}
                  className="contentPost"
                >
                  <Input
                    placeholder="Chia sẻ kinh nghiệm hoặc câu hỏi của bạn"
                    inputProps={ariaLabel}
                    onChange={(e) => handleContentPost(e.target.value)}
                    multiline
                    sx={{
                      color: GLOBAL_COLOR_MENU,
                      fontSize: "1.5rem",
                    }}
                    fullWidth
                    disableUnderline
                    value={postData.content}
                  />
                </CardContent>
                <CardContent
                  sx={{
                    color: GLOBAL_COLOR_MENU,
                    py: "5px",
                  }}
                >
                  <Autocomplete
                    size="small"
                    multiple
                    freeSolo
                    id="tags-standard"
                    options={hashtagData as any[]}
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
                          transition: "all .2s linear",
                          backgroundColor: selected
                            ? "#gray !important"
                            : "#fff !important",
                          color: "black !important",
                          "&:hover": {
                            backgroundColor: "gray !important",
                          },
                          py: "10px !important",
                        }}
                        {...props}
                        key={option.hashtagText}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: GLOBAL_COLOR_MENU,
                            }}
                            mr="10px"
                          >
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
                            label={option?.totalPostUseHashtag + " bài viết"}
                            variant="outlined"
                            sx={{
                              color: GLOBAL_COLOR_MENU,
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
                          backgroundColor: GLOBAL_BG_NOTIFY,
                          color: GLOBAL_COLOR_MENU,
                          borderRadius: "4px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: GLOBAL_BG_NAV },
                            "&:hover fieldset": {
                              borderColor: GLOBAL_BG_NAV,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: GLOBAL_BG_NAV,
                            },
                            "& .MuiInputBase-input": {
                              color: GLOBAL_COLOR_MENU,
                            },
                          },
                        }}
                        onChange={handleTextFieldChange}
                        value={searchValueHashtag}
                        InputLabelProps={{
                          style: {
                            color: GLOBAL_COLOR_MENU,
                          },
                        }}
                      />
                    )}
                    ChipProps={{
                      style: {
                        color: GLOBAL_COLOR_MENU,
                        backgroundColor: GLOBAL_BG_NAV,
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
                    <FormHelperText
                      sx={{
                        color: GLOBAL_COLOR_MENU,
                      }}
                    >
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
                    flexDirection: "column",
                  }}
                >
                  {/* <Button
                    component="label"
                    variant="contained"
                    sx={{
                      p: "8px",
                      // backgroundColor: "transparent",
                      color: GLOBAL_COLOR_WHITE,
                      "&:hover": {
                        boxShadow: GLOBAL_BOXSHADOW,
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
                  </Button> */}

                  <CldUploadWidget
                    uploadPreset="g4py7mwy"
                    onSuccess={(result: any, { widget }) => {
                      console.log(result?.info);
                      const imgOfPostSave: ImageofPost = {
                        cloudinaryPublicId: result?.info?.asset_id,
                        imageUrl: result?.info?.secure_url,
                        postID: "",
                        time: result?.info?.created_at,
                        valid: true,
                      };
                      handleChangeImageByCloud(imgOfPostSave);
                      // widget.close();
                    }}
                  >
                    {({ open }) => {
                      function handleOnClick() {
                        open();
                      }
                      return (
                        <Button
                          variant="contained"
                          onClick={handleOnClick}
                          sx={{
                            p: "8px",
                            "&:hover": {
                              boxShadow: GLOBAL_BOXSHADOW,
                            },
                            boxShadow: "none",
                          }}
                        >
                          <AddPhotoAlternate /> Thêm ảnh hoặc Video
                        </Button>
                      );
                    }}
                  </CldUploadWidget>
                  {!validPost ? (
                    <FormHelperText
                      sx={{
                        color: "red",
                      }}
                    >
                      Ảnh hoặc video không hợp lệ, vui lòng kiểm tra lại !
                    </FormHelperText>
                  ) : (
                    <></>
                  )}
                </CardContent>
                <Grid container rowSpacing={1} mt={1}>
                  {postData.listImageofPost?.map(
                    (url: ImageofPost, index: any) => (
                      <Grid
                        item
                        xs={12}
                        key={"imageOfPost" + index}
                        p={"8px"}
                        sm={6}
                        maxHeight={"300px"}
                      >
                        <PreviewImageOfPost2
                          url={url}
                          index={index}
                          handleRemoveImageOfPost={handleRemoveImageOfPost}
                        />
                      </Grid>
                    )
                  )}
                  {/* {postData.listImageofPost?.map((url: File, index: any) => (
                    <Grid item xs={12} key={"imageOfPost" + index} sm={6}>
                      <PreviewImageOfPost
                        // key={index}
                        url={url}
                        index={index}
                        handleRemoveImageOfPost={handleRemoveImageOfPost}
                      />
                    </Grid>
                  ))} */}
                </Grid>
              </Card>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="outlined"
                onClick={handleClosePost}
              >
                Hủy
              </Button>
              {isEditPost ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSaveEditPost}
                  sx={{ minWidth: "120px" }}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ minWidth: "120px" }}
                  onClick={handlePost}
                  disabled={!postData.content || !validPost}
                >
                  Đăng
                </Button>
              )}
            </DialogActions>
          </Dialog>
          <Dialog
            open={openLoaderPost}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "12px",
              },
            }}
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Loader />
                {/* <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginTop: "12px ",
                  }}
                >
                  Đang đăng bài
                </Typography> */}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Box>
      )}
      {posts.length == 0 && (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Image
            src="/profile/notpost.png"
            width={500}
            height={350}
            alt="no activity"
          />
        </Typography>
      )}
      <InfiniteScroll
        loader={<Loader />}
        className=" my-5 pb-3"
        fetchMore={() => setPage((prev) => prev + 1)}
        hasMore={data && page + 1 < data?.meta?.total}
        totalPage={data ? data?.meta?.total : 1}
        endMessage={
          data && data?.meta?.total > data?.meta?.current ? (
            <Box
              sx={{ fontWeight: "bold", textAlign: "center", margin: "12px 0" }}
            >
              Bạn đã xem hết !
            </Box>
          ) : (
            ""
          )
        }
      >
        {
          //@ts-ignore

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
                    onClick={() =>
                      handleRouterProfile(item?.postId?.userPost?.userId)
                    }
                  >
                    {item?.typePost === "share" ? (
                      <img
                        src={`${
                          //@ts-ignore
                          url == item?.userPostDto?.profilePicUrl
                            ? //@ts-ignore
                              item?.userPostDto?.profilePicUrl
                            : "/profile/user.jpg"
                        }`}
                      />
                    ) : (
                      <img
                        src={`${
                          url == "post-by-user-logged"
                            ? session?.user?.profileImageUrl
                              ? session?.user?.profileImageUrl
                              : "/profile/user.jpg"
                            : item.postId.userPost.profilePicUrl
                            ? item.postId.userPost.profilePicUrl
                            : "/profile/user.jpg"
                        }`}
                      />
                    )}
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
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      onClick={() =>
                        handleRouterProfile(item?.postId?.userPost?.userId)
                      }
                    >
                      {item?.typePost === "share"
                        ? //@ts-ignore
                          item?.userPostDto?.fullname
                        : item?.postId?.userPost?.fullname}
                      {item?.userPostDto?.roleName == "mentor" ? (
                        <VerifiedIcon
                          sx={{ color: "blue", marginLeft: "4px" }}
                        />
                      ) : (
                        ""
                      )}
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
                        {
                          //@ts-ignore
                          item?.typePost === "share"
                            ? //@ts-ignore
                              formatDateString(item?.timeCreate)
                            : formatDateString(item?.postId?.time)
                        }
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
                      handleClick(event, item?.postId?.postId, item, index)
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
                    anchorEl={anchorEl[index]}
                    id={`account-menu-${index}`}
                    open={Boolean(anchorEl[index])}
                    onClose={() => handleCloses(index)}
                    onClick={() => handleCloses(index)}
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
                    {item?.typePost == "share" && (
                      <Box>
                        <MenuItem
                          onClick={
                            () =>
                              handleClickOpenAlerts(
                                item.postId.postId,
                                "deletePostShare",
                                false,
                                index,
                                false
                              )
                            // handleDeletePost(selectedItemId, index)
                          }
                        >
                          <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                          </ListItemIcon>
                          Xóa bài viết chia sẻ
                        </MenuItem>
                        <MenuItem onClick={() => handleEditPost(postModal!)}>
                          <ListItemIcon>
                            <EditIcon fontSize="small" />
                          </ListItemIcon>
                          Chỉnh sửa bài viết chia sẻ
                        </MenuItem>
                      </Box>
                    )}
                    {item?.typePost != "share" &&
                      (session?.user?.userId == item?.postId.userPost.userId ? (
                        <Box>
                          <MenuItem
                            onClick={() =>
                              handleClickOpenAlerts(
                                item.postId.postId,
                                "deletePost",
                                false,
                                index,
                                false
                              )
                            }
                          >
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
                        </Box>
                      ) : (
                        <Box>
                          <MenuItem
                            onClick={() =>
                              handleOpenDialogReportPost(postModal!)
                            }
                          >
                            <ReportGmailerrorredOutlinedIcon
                              sx={{ marginRight: "6px" }}
                            />
                            Báo cáo bài viết
                          </MenuItem>
                        </Box>
                      ))}
                  </Menu>
                </Box>
              </Box>
              {item?.typePost !== "share" ? (
                <ContentPost
                  postId={item?.postId?.postId}
                  content={item?.postId?.content}
                  programingLanguage={programingLanguage}
                  session={session}
                />
              ) : (
                <ContentPost
                  postId={item?.userPostDto?.userId}
                  content={item?.content}
                  programingLanguage={programingLanguage}
                  session={session}
                />
              )}
              {item?.typePost !== "share" &&
                item?.postId?.listHashtag.length > 0 && (
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
                )}
              {item?.typePost !== "share" && (
                <HashtagPost
                  session={session}
                  programingLanguage={programingLanguage}
                  hashtags={item?.postId?.listHashtag}
                />
                // <Box
                //   sx={{
                //     display: "flex",
                //     justifyContent: "flex-start",
                //     paddingX: "16px",
                //     flexWrap: "wrap",
                //     paddingBottom: "16px",
                //     "& a": {
                //       backgroundColor: "#d6e8fa",
                //       color: "#0c3b6a",
                //       borderRadius: "4px",
                //       fontSize: "12px",
                //       // fontWeight: "400",
                //       padding: "4.8px 6px",
                //       cursor: "pointer",
                //       transition: "all 0.3s ease-in-out",
                //       margin: "0 2px 2px 0",
                //       border: "1px solid #BDC0C7",
                //       textDecoration: "none",
                //       gridArea: "auto",
                //       "&:hover": {
                //         transform: "translateY(-1px) translateX(0)",
                //         boxShadow: "0 1px 0 0 #BDC0C7",
                //       },
                //     },
                //   }}
                // >
                //   {item?.postId?.listHashtag?.map((hashtag) => (
                //     <Link
                //       key={hashtag.id}
                //       href={`/hash-tag/${hashtag?.hashtagDetailName}`}
                //     >
                //       {hashtag?.hashtagDetailName}
                //     </Link>
                //   ))}
                // </Box>
              )}
              <Box
                sx={{
                  borderRadius: `${
                    item?.typePost === "share" ? "12px" : "none"
                  }`,
                  border: `${
                    item?.typePost === "share" ? "1px solid gray" : "none"
                  }`,
                  // padding: "6px 12px",
                  overflow: "hidden",
                }}
              >
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
                  {isViewerOpen && (
                    <Box
                      sx={{
                        "& .react-simple-image-viewer__modal": {
                          zIndex: 999999,
                          "& img": {
                            width: "auto",
                          },
                        },
                      }}
                    >
                      <ImageViewer2
                        src={listStringImg}
                        currentIndex={currentImage}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={closeImageViewer}
                      />
                    </Box>
                  )}
                  {item?.postId?.listImageofPost?.length < 3 ? (
                    item?.postId?.listImageofPost?.map((item2, index) => (
                      <Box
                        key={index}
                        onClick={() => openImageViewer(index, item)}
                        sx={{
                          marginBottom: "3px",
                          "& img": {
                            width: "100%",
                            height: "100%",
                            maxHeight: "400px",
                            objectFit: "cover",
                            cursor: "pointer",
                            border: "1px solid #80808080",
                          },
                        }}
                      >
                        <img src={item2.imageUrl} alt="photo" />
                      </Box>
                    ))
                  ) : item?.postId?.listImageofPost?.length == 3 ? (
                    <React.Fragment key={index}>
                      <Box
                        onClick={() => openImageViewer(index, item)}
                        sx={{
                          "& img": {
                            width: "100%",
                            height: "100%",
                            maxHeight: "440px",
                            objectFit: "cover",
                            cursor: "pointer",
                            border: "1px solid #80808080",
                          },
                        }}
                      >
                        <img
                          src={item?.postId?.listImageofPost[0].imageUrl}
                          alt="photo"
                        />
                      </Box>
                      <Box>
                        {item?.postId?.listImageofPost?.map((item2, index) => (
                          <React.Fragment key={index}>
                            {index > 0 ? (
                              <Box
                                onClick={() => openImageViewer(index, item)}
                                sx={{
                                  width: "100%",
                                  height: "49.5%",
                                  maxHeight: "218px",
                                  backgroundColor: "#3335",
                                  borderBottom: `${
                                    index == 1 ? "3px solid #fff" : "0"
                                  }`,
                                  boxSizing: "border-box",
                                  border: "1px solid #80808080",
                                  marginBottom: index == 1 ? "4px" : 0,
                                  "& img": {
                                    width: "100%",
                                    height: "100%",
                                    maxHeight: "218px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <img src={item2?.imageUrl} alt="photo" />
                              </Box>
                            ) : (
                              <React.Fragment key={index}></React.Fragment>
                            )}
                          </React.Fragment>
                        ))}
                      </Box>
                    </React.Fragment>
                  ) : item?.postId?.listImageofPost?.length == 4 ? (
                    item?.postId?.listImageofPost?.map((item2, index) => (
                      <Box
                        onClick={() => openImageViewer(index, item)}
                        key={index}
                        sx={{
                          marginBottom: "3px",
                          "& img": {
                            width: "100%",
                            height: "100%",
                            maxHeight: "220px",
                            objectFit: "cover",
                            cursor: "pointer",
                            border: "1px solid #80808080",
                          },
                        }}
                      >
                        <img src={item2.imageUrl} alt="photo" />
                      </Box>
                    ))
                  ) : (
                    item?.postId?.listImageofPost?.map((i, index) => (
                      <React.Fragment key={index}>
                        {index < 3 ? (
                          <Box
                            onClick={() => openImageViewer(index, item)}
                            sx={{
                              marginBottom: "3px",
                              "& img": {
                                width: "100%",
                                height: "100%",
                                maxHeight: "220px",
                                objectFit: "cover",
                                cursor: "pointer",
                                border: "1px solid #80808080",
                              },
                            }}
                          >
                            <img src={i.imageUrl} alt="photo" />
                          </Box>
                        ) : (
                          <React.Fragment key={index}>
                            {index == 4 ? (
                              <Box
                                onClick={() => openImageViewer(index, item)}
                                sx={{
                                  position: "relative",
                                  "& img": {
                                    width: "100%",
                                    height: "100%",
                                    maxHeight: "220px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border: "1px solid #80808080",
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
                {item?.typePost === "share" && (
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
                        onClick={() =>
                          handleRouterProfile(item?.postId?.userPost?.userId)
                        }
                      >
                        {item?.typePost === "share" && (
                          <img
                            src={`${
                              url == "post-by-user-logged"
                                ? session?.user?.profileImageUrl
                                  ? session?.user?.profileImageUrl
                                  : "/profile/user.jpg"
                                : item.postId.userPost.profilePicUrl
                                ? item.postId.userPost.profilePicUrl
                                : "/profile/user.jpg"
                            }`}
                          />
                        )}
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
                          onClick={() =>
                            handleRouterProfile(item?.postId?.userPost?.userId)
                          }
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
                                    Boolean(anchorEls[index])
                                      ? "true"
                                      : undefined
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
                    {/* <Box
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
                          handleClick(event, item?.postId?.postId, item, index)
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
                        anchorEl={anchorEl[index]}
                        id={`account-menu-${index}`}
                        open={Boolean(anchorEl[index])}
                        onClose={() => handleCloses(index)}
                        onClick={() => handleCloses(index)}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter:
                              "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.32))",
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
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        {/* {searchParams.get("id") != session?.user?.userId ? ( */}
                    {/* <Box>
                            <MenuItem
                              onClick={() =>
                                handleDeletePost(selectedItemId, index)
                              }
                            >
                                <DeleteIcon fontSize="small" />
                              </ListItemIcon>
                              Xóa bài viết chia sẻ{session?.user?.userId}
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleEditPost(postModal!)}
                            >
                              <ListItemIcon>
                                <EditIcon fontSize="small" />
                              </ListItemIcon>
                              Chỉnh sửa bài viết chia sẻ
                              {item?.userPostDto?.userId}
                            </MenuItem>
                          </Box> */}
                    {/* ) : ( */}
                    {/* <Box>
                          <MenuItem
                            onClick={() =>
                              handleOpenDialogReportPost(postModal!)
                            }
                          >
                            <ReportGmailerrorredOutlinedIcon
                              sx={{ marginRight: "6px" }}
                            />
                            Báo cáo bài viết
                          </MenuItem>
                        </Box> */}
                    {/* )}  */}
                    {/* </Menu> */}
                    {/* </Box> */}
                  </Box>
                )}
                {item?.typePost === "share" && (
                  <Link href={`/post?id=${item?.postId?.postId}`}>
                    <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
                      {item?.postId?.content}
                    </Box>
                  </Link>
                )}
                {item?.typePost === "share" &&
                  item?.postId?.listHashtag.length > 0 && (
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
                  )}
                {item?.typePost === "share" && (
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
                    {item?.postId?.listHashtag?.map((hashtag) => (
                      <Link
                        key={hashtag.id}
                        href={`/hash-tag/${hashtag?.hashtagDetailName}`}
                      >
                        {hashtag?.hashtagDetailName}
                      </Link>
                    ))}
                  </Box>
                )}
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
                          color: GLOBAL_COLOR_WHITE,
                          fontSize: "12px",
                          margin: "auto",
                        }}
                      />
                    </Box>
                    <Typography component={"p"} sx={{ marginLeft: "6px" }}>
                      {item?.typePost == "share"
                        ? item?.totalLike
                        : item?.postId?.totalLike}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Typography
                      component={"p"}
                      sx={{
                        color: "#3339",
                      }}
                    >
                      {item?.typePost == "share"
                        ? item?.totalComment
                        : item?.postId?.totalComment}{" "}
                      Bình luận
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                {item?.typePost == "share" ? (
                  <Grid
                    container
                    columns={3}
                    sx={{
                      borderTop: " 1px solid #3333",
                    }}
                    //site share action button
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
                        aria-label="Thích bài viết"
                        sx={{
                          width: "100%",
                          borderRadius: "0",
                          color: item?.likeByUserLogged ? "#ff0000" : "#57585b",
                        }}
                        onClick={() =>
                          item?.likeByUserLogged
                            ? handleUnlike(item?.id, true)
                            : handleLike(item?.id, item, true)
                        }
                        disabled={item?.isProcessingLike}
                      >
                        {item?.isProcessingLike ? (
                          <CircularProgress size={24} color="secondary" />
                        ) : (
                          <>
                            <ThumbUpOffAltIcon />
                            <Typography
                              component={"span"}
                              sx={{ marginLeft: "5px" }}
                            >
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
                        onClick={() =>
                          handleOpenModalCmt(item?.postId, item, true)
                        }
                      >
                        <CommentIcon />
                        <Typography
                          component={"span"}
                          sx={{ marginLeft: "5px" }}
                        >
                          Bình luận
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
                      onClick={() =>
                        handleClickOpenAlerts(
                          item?.postId,
                          "share",
                          false,
                          -1,
                          false
                        )
                      }
                    >
                      <ShareIcon />
                      <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                        Chia sẻ
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    container
                    columns={3}
                    sx={{
                      borderTop: " 1px solid #3333",
                    }}
                    //site post action button
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
                        onClick={() =>
                          handleOpenModalCmt(item?.postId, item, false)
                        }
                      >
                        <CommentIcon />
                        <Typography
                          component={"span"}
                          sx={{ marginLeft: "5px" }}
                        >
                          Bình luận
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
                      onClick={() =>
                        handleClickOpenAlerts(
                          item?.postId,
                          "share",
                          false,
                          -1,
                          false
                        )
                      }
                    >
                      <ShareIcon />
                      <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                        Chia sẻ
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
          ))
        }
      </InfiniteScroll>
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
                          ? share
                            ? formDataCommentOfShare.content
                            : formDataComment.content
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
                          ? share
                            ? !formDataCommentOfShare.content ||
                              isLoadingComment
                            : !formDataComment.content || isLoadingComment
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
                    ? share
                      ? formDataCommentOfShare.listImageofComment?.map(
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
                      : formDataComment.listImageofComment?.map(
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
            : actionDialog.actionType == "deletePostShare"
            ? "Xóa bài viết chia sẻ"
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
          ) : actionDialog.actionType == "deletePostShare" ? (
            <Typography sx={{ color: GLOBAL_COLOR_BLACK }}>
              Bạn có chắc chắn muốn xóa bài viết đã chia sẻ này không?
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
              : "Chia sẻ"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* <CustomizedDialogs openDialog={openDialogReport.openDialog} resPost={openDialogReport.resPost}></CustomizedDialogs> */}
      <BootstrapDialog
        onClose={handleCloseDialogReportPost}
        aria-labelledby="customized-dialog-title"
        open={openDialogReport.openDialog}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, color: GLOBAL_COLOR_BLACK }}
          id="customized-dialog-title"
          fontSize={"18px"}
        >
          Báo cáo bài viết của{" "}
          {openDialogReport.resPost?.postId?.userPost.fullname}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialogReportPost}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TextField
            id="standard-basic-report"
            label="Nội dung báo cáo"
            variant="standard"
            autoComplete="off"
            fullWidth
            onChange={(e) =>
              setReportDTO({
                postId: reportDTO.postId,
                reportDetail: e.target.value,
              })
            }
          />
          {!reportDTO.reportDetail && (
            <FormHelperText sx={{ color: "red" }}>
              Vui lòng nhập nội dung báo cáo
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogReportPost}
            sx={{
              color: "gray",
            }}
          >
            Hủy
          </Button>
          <Button
            autoFocus
            onClick={handleSendReport}
            disabled={!reportDTO.reportDetail}
          >
            Gửi
          </Button>
        </DialogActions>
      </BootstrapDialog>
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
    </>
  );
};
export default PostProfile;
