"use client";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EditIcon from "@mui/icons-material/Edit";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import { Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import "../../style/style.css";
import { deleteSpace } from "../utils/utils";
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

const HomeProfile = ({ session }: { session: User }) => {
  const [value, setValue] = useState(0);
  const [editBio, setEditBio] = useState<boolean>(false);
  let firstName = session?.user?.firstName ? session?.user?.firstName : "";
  let middleName = session?.user?.middleName ? session?.user?.middleName : "";
  let lastName = session?.user?.lastName ? session?.user?.lastName : "";
  let fullname = firstName + " " + middleName + " " + lastName;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleEditBio = (value: boolean) => {
    setEditBio(value);
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
              session?.user?.profilePicUrl
                ? session?.user?.profilePicUrl
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
                    }}
                  >
                    Intro
                  </Typography>

                  <Typography
                    component={"p"}
                    sx={{ display: `${!editBio ? "block" : "none"}` }}
                  >
                    {deleteSpace(fullname)}
                  </Typography>
                  <Box sx={{ display: `${editBio ? "block" : "none"}` }}>
                    <TextField
                      fullWidth
                      hiddenLabel
                      id="filled-hidden-label-small"
                      value={deleteSpace(fullname)}
                      variant="filled"
                      size="small"
                      sx={{ "& input": { textAlign: "center" } }}
                    />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#333",
                        textAlign: "right",
                        padding: "3px",
                      }}
                    >
                      Tiểu sử bản thân
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <VpnLockIcon />
                        <Typography
                          component={"p"}
                          sx={{ marginLeft: "2px", fontSize: "12px" }}
                        >
                          Public
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "0px",
                          textAlign: "right",
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            margin: "0",
                            fontSize: "10px",
                            padding: "3px",
                            borderRadius: "3px",
                            width: "40px",
                          }}
                          onClick={() => {
                            handleEditBio(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            marginLeft: "2px",
                            fontSize: "10px",
                            padding: "3px",
                            borderRadius: "3px",
                          }}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      width: "100%",
                      fontWeight: "bold",
                      color: "#000",
                      margin: "12px 0",
                    }}
                    onClick={() => {
                      handleEditBio(true);
                    }}
                  >
                    Edit Bio
                  </Button>

                  <Box
                    sx={{
                      width: "100%",
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
                          fontSize: { xs: "13px", sm: "11px", md: "13px" },
                        }}
                      >
                        Tỉnh/TP
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
                        Quận/Huyện
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
                        Xã/Phường
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
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{
                      width: "100%",
                      fontWeight: "bold",
                      color: "#000",
                      margin: "12px 0",
                    }}
                  >
                    Edit Details
                  </Button>

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
                            marginTop: "16px",
                          }}
                        >
                          {item}
                        </Box>
                      ))}
                  </Box>
                  {session?.user?.listDemandOfUser &&
                  session?.user?.listDemandOfUser?.length > 0 ? (
                    <Button
                      variant="outlined"
                      sx={{
                        width: "100%",
                        fontWeight: "bold",
                        color: "#000",
                        marginTop: "16px",
                      }}
                    >
                      Edit Demand
                    </Button>
                  ) : (
                    ""
                  )}
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
                  maxHeight: { xs: "auto", sm: "700px" },
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    maxHeight: { xs: "auto", sm: "700px" },
                    overflowY: "scroll",
                    "::-webkit-scrollbar": {
                      width: "2px",
                    },
                    "::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "#888",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <Box>
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
                          display: "grid",
                          gridTemplateColumns: "1fr 7fr",
                          borderBottom: "1px solid #3333",
                          paddingBottom: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
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
                                session?.user?.profilePicUrl
                                  ? session?.user?.profilePicUrl
                                  : "/profile/user.jpg"
                              }`}
                            />
                          </a>
                        </Box>
                        <Box
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
                            What&apos;s on your mind?
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
                            <Typography
                              component={"span"}
                              sx={{ marginLeft: "6px" }}
                            >
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
                            <Typography
                              component={"span"}
                              sx={{ marginLeft: "6px" }}
                            >
                              Photo
                            </Typography>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <PostProfile session={session} fullname={fullname} />
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
