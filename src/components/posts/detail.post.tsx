"use client";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import {
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { formatDateString } from "../utils/utils";
import { GLOBAL_URL } from "../utils/veriable.global";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const options = ["Công khai", "Chỉ mình tôi"];

const DetailPost = ({ session }: { session: User }) => {
  // lấy id
  let searchParams = useSearchParams();
  let postId = searchParams.get("id");
  const router = useRouter();
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
  const { data, error, isLoading }: SWRResponse<Post, any> = useSWR(
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
      </Container>
    </Box>
  );
};
export default DetailPost;
