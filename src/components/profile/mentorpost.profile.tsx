import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockIcon from "@mui/icons-material/Lock";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { sendRequest } from "../utils/api";
import useSWR, { SWRResponse } from "swr";
import { CubeSpan } from "../utils/component.global";
import { formatDateString } from "../utils/utils";
import { GLOBAL_URL } from "../utils/veriable.global";
const PostMentorProfile = ({
  data,
  fullname,
}: {
  data: MentorInfor;
  fullname: string;
}) => {
  const fetchData = async (url: string) => {
    return await sendRequest<Post[]>({
      url: url,
      method: "GET",
      queryParams: { page: 0 },
    });
  };
  const {
    data: ListPost,
    error,
    isLoading,
  }: SWRResponse<Post[], any> = useSWR(
    `${GLOBAL_URL}/api/post-by-mentor-logged/${data.userId}`,
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  console.log("check ListPost", ListPost);
  console.log("data", `${GLOBAL_URL}/api/post-by-mentor-logged/${data.userId}`);
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
      {
        //@ts-ignore
        ListPost &&
          ListPost?.map((item, index) => (
            <Box
              key={index}
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
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 7fr",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    // width: "36px",
                    // height: "36px",
                    borderRadius: "50%",
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
                  <a href="#">
                    <img
                      src={`${
                        data?.profilePicUrl
                          ? data?.profilePicUrl
                          : "/profile/user.jpg"
                      }`}
                    />
                  </a>
                </Box>
                <Box
                  sx={{
                    position: "relative",
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
                    {fullname}
                  </Typography>
                  <Box
                    sx={{
                      color: "#3339",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LockIcon sx={{ fontSize: "18px" }} />
                    <Typography
                      component={"span"}
                      sx={{ textDecoration: "none", marginLeft: "6px" }}
                    >
                      {formatDateString(item?.time)}
                    </Typography>
                  </Box>

                  <Typography
                    component={"p"}
                    sx={{
                      position: "absolute",
                      top: "40%",
                      transform: "translateY(-50%) rotate(90deg)",
                      right: "10px",
                      width: "35px",
                      height: "35px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                      color: "#333",
                      padding: "5px",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.2s linear",
                      "&:hover": {
                        backgroundColor: "#E4E6E9",
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
                {item?.content}
              </Box>

              <Box
                sx={{
                  backgroundColor: "#fff",
                  color: "#fff",
                  width: "100%",
                  height: `${
                    item?.listImageofPost?.length > 1 ? "350px" : "auto"
                  }`,
                  boxSizing: "border-box",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: `${
                    item?.listImageofPost?.length == 1 ? "1fr" : "1fr 1fr"
                  }`,
                  gridColumnGap: `${
                    item?.listImageofPost?.length > 1 ? "3px" : "0"
                  }`,
                }}
              >
                {item?.listImageofPost.length < 3 ? (
                  item?.listImageofPost?.map((item, index) => (
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
                ) : item?.listImageofPost.length == 3 ? (
                  <>
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
                      <img
                        src={item?.listImageofPost[0].imageUrl}
                        alt="photo"
                      />
                    </Box>
                    <Box>
                      {item?.listImageofPost?.map((item, index) => (
                        <>
                          {index > 0 ? (
                            <Box
                              key={index}
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
                            <></>
                          )}
                        </>
                      ))}
                    </Box>
                  </>
                ) : item?.listImageofPost.length == 4 ? (
                  item?.listImageofPost?.map((item, index) => (
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
                  item?.listImageofPost?.map((i, index) => (
                    <>
                      {index < 3 ? (
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
                          <img src={i.imageUrl} alt="photo" />
                        </Box>
                      ) : (
                        <>
                          {index == 4 ? (
                            <Box
                              key={index}
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
                                {item?.listImageofPost?.length - 4}
                              </Box>
                            </Box>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </>
                  ))
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
                      11
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Typography
                      component={"p"}
                      sx={{
                        color: "#3339",
                      }}
                    >
                      1 Comments
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
                  <ThumbUpOffAltIcon />
                  <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                    Like
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
                >
                  <CommentIcon />
                  <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                    Comment
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
                >
                  <ShareIcon />
                  <Typography component={"span"} sx={{ marginLeft: "5px" }}>
                    Share
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))

        // : (
        //   <Box>"Chưa có bài viết!"</Box>
        // )
      }
      {ListPost?.length == 0 ? <Box>"Chưa có bài viết!"</Box> : ""}
    </>
  );
};
export default PostMentorProfile;
