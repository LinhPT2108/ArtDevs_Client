"use client";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Radio,
  RadioGroup,
  Slide,
  SlideProps,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "../../style/style.css";
import KnowledgeSign from "../sign/sign-up/knowledge.sign";
import { sendRequest } from "../utils/api";
import { ProcessingLoading } from "../utils/component.global";
import { deleteSpace, formatBirthDay } from "../utils/utils";
import { GLOBAL_SEND_FRIEND, GLOBAL_URL } from "../utils/veriable.global";
import PostProfile from "./post.profile";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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
interface IPros {
  session: User;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const HomeProfile = ({ session }: IPros) => {
  //biến search parameters
  const searchParams = useSearchParams();
  const [openDialogAvatar, setOpenDialogAvatar] = React.useState(false);

  const [selectedFile, setSelectedFile] = useState<null>();
  const [selectedBgImg, setSelectedBgImg] = useState<null>();
  const [preview, setPreview] = useState<string>();
  const [previewBgImg, setPreviewBgImg] = useState<string>();

  const handleClickOpenDialogAvatar = () => {
    setPreview(
      session?.user?.profileImageUrl
        ? session?.user?.profileImageUrl
        : "/profile/user.jpg"
    );
    setOpenDialogAvatar(true);
  };
  const handleCloseDialogAvatar = () => {
    setSelectedFile(null);
    setOpenDialogAvatar(false);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl as any);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const onSelectBgImg = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedBgImg(undefined);
      return;
    }

    setSelectedBgImg(e.target.files[0]);
  };

  const [value, setValue] = useState(0);

  const { data: sessions, update: sessionUpdate } = useSession();
  const router = useRouter();
  console.log(">>> check sessions?.user: ", sessions?.user?.lastName);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  //xử lý mở modal cập nhật
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState<boolean>(false);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = React.useState({
    open: false,
    message: "",
  });

  const handleClickAlertAvatar = () => {
    setOpenAlert({
      open: true,
      message: "Thay đổi ảnh đại diện thành công !",
    });
  };

  const handleClickAlertBgImg = () => {
    setOpenAlert({
      open: true,
      message: "Thay đổi ảnh bìa thành công !",
    });
  };
  const handleCloseAlert = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert({
      open: false,
      message: "",
    });
  };
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //xử lý địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [city, setCity] = useState<Province>();
  const [district, setDistrict] = useState<District>();
  const [ward, setWard] = useState<District>();
  const [programingLanguage, setProgramingLanguage] = useState<
    MyLanguageProgram[]
  >([]);
  // lấy danh sách thành phố
  useEffect(() => {
    const fetchDataProvince = async () => {
      try {
        const province = await sendRequest<Result<Province[]>>({
          // url: "https://artdevs-server.azurewebsites.net/api/programingLanguage",
          // url: process.env.PUBLIC_NEXT_BACKEND_URL + "/api/programingLanguage",
          url: "https://vapi.vnappmob.com/api/province/",
          method: "GET",
        });
        province && setProvinces(province.results);
        setCity(
          province?.results &&
            province?.results.find(
              (province) => province?.province_name === data?.city
            )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataProvince();
  }, []);
  // lấy danh sách quận, huyện từ thành phố
  useEffect(() => {
    const fetchDataDistrict = async () => {
      try {
        if (city && city?.province_id) {
          const district = await sendRequest<Result<District[]>>({
            url: `https://vapi.vnappmob.com/api/province/district/${city.province_id}`,
            method: "GET",
          });
          district && setDistricts(district.results);
          setDistrict(
            district?.results?.length > 0
              ? district.results?.find(
                  (district) => district.district_name === data?.district
                )
              : undefined
          );
        } else {
          setDistricts([]);
          setDistrict(undefined);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataDistrict();
  }, [city]);
  // lấy danh sách xã, phường, thị trấn từ quận, huyện
  useEffect(() => {
    const fetchDataWard = async () => {
      try {
        if (district && district?.district_id) {
          const ward = await sendRequest<Result<Ward[]>>({
            url: `https://vapi.vnappmob.com/api/province/ward/${district?.district_id}`,
            method: "GET",
          });
          ward && setWards(ward.results);
        } else {
          setWards([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataWard();
  }, [district]);
  // lấy toàn bộ danh mục mà người dùng có thể chọn
  useEffect(() => {
    const fetchDataDemand = async () => {
      try {
        const response = await sendRequest<MyLanguageProgram[]>({
          url: GLOBAL_URL + "/api/programingLanguage",
          method: "GET",
        });
        response && setProgramingLanguage(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataDemand();
  }, []);

  const [demandOfUserLogin, setDemandOfUserLogin] = useState<Demand[]>([]);
  // lấy danh sách danh mục mà người dùng đã chọn
  useEffect(() => {
    const fetchUserDemand = async () => {
      try {
        const response = await sendRequest<Demand[]>({
          url: GLOBAL_URL + "/api/get-user-demand",
          method: "GET",
          queryParams: {
            userId: searchId ? searchId : session?.user?.userId,
          },
        });
        response && setDemandOfUserLogin(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserDemand();
  }, [session]);
  console.log(">>> check demandOfUserLogin: ", demandOfUserLogin);
  //xử lý cập nhật thông tin người dùng
  const [data, setData] = useState<UserLogin>(session?.user);
  const [errorFirstName, setErrorFirstName] = useState<boolean>();
  const [messageFirstName, setMessageFirstName] = useState<string>();
  const [errorLastName, setErrorLastName] = useState<boolean>();
  const [messageLastName, setMessageLastName] = useState<string>();
  const [errorDateOfBirth, setErrorDateOfBirth] = useState<boolean>();
  const [messageDateOfBirth, setMessageDateOfBirth] = useState<string>();
  const [errorDemand, setErrorDemand] = useState<boolean>(false);
  const [messageDemand, setMessageDemand] = useState<string>("");
  const handleLastName = (value: string) => {
    if (value) {
      setErrorLastName(false);
      setMessageLastName("");
    } else {
      setErrorLastName(true);
      setMessageLastName("Không được để trống tên !");
    }
    setData((prevData) => ({
      ...prevData,
      lastName: value,
    }));
  };
  const handleMiddleName = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      middleName: value,
    }));
  };

  const handleFirstName = (value: string) => {
    if (value) {
      setErrorFirstName(false);
      setMessageFirstName("");
    } else {
      setErrorFirstName(true);
      setMessageFirstName("Không được để trống họ !");
    }
    setData((prevData) => ({
      ...prevData,
      firstName: value,
    }));
  };
  const handleDateOfBirth = (value: string) => {
    if (value) {
      setErrorDateOfBirth(false);
      setMessageDateOfBirth("");
    } else {
      setErrorDateOfBirth(true);
      setMessageDateOfBirth("Không được để trống ngày sinh !");
    }
    setData((prevData) => ({
      ...prevData,
      birthday: value,
    }));
  };
  const handleGender = (value: number) => {
    setData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };
  const handleCity = (value: Province) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        city: value?.province_name,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        city: "",
        district: "",
        ward: "",
      }));
    }
  };
  const handleDistrict = (value: District) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        district: value?.district_name,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        district: "",
        ward: "",
      }));
    }
  };
  const handleWard = (value: Ward) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        ward: value?.ward_name,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        ward: "",
      }));
    }
  };
  const handleListDemandOfUser = (myLanguageProgram: MyLanguageProgram[]) => {
    let arrayOfValues: string[] = [];
    if (myLanguageProgram) {
      arrayOfValues = Object.values(myLanguageProgram).map(
        (item) => item.languageName
      );
    }
    if (myLanguageProgram.length > 0) {
      setErrorDemand(false);
      setMessageDemand("");
    } else {
      setErrorDemand(true);
      setMessageDemand("Chọn ít nhất một danh mục quan tâm !");
    }
    setData((prevData) => ({
      ...prevData,
      listDemandOfUser: arrayOfValues,
    }));
  };
  const handleListSkillOfUser = (myLanguageProgram: MyLanguageProgram[]) => {
    let arrayOfValues: string[] = [];
    if (myLanguageProgram) {
      arrayOfValues = Object.values(myLanguageProgram).map(
        (item) => item.languageName
      );
    }
    setData((prevData) => ({
      ...prevData,
      listSkillOfUser: arrayOfValues,
    }));
  };

  // const handleUpdateProfile = () => {
  //   console.log(">>> check data: ", data);
  // };

  const handleUpdateProfile = async () => {
    try {
      if (!data?.firstName) {
        setErrorFirstName(true);
        setMessageFirstName("Không được để trống họ !");
        return;
      }
      if (!data?.lastName) {
        setErrorLastName(true);
        setMessageLastName("Không được để trống tên !");
        return;
      }
      if (!data?.birthday) {
        setErrorDateOfBirth(true);
        setMessageDateOfBirth("Không được để trống ngày sinh !");
        return;
      }
      if (
        session?.user?.role?.roleName == "user" &&
        data?.listDemandOfUser?.length == 0
      ) {
        setErrorDemand(true);
        setMessageDemand("Chọn ít nhất một danh mục quan tâm !");
        return;
      }
      if (
        session?.user?.role?.roleName == "mentor" &&
        data?.listSkillOfUser?.length == 0
      ) {
        return;
      }
      handleClickOpenModalUpdate();
      console.log(">>> check data: ", data);
      const response = await sendRequest<ResponseStatus>({
        url: GLOBAL_URL + "/api/user/update-profile",
        method: "PUT",
        body: { ...data },
      });
      console.log(">>> check response: ", response);
      if (response.errorCode == 200) {
        const updatedUserData: User = {
          access_token: session?.access_token,
          refresh_token: session?.refresh_token,
          user: {
            ...data,
          },
        };
        await sessionUpdate(updatedUserData);
        setDataProfile(data);
        router.refresh();
        handleCloseModalUpdate();
        handleClose();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [dataProfile, setDataProfile] = useState<UserLogin>();
  const searchId = searchParams.get("id") as string;
  const handleDataProfile = async () => {
    if (searchParams.get("id")) {
      const user = await sendRequest<UserLogin>({
        url: GLOBAL_URL + "/api/get-user-by-id",
        method: "GET",
        headers: {
          authorization: `Bearer ${session?.access_token}`,
        },
        queryParams: {
          id: searchId,
        },
      });
      console.log(">>>check user friend: ", user);

      await setDataProfile(user);
    } else {
      await setDataProfile(session?.user);
    }
  };

  useEffect(() => {
    handleDataProfile();
  }, [searchParams.get("id") as string]);

  useEffect(() => {
    if (!selectedBgImg) {
      setPreviewBgImg(session?.user?.backgroundImageUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedBgImg);
    setPreviewBgImg(objectUrl as any);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedBgImg]);

  console.log(">>> check usser profile:2 ", dataProfile);
  const url = searchId
    ? `/post-by-user-id/${searchId}`
    : "/post-by-user-logged";

  let firstName = dataProfile?.firstName ? dataProfile?.firstName : "";
  let middleName = dataProfile?.middleName ? dataProfile?.middleName : "";
  let lastName = dataProfile?.lastName ? dataProfile?.lastName : "";
  let fullname = firstName + " " + middleName + " " + lastName;
  const handleSaveAvatar = async () => {
    handleOpenBackdrop();
    console.log(selectedFile);
    const formData = new FormData();
    if (selectedFile) {
      formData.append("imageUrl", selectedFile! as File);
      formData.append("positionOfPic", "true");
      const response = await fetch(GLOBAL_URL + "/api/add-picture", {
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
        body: formData,
      });
      const data: ImageofPost = await response.json();
      console.log(data);
      if (data) {
        const updatedUserData: User = {
          access_token: session?.access_token,
          refresh_token: session?.refresh_token,
          user: {
            ...session?.user,
            profileImageUrl: data?.imageUrl,
          },
        };
        await sessionUpdate(updatedUserData);
        setDataProfile({ ...session?.user, profileImageUrl: data?.imageUrl });
        handleCloseBackdrop();
        handleClickAlertAvatar();
        handleCloseDialogAvatar();
        router.refresh();
      }
    }
  };
  const handleCancelBgImg = () => {
    setSelectedBgImg(null);
  };
  const handleSaveBgImg = async () => {
    handleOpenBackdrop();
    console.log(selectedBgImg);
    const formData = new FormData();
    if (selectedBgImg) {
      formData.append("imageUrl", selectedBgImg! as File);
      formData.append("positionOfPic", "false");
      const response = await fetch(GLOBAL_URL + "/api/add-picture", {
        method: "POST",
        headers: { authorization: `Bearer ${session?.access_token}` },
        body: formData,
      });
      const data: ImageofPost = await response.json();
      console.log(data);
      if (data) {
        const updatedUserData: User = {
          access_token: session?.access_token,
          refresh_token: session?.refresh_token,
          user: {
            ...session?.user,
            backgroundImageUrl: data?.imageUrl,
          },
        };
        await sessionUpdate(updatedUserData);
        setDataProfile({
          ...session?.user,
          backgroundImageUrl: data?.imageUrl,
        });

        setSelectedBgImg(null);
        // setPreviewBgImg(data?.imageUrl);

        handleCloseBackdrop();
        handleClickAlertBgImg();
        handleCloseDialogAvatar();
        router.refresh();
      }
    }
  };
  const sendAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${GLOBAL_URL}/api/send-request-friend/${UserId}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending match:", error);
      return false;
    }
  };

  const sendMatchRequest = async (mentorId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(`${GLOBAL_URL}/api/send-match/${mentorId}`, {
        method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
        headers: {
          authorization: `Bearer ${session?.access_token}`,
        },
        // Các tùy chọn khác nếu cần
      });
      console.log(response);
      // Xử lý kết quả
      const data = await response.json();

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };
  const handleSendmatch = async (mentorId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await sendMatchRequest(mentorId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới

        setCheckRelationship(true);
        showSnackbar3();
        const relation: RelationNotificationDTO = {
          userAction: session.user.userId,
          userReceive: mentorId,
          createDate: new Date(),
          typeRelation: false,
        };
        stompClient.send(
          `${GLOBAL_SEND_FRIEND}/${mentorId}`,
          {},
          JSON.stringify(relation)
        );
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const socket = new SockJS(GLOBAL_URL + "/friend");
  const stompClient = Stomp.over(socket);
  const [snackbar3Open, setSnackbar3Open] = useState(false);
  const [checkRelationship, setCheckRelationship] = useState(false);
  const showSnackbar3 = () => {
    setSnackbar3Open(true);
    setTimeout(() => setSnackbar3Open(false), 10000);
  };
  const handsenddAddfriend = async (UserId: string) => {
    try {
      const apiResult = await sendAddfriend(UserId);
      console.log("test Result: " + apiResult);
      if (apiResult === true) {
        setCheckRelationship(true);
        showSnackbar3();

        const relation: RelationNotificationDTO = {
          userAction: session.user.userId,
          userReceive: UserId,
          createDate: new Date(),
          typeRelation: false,
        };
        stompClient.send(
          `${GLOBAL_SEND_FRIEND}/${UserId}`,
          {},
          JSON.stringify(relation)
        );
        // console.log(listUserSuitable);
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [snackbar5Open, setSnackbar5Open] = useState(false);
  const showSnackbar2 = () => {
    setSnackbar2Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };
  const showSnackbar5 = () => {
    setSnackbar5Open(true);
    setTimeout(() => setSnackbar5Open(false), 10000);
  };

  const refusedAddfriend = async (
    UserId: string,
    status: number
  ): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-request-friend/${UserId}?status=${status}`,
        {
          method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
          // Các tùy chọn khác nếu cần
        }
      );
      console.log(response);
      // Xử lý kết quả
      const data = await response.json();

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };
  const handlerefusedAddfriend = async (
    UserId: string,
    type: boolean,
    status: number
  ) => {
    try {
      const apiResult = await refusedAddfriend(UserId, status);

      console.log("test Result" + apiResult);
      if (apiResult === true) {
        setCheckRelationship(false);
        if (type) {
          showSnackbar2();
        } else {
          showSnackbar5();
        }
      } else {
        console.log("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  useEffect(() => {
    setPreviewBgImg(dataProfile?.backgroundImageUrl);
    setCheckRelationship(
      dataProfile?.status == -1
        ? false
        : dataProfile?.status == 0
        ? false
        : true
    );
  }, [dataProfile]);

  const [openFriend, setOpenFriend] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggleFriend = () => {
    setOpenFriend((prevOpen) => !prevOpen);
  };

  const handleCloseFriend = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenFriend(false);
  };
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenFriend(false);
    } else if (event.key === "Escape") {
      setOpenFriend(false);
    }
  }

  // modal loading
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  //xử lý mở modal loading
  const handleClickOpenModalUpdate = () => {
    setOpenModalUpdate(true);
  };

  //xử lý đóng modal loading
  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);
  };
  return (
    <Box sx={{ flexGrow: 1, background: "#ffffff" }}>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openAlert.open}
        TransitionComponent={SlideTransition}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="success"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          {openAlert.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          width: "100%",
          height: "250px",
          backgroundImage: "linear-gradient(#6FA702, #fff)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "250px",
            backgroundImage: "linear-gradient(#6FA702, #fff)",
            position: "relative",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0px 0px 10px 10px",
            },
          }}
        >
          {previewBgImg && <img src={previewBgImg} />}

          {!searchId && (
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "auto", sm: "12px" },
                top: { xs: "12px", sm: "auto" },
                right: "12px",
              }}
            >
              {!selectedBgImg && (
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<EditIcon />}
                  sx={{
                    backgroundColor: "white",
                    boxShadow: "none",
                    color: "#453c3c",
                    "&:hover": {
                      backgroundColor: "#cfcbcb",
                      outline: "none",
                      border: "none",
                    },
                  }}
                >
                  <VisuallyHiddenInput
                    type="file"
                    onChange={onSelectBgImg}
                    accept="image/*"
                  />
                  Thay đổi ảnh bìa
                </Button>
              )}
              {selectedBgImg && (
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      mx: 1,
                      bgcolor: "#787676",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#787878",
                        boxShadow: "none",
                      },
                      boxShadow: "none",
                    }}
                    onClick={handleCancelBgImg}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ mx: 1 }}
                    color="primary"
                    onClick={handleSaveBgImg}
                  >
                    Lưu
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          margin: "auto",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" },
          transform: { xs: "translateY(-30px)", md: "translateY(-20px)" },
          paddingBottom: "12px",
          width: {
            xs: "98%",
            sm: "95%",
            md: "90%",
            lg: "80%",
            xl: "70%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: { xs: "center", sm: "center" },
            "& img": { width: "125px", height: "125px", borderRadius: "50%" },
          }}
        >
          <Button
            color="primary"
            tabIndex={-1}
            sx={{ width: "125px", height: "125px", borderRadius: "50%" }}
            onClick={handleClickOpenDialogAvatar}
          >
            <img
              id="Profile_images"
              src={`${
                dataProfile?.profileImageUrl
                  ? dataProfile?.profileImageUrl
                  : "/profile/user.jpg"
              }`}
            />
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "12px",
              // marginTop: "18px",
              justifyContent: { xs: "center", sm: "flex-start" },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Typography
              component={"h1"}
              sx={{ fontWeight: "bold", fontSize: "24px" }}
            >
              {deleteSpace(fullname)}
              {dataProfile?.role?.roleName == "mentor" ? (
                <VerifiedIcon sx={{ color: "blue", marginLeft: "4px" }} />
              ) : (
                ""
              )}
            </Typography>
            {/* <Typography component={"p"}>1.2K Friends </Typography> */}
          </Box>
        </Box>
        {searchId &&
        (dataProfile?.status == -1 ||
          dataProfile?.status == 0 ||
          dataProfile?.status == 2) ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!checkRelationship && (
              <Button
                color="primary"
                variant="outlined"
                onClick={() =>
                  dataProfile?.role?.roleName == "user"
                    ? handsenddAddfriend(dataProfile?.userId!)
                    : handleSendmatch(dataProfile?.userId!)
                }
              >
                {dataProfile?.role?.roleName == "user"
                  ? " Thêm bạn bè"
                  : "Nhờ hỗ trợ"}
              </Button>
            )}
            {checkRelationship && (
              <Button
                color="primary"
                variant="outlined"
                onClick={() =>
                  handlerefusedAddfriend(dataProfile?.userId, false, 0)
                }
              >
                {dataProfile?.role?.roleName == "user"
                  ? "Hủy kết bạn"
                  : "Không nhờ hỗ trợ"}
              </Button>
            )}
          </Box>
        ) : (
          searchId &&
          (dataProfile?.status == 1 || dataProfile?.status == 3) && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!checkRelationship && (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => handsenddAddfriend(dataProfile?.userId!)}
                >
                  Thêm bạn bè
                </Button>
              )}
              {checkRelationship && (
                <Button
                  color="primary"
                  variant="outlined"
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={openFriend ? "composition-menu" : undefined}
                  aria-expanded={openFriend ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggleFriend}
                >
                  {dataProfile?.role?.roleName == "user" ? " Bạn bè" : "Mentor"}
                </Button>
              )}

              <Popper
                open={openFriend}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "left top"
                          : "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleCloseFriend}>
                        <MenuList
                          autoFocusItem={openFriend}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem
                            onClick={(e) => {
                              handlerefusedAddfriend(
                                dataProfile?.userId,
                                true,
                                1
                              );
                              handleCloseFriend(e);
                            }}
                          >
                            {dataProfile?.role?.roleName == "user"
                              ? "Hủy kết bạn"
                              : "Không nhờ hỗ trợ"}
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          )
        )}
      </Box>
      <Snackbar
        open={snackbar5Open}
        message="Hủy gửi lời mời kết bạn!"
        autoHideDuration={3000}
        onClose={() => setSnackbar5Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar2Open}
        message="Hủy kết bạn !"
        autoHideDuration={3000}
        onClose={() => setSnackbar2Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar3Open}
        message="Gừi lời mời kết bạn thành công!"
        autoHideDuration={3000}
        onClose={() => setSnackbar3Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Box
        sx={{
          width: "100%",
          "& .css-1phy807": {
            paddingY: 0,
          },
        }}
      >
        <Box
          className="123123"
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            maxwidth: "1000px",
            borderColor: "divider",
            margin: "auto",
            width: {
              xs: "98%",
              sm: "95%",
              md: "90%",
              lg: "80%",
              xl: "70%",
            },
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Bài viết" {...a11yProps(0)} />
            <Tab label="Giới thiệu" {...a11yProps(1)} />
            <Tab label="Ảnh" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#FBFCFE",
              padding: "20px 0px",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "98%",
                  sm: "95%",
                  md: "90%",
                  lg: "80%",
                  xl: "70%",
                },
                maxWidth: "1000px",
                margin: " auto",
                display: " grid",
                gridTemplateColumns: { xs: "1fr", sm: " 2fr 3fr" },
                gridColumnGap: " 15px",
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    padding: "10px",
                    boxShadow: "0px 1px 2px #3335",
                    backgroundColor: "#fff",
                    marginBottom: "15px",
                  }}
                >
                  <Typography
                    component={"h4"}
                    sx={{
                      fontSize: "18px",
                      color: "#000",
                      fontWeight: "bold",
                      marginBottom: "16px",
                    }}
                  >
                    Thông tin người dùng
                  </Typography>

                  <Box
                    sx={{
                      width: "100%",
                      paddingX: "16px",
                      display: "flex",
                    }}
                  >
                    <Typography
                      component={"p"}
                      sx={{
                        textWrap: "nowrap",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Địa chỉ:
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        marginLeft: "6px",
                        fontSize: { xs: "16px", sm: "12px", md: "16px" },
                      }}
                    >
                      {dataProfile?.ward ? dataProfile?.ward : ""}
                      {dataProfile?.district
                        ? `, ${dataProfile?.district}`
                        : ""}
                      {dataProfile?.city ? `, ${dataProfile?.city}` : ""}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      marginTop: "16px",
                      paddingX: "16px",
                    }}
                  >
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Quan tâm
                    </Typography>
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "11px",
                      }}
                    >
                      (sắp xếp theo độ ưu tiên giảm dần)
                    </Typography>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        borderTop: "1px solid gray",
                      }}
                    >
                      {demandOfUserLogin &&
                        demandOfUserLogin?.map((demandOfUser, index) => (
                          <ListItem key={index} sx={{ paddingX: "0" }}>
                            <Typography sx={{ marginRight: "6px" }}>
                              {`${index + 1}. `}
                            </Typography>
                            <ListItemText
                              primary={demandOfUser?.programingLanguage}
                            />

                            {demandOfUserLogin?.length > 3
                              ? index < 3 && (
                                  // <Avatar>
                                  <Image
                                    src="/priority.png"
                                    width={20}
                                    height={20}
                                    alt="Ưu tiên"
                                  />
                                  // </Avatar>
                                )
                              : index < 1 && (
                                  // <Avatar>
                                  <Image
                                    src="/priority.png"
                                    width={20}
                                    height={20}
                                    alt="Ưu tiên"
                                  />
                                  // </Avatar>
                                )}
                          </ListItem>
                        ))}
                    </List>
                  </Box>

                  {!searchId && (
                    <Button
                      variant="outlined"
                      sx={{
                        width: "100%",
                        fontWeight: "bold",
                        color: "#000",
                        marginTop: "16px",
                      }}
                      onClick={handleOpen}
                    >
                      Cập nhật thông tin
                    </Button>
                  )}
                  <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                  >
                    <DialogTitle
                      id="responsive-dialog-title"
                      sx={{
                        color: "#293145",
                        fontSize: { xs: 18, sm: 24 },
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#293145",
                          fontWeight: "bold",
                          fontSize: { xs: 18, sm: 24 },
                        }}
                      >
                        Cập nhật thông tin cá nhân
                      </Typography>
                      <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                          // position: "absolute",
                          // right: 8,
                          // top: 8,
                          color: (theme) => theme.palette.grey[500],
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>

                    <Box sx={{ padding: "0 24px" }}>
                      <Divider />
                    </Box>
                    <DialogContent sx={{ paddingY: "12px" }}>
                      <Box
                        sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}
                      >
                        Thông tin chung
                      </Box>
                      <Grid
                        columns={24}
                        container
                        spacing={2}
                        sx={{
                          paddingLeft: "0 !important",
                        }}
                      >
                        <Grid
                          item
                          xs={24}
                          md={8}
                          sx={{
                            paddingTop: {
                              xs: "0 !important",
                              md: "16px !important",
                            },
                          }}
                        >
                          <TextField
                            onChange={(e) => handleFirstName(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="first-name"
                            label="Họ"
                            name="first-name"
                            autoComplete="new-first-name"
                            autoFocus
                            value={data?.firstName}
                            error={errorFirstName}
                            helperText={messageFirstName}
                            sx={{
                              marginBottom: "0",
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={24}
                          md={8}
                          sx={{
                            paddingTop: {
                              xs: "0 !important",
                              md: "16px !important",
                            },
                          }}
                        >
                          <TextField
                            onChange={(e) => handleMiddleName(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="middle-name"
                            label="Tên đệm"
                            name="middle-name"
                            autoComplete="new-middle-name"
                            autoFocus
                            value={data?.middleName}
                            sx={{ marginBottom: "0" }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={24}
                          md={8}
                          sx={{
                            paddingTop: {
                              xs: "0 !important",
                              md: "16px !important",
                            },
                          }}
                        >
                          <TextField
                            onChange={(e) => handleLastName(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="last-name"
                            label="Tên"
                            name="last-name"
                            autoComplete="new-last-name"
                            autoFocus
                            value={data?.lastName}
                            error={errorLastName}
                            helperText={messageLastName}
                            sx={{ marginBottom: "0" }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        columns={24}
                        container
                        spacing={2}
                        sx={{
                          marginTop: "auto",
                          // paddingLeft: "0 !important",
                          // paddingTop: "0 !important",
                        }}
                      >
                        <Grid
                          item
                          xs={24}
                          md={12}
                          sx={{
                            paddingTop: {
                              xs: "16px !important",
                              md: "0 !important",
                            },
                          }}
                        >
                          <TextField
                            onChange={(e) => handleDateOfBirth(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="date"
                            id="date-of-birth"
                            label="Ngày sinh"
                            name="date-of-birth"
                            autoComplete="new-date-of-birth"
                            autoFocus
                            value={formatBirthDay(data?.birthday)}
                            error={errorDateOfBirth}
                            helperText={messageDateOfBirth}
                            sx={{
                              marginBottom: "0",
                              "& input": {
                                paddingLeft: `${
                                  data?.birthday ? "14px" : "100px"
                                }`,
                                "&:focus": {
                                  paddingLeft: "14px",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={24} md={12}>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Gender
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              value={data?.gender}
                              onChange={(e) => {
                                handleGender(+e.target.value);
                              }}
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="Nam"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="Nữ"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Box sx={{ padding: "12px 0" }}>
                        <Divider />
                      </Box>
                      <KnowledgeSign
                        programingLanguage={programingLanguage}
                        role={data.role}
                        handleListDemandOfUser={handleListDemandOfUser}
                        handleListSkillOfUser={handleListSkillOfUser}
                        data={data}
                        errorDemand={errorDemand}
                        messageDemand={messageDemand}
                      />
                      <Box sx={{ padding: "16px 0" }}>
                        <Divider />
                      </Box>
                      <Box
                        sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }}
                      >
                        Địa chỉ
                      </Box>
                      <Grid
                        container
                        spacing={2}
                        sx={{ paddingLeft: "0 !important", marginTop: "auto" }}
                      >
                        <Grid item xs={24}>
                          <Autocomplete
                            id="country-select-demo"
                            // sx={{ width: 300 }}
                            options={provinces || []}
                            autoHighlight
                            getOptionLabel={(province) =>
                              province?.province_name
                            }
                            value={provinces.find(
                              (province) =>
                                province?.province_name === data?.city
                            )}
                            onChange={(event, newValue) => {
                              handleCity(newValue!);
                              setCity(newValue!);
                            }}
                            renderOption={(props, province) => (
                              <Box component="li" {...props}>
                                {province?.province_name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Chọn tỉnh/TP"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: "new-password",
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={24}>
                          <Autocomplete
                            id="district-select-demo"
                            // sx={{ width: 300 }}
                            options={districts || []}
                            autoHighlight
                            getOptionLabel={(district) =>
                              district.district_name
                            }
                            value={
                              districts.length > 0
                                ? districts?.find(
                                    (district) =>
                                      district.district_name === data?.district
                                  )
                                : null
                            }
                            onChange={(event, newValue) => {
                              handleDistrict(newValue!);
                              setDistrict(newValue!);
                            }}
                            renderOption={(props, district) => (
                              <Box component="li" {...props}>
                                {district.district_name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Chọn Quận/Huyện"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: "new-password",
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={24}>
                          <Autocomplete
                            id="district-select-demo"
                            // sx={{ width: 300 }}
                            options={wards || []}
                            autoHighlight
                            getOptionLabel={(ward) => ward.ward_name}
                            value={
                              wards.length > 0
                                ? wards.find(
                                    (ward) => ward.ward_name === data?.ward
                                  )
                                : null
                            }
                            onChange={(event, newValue) => {
                              handleWard(newValue!);
                            }}
                            renderOption={(props, ward) => (
                              <Box component="li" {...props}>
                                {ward.ward_name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Chọn Xã/Phường/TT"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: "new-password",
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ paddingTop: " 16px" }}>
                        <Divider />
                      </Box>
                    </DialogContent>
                    <DialogActions sx={{ marginRight: "16px" }}>
                      <Button
                        autoFocus
                        variant="outlined"
                        color="error"
                        onClick={handleClose}
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={handleUpdateProfile}
                        autoFocus
                      >
                        Lưu lại
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>

                <Box
                  sx={{
                    borderRadius: "5px",
                    boxShadow: "0px 1px 2px #3335",
                    backgroundColor: "#fff",
                    padding: "10px",
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "16px",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    Hình ảnh
                  </Box>

                  <Box
                    sx={{
                      fontSize: "14px",
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      "& a": { textDecoration: "none", color: "#1771E6" },
                      "&hover": { textDecoration: "underline" },
                    }}
                  >
                    <a href="#">Xem tất cả</a>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridColumnGap: "3px",
                      padding: "10px 0px 0px 0px",
                    }}
                  >
                    <Box
                      sx={{
                        "& img": {
                          width: "100%",
                          height: "80px",
                          cursor: "pointer",
                          objectFit: "cover",
                          borderRadius: "5px",
                        },
                      }}
                    >
                      {/* chưa set hình ảnh */}
                      <img src="/profile/cover-image.jpg" />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    borderRadius: "5px",
                    boxShadow: "0px 1px 2px #3335",
                    backgroundColor: "#fff",
                    padding: "10px",
                    marginBottom: "15px",
                    position: "relative",
                    "& p": {
                      fontSize: "14px",
                      color: "#3339",
                      marginTop: "5px",
                    },
                  }}
                >
                  <span>
                    Friends <br />
                    <p>
                      <span> 3641 </span>
                      Friends
                    </p>
                  </span>

                  <Box
                    sx={{
                      fontSize: "14px",
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      "& a": { textDecoration: "none", color: "#1771E6" },
                      "&hover": { textDecoration: "underline" },
                    }}
                  >
                    <a href="#">Xem tất cả</a>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridColumnGap: "3px",
                      padding: "10px 0px 0px 0px",
                    }}
                  >
                    <Box
                      sx={{
                        "& img": {
                          width: "100%",
                          height: "80px",
                          cursor: "pointer",
                          objectFit: "cover",
                          borderRadius: "5px",
                        },
                        "& a": {
                          textDecoration: "none",
                          color: "#333",
                          "&hover": { textDecoration: "underline" },
                        },
                      }}
                    >
                      <img src="/profile/cover-image.jpg" alt="cover-image" />
                      <p>
                        <a href="#">Example</a>
                      </p>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  overflow: "hidden",
                }}
              >
                <Box>
                  <Box>
                    {dataProfile && (
                      <PostProfile
                        sessionGuest={dataProfile}
                        session={session}
                        profile={url}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#F0F2F5",
              padding: "20px 0px",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "98%",
                  sm: "95%",
                  md: "90%",
                  lg: "80%",
                  xl: "70%",
                },
                maxWidth: "1000px",
                margin: " auto",
                display: " grid",
                gridTemplateColumns: { xs: "1fr", sm: " 2fr 3fr" },
                gridColumnGap: " 15px",
              }}
            >
              About
            </Box>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#F0F2F5",
              padding: "20px 0px",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "98%",
                  sm: "95%",
                  md: "90%",
                  lg: "80%",
                  xl: "70%",
                },
                maxWidth: "1000px",
                margin: " auto",
                display: " grid",
                gridTemplateColumns: { xs: "1fr", sm: " 2fr 3fr" },
                gridColumnGap: " 15px",
              }}
            >
              Media
            </Box>
          </Box>
        </CustomTabPanel>{" "}
        <CustomTabPanel value={value} index={3}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#F0F2F5",
              padding: "20px 0px",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "98%",
                  sm: "95%",
                  md: "90%",
                  lg: "80%",
                  xl: "70%",
                },
                maxWidth: "1000px",
                margin: " auto",
                display: " grid",
                gridTemplateColumns: { xs: "1fr", sm: " 2fr 3fr" },
                gridColumnGap: " 15px",
              }}
            >
              Like
            </Box>
          </Box>
        </CustomTabPanel>
      </Box>
      <BootstrapDialog
        onClose={handleCloseDialogAvatar}
        aria-labelledby="customized-dialog-title"
        open={openDialogAvatar}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, fontWeight: "bold" }}
          id="customized-dialog-title"
        >
          Chọn ảnh đại diện
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialogAvatar}
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
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Box
              sx={{
                "& img": {
                  width: "225px",
                  height: "225px",
                  borderRadius: "50%",
                  border: "1px solid gray",
                },
              }}
            >
              <img id="Profile_images" src={`${preview}`} />
            </Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddPhotoAlternateIcon />}
            >
              Tải ảnh lên
              <VisuallyHiddenInput
                type="file"
                onChange={onSelectFile}
                accept="image/*"
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveAvatar}
            disabled={selectedFile == null ? true : false}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <ProcessingLoading open={openModalUpdate} textContent="Đang cập nhật" />
    </Box>
  );
};
export default HomeProfile;
