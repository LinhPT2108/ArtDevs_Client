"use client";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Grid, ListItemIcon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import React from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { CubeSpan } from "../utils/component.global";
import { formatDateString } from "../utils/utils";
import { GLOBAL_URL } from "../utils/veriable.global";

const options = ["Chỉ mình tôi", "Công khai", "Bạn bè"];

const PostProfile = ({
  session,
  fullname,
}: {
  session: User;
  fullname: string;
}) => {
  //tạo biến xử lý modal report
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );

  //get data bài đăng
  const fetchData = async (url: string) => {
    return await sendRequest<Post[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: { page: 0 },
    });
  };
  const { data, error, isLoading, mutate }: SWRResponse<Post[], any> = useSWR(
    GLOBAL_URL + "/api/post-by-user-logged",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  //xử lý thao tác xóa modal report
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(id);
  };
  const handleCloses = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };
  const handleDeletePost = async (postId: string | null) => {
    console.log(">>> check postID: ", postId);
    let res = await sendRequest<Post>({
      url: GLOBAL_URL + `/api/post/${postId}/hidden`,
      method: "PUT",
    });
    if (res?.postId) {
      const previousData = data!;
      const index = previousData.findIndex((item) => item.postId === postId);

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

  const handleClose = (index: number) => () => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };

  console.log(">>> check data: ", data);

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
        !data?.statusCode &&
          data?.map((item, index) => (
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
                      {session?.user?.userId === item?.userPost?.userId && (
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
                                item?.privacyPostDetails?.namePrivacy}
                            </ListItemButton>
                          </List>
                          <Menu
                            id={`lock-menu-${index}`}
                            anchorEl={anchorEls[index]}
                            open={Boolean(anchorEls[index])}
                            onClose={handleClose(index)}
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
                                  item?.postId
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
                        {formatDateString(item?.time)}
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
                    onClick={(event) => handleClick(event, item.postId)}
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
                    id="account-menu"
                    open={Boolean(anchorEl)}
                    onClose={handleCloses}
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
                  </Menu>
                </Box>
              </Box>
              <Link href={`/post?id=${item.postId}`}>
                <Box sx={{ marginLeft: "12px", marginBottom: "12px" }}>
                  {item?.content}
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
                          src={item?.listImageofPost[0].imageUrl}
                          alt="photo"
                        />
                      </Box>
                      <Box>
                        {item?.listImageofPost?.map((item, index) => (
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
                                  {item?.listImageofPost?.length - 4}
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
      }
    </>
  );
};
export default PostProfile;
