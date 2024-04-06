"use client";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EditIcon from "@mui/icons-material/Edit";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import "../../style/style.css";
import KnowledgeSign from "../sign/sign-up/knowledge.sign";
import { sendRequest } from "../utils/api";
import { deleteSpace, formatBirthDay } from "../utils/utils";
import { GLOBAL_URL } from "../utils/veriable.global";
import PostProfile from "./post.profile";
import CloseIcon from "@mui/icons-material/Close";

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

interface IPros {
  session: User;
}

const HomeProfile = ({ session }: IPros) => {
  const [value, setValue] = useState(0);
  let firstName = session?.user?.firstName ? session?.user?.firstName : "";
  let middleName = session?.user?.middleName ? session?.user?.middleName : "";
  let lastName = session?.user?.lastName ? session?.user?.lastName : "";
  let fullname = firstName + " " + middleName + " " + lastName;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  console.log(">>> check session: ", session);
  //xử lý mở modal cập nhật
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState<boolean>(false);

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
  //xử lý cập nhật thông tin người dùng
  const [data, setData] = useState<UserLogin>(
    session?.user
    // {
    // lastName: session?.user?.lastName ? session?.user?.lastName : "",
    // middleName: session?.user?.middleName ? session?.user?.middleName : "",
    // firstName: session?.user?.firstName ? session?.user?.firstName : "",
    // email: session?.user?.email ? session?.user?.email : "",
    // password: session?.user?.password ? session?.user?.password : "",
    // birthday: session?.user?.birthday ? session?.user?.birthday : "",
    // gender: session?.user?.gender ? session?.user?.gender : 0,
    // city: session?.user?.city ? session?.user?.city : "",
    // district: session?.user?.district ? session?.user?.district : "",
    // ward: session?.user?.ward ? session?.user?.email : "",
    // role: session?.user?.role,
    // userId: session?.user?.userId ? session?.user?.userId : "",
    // username: session?.user?.username ? session?.user?.username : "",
    // isOnline: true,
    // listDemandOfUser: session?.user?.listDemandOfUser
    //   ? session?.user?.listDemandOfUser
    //   : [],
    // listSkillOfUser: session?.user?.listSkillOfUser
    //   ? session?.user?.listSkillOfUser
    //   : [],
    // }
  );
  const handleLastName = (value: string) => {
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
    setData((prevData) => ({
      ...prevData,
      firstName: value,
    }));
  };
  const handleDateOfBirth = (value: string) => {
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
        console.log(">>> check local: ", sessionStorage.getItem("userdto"));
        handleClose();
        // localStorage.setItem("user", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, background: "#ffffff" }}>
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
          <img src="/profile/cover-image.jpg" />

          <Box
            sx={{
              position: "absolute",
              bottom: { xs: "auto", sm: "12px" },
              top: { xs: "12px", sm: "auto" },
              right: "12px",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "white",
                cursor: "pointer",
                outline: "none",
                border: "none",
                color: "#453c3c",
                "&:hover": {
                  backgroundColor: "#cfcbcb",
                  outline: "none",
                  border: "none",
                },
              }}
            >
              <EditIcon />
              <Typography component={"p"} sx={{ marginLeft: "6px" }}>
                Edit Covar Photo
              </Typography>
            </Button>
          </Box>
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
            alignItems: { xs: "center", sm: "flex-end" },
            "& img": { width: "125px", height: "125px", borderRadius: "50%" },
          }}
        >
          <img
            id="Profile_images"
            src={`${
              session?.user?.profileImageUrl
                ? session?.user?.profileImageUrl
                : "/profile/user.jpg"
            }`}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "12px",
              justifyContent: { xs: "center", sm: "flex-start" },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Typography
              component={"h1"}
              sx={{ fontWeight: "bold", fontSize: "24px" }}
            >
              {deleteSpace(fullname)}
            </Typography>
            <Typography component={"p"}>1.2K Friends</Typography>
          </Box>
        </Box>
      </Box>

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
            <Tab label="Post" {...a11yProps(0)} />
            <Tab label="About" {...a11yProps(1)} />
            <Tab label="Media" {...a11yProps(2)} />
            <Tab label="Like" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
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
              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    boxShadow: "0px 1px 2px #3335",
                    backgroundColor: "#fff",
                    display: "grid",
                    gridTemplateColumns: "1fr 5fr",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <Box
                    sx={{
                      padding: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#1771E6",
                      width: "50px",
                      height: "50px",
                      color: "white",
                    }}
                  >
                    <VpnKeyIcon />
                  </Box>
                  <Box
                    sx={{
                      "& h3": {
                        fontSize: "15px",
                        color: "#333",
                        marginTop: "7px",
                        marginLeft: "10px",
                      },
                      "& a": {
                        textDecoration: "none",
                        fontSize: "13px",
                        marginLeft: "10px",
                        marginTop: "2px",
                        fontWeight: "bold",
                        color: "#1771E6",
                        "&hover": {
                          textDecoration: "underline",
                        },
                      },
                    }}
                  >
                    <h3>You locked your profile</h3>
                    <a href="#">Learn More</a>
                  </Box>
                </Box>

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
                    }}
                  >
                    <Typography
                      component={"p"}
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        borderBottom: "1px solid #80808061",
                      }}
                    >
                      Địa chỉ
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: "13px", sm: "11px", md: "13px" },
                        }}
                      >
                        Tỉnh/TP:
                      </Box>
                      <Typography
                        component={"p"}
                        sx={{
                          marginLeft: "6px",
                          fontWeight: "bold",
                          fontSize: { xs: "16px", sm: "12px", md: "16px" },
                        }}
                      >
                        {session?.user?.city ? session?.user?.city : ""}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: "13px", sm: "11px", md: "13px" },
                        }}
                      >
                        Quận/Huyện:
                      </Box>
                      <Typography
                        component={"p"}
                        sx={{
                          marginLeft: "6px",
                          fontWeight: "bold",
                          fontSize: { xs: "16px", sm: "12px", md: "16px" },
                        }}
                      >
                        {session?.user?.district ? session?.user?.district : ""}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: "13px", sm: "11px", md: "13px" },
                        }}
                      >
                        Xã/Phường:
                      </Box>
                      <Typography
                        component={"p"}
                        sx={{
                          marginLeft: "6px",
                          fontWeight: "bold",
                          fontSize: { xs: "16px", sm: "12px", md: "16px" },
                        }}
                      >
                        {session?.user?.ward ? session?.user?.ward : ""}
                      </Typography>
                    </Box>
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
                        borderBottom: "1px solid #80808061",
                      }}
                    >
                      Quan tâm
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {session?.user?.listDemandOfUser &&
                        session?.user?.listDemandOfUser?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              borderRadius: "20px",
                              border: "1px solid gray",
                              padding: "5px 16px",
                              marginTop: "8px",
                              marginX: "3px",
                            }}
                          >
                            {item}
                          </Box>
                        ))}
                    </Box>
                  </Box>

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
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="Khác"
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
                    <DialogActions>
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
                    <a href="#">
                      See All
                      <Typography
                        component={"p"}
                        sx={{
                          display: { xs: "inline", sm: "none", md: "inline" },
                          marginLeft: "6px",
                        }}
                      >
                        Photos
                      </Typography>
                    </a>
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
                    <a href="#">
                      See All
                      <Typography
                        component={"span"}
                        sx={{
                          display: { xs: "inline", sm: "none", md: "inline" },
                          color: "#1771E6",
                          marginLeft: "6px",
                        }}
                      >
                        Friends
                      </Typography>
                    </a>
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
                    <PostProfile
                      session={session}
                      profile="/post-by-user-logged"
                    />
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
    </Box>
  );
};
export default HomeProfile;
