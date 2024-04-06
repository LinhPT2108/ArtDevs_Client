"use client";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedIcon from "@mui/icons-material/Feed";
import {
  Avatar,
  Box,
  Button,
  CardActions,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";
import { calculateTimeDifference } from "@/components/utils/utils";
import {
  GLOBAL_BG,
  GLOBAL_BG_NAV,
  GLOBAL_BG_NOTIFY,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_BLACK,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IPros {
  session: User;
}

const UserAccept = ({ session }: IPros) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  var router = useRouter();
  const fetchData = async (url: string) => {
    return await sendRequest<Relation[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<Relation[], any> = useSWR(
    "http://localhost:8080/api/get-request-friend",
    fetchData,
    {
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  const acceptAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/accept-friend/${UserId}`,
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

  const handleacceptAddfriend = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await acceptAddfriend(UserId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        showSnackbar();
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const refusedAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-request-friend/${UserId}`,
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

  const handlerefusedAddfriend = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await refusedAddfriend(UserId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        showSnackbar2();
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };

  const showSnackbar2 = () => {
    setSnackbar2Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };
  const handleRedirect = (id: string) => {
    router.push(`/mentor/${id}`);
  };
  const handleRedirectFriend = () => {
    router.push(`/friend`);
  };
  // console.log("check data>>", data);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
        bgcolor: GLOBAL_BG,
        borderRadius: "12px",
        boxShadow: GLOBAL_BOXSHADOW,
      }}
    >
      <List
        sx={{
          width: "100%",
          borderRadius: "12px",
          color: GLOBAL_COLOR_BLACK,
          marginTop: "12px",
          "& p": {
            color: GLOBAL_COLOR_BLACK,
          },
        }}
        className="rounded-md"
        component="nav"
        aria-label="main mailbox folders"
        subheader={
          <ListSubheader
            sx={{
              bgcolor: GLOBAL_BG,
              color: GLOBAL_COLOR_BLACK,
              fontWeight: "bold",
              zIndex: "0",
              position: "relative",
              borderRadius: "12px",
              "@media (min-width: 900px)": {
                "&": {
                  fontSize: "12px",
                },
              },
              "@media (min-width: 1023px)": {
                "&": {
                  fontSize: "14px",
                },
              },
            }}
            component="div"
            id="nested-list-subheader"
          >
            Yêu cầu kết bạn
          </ListSubheader>
        }
      >
        <Divider />
        {data && data.length > 0 ? (
          data.slice(0, 4).map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  paddingBottom: "24px",
                  "& p": {
                    fontSize: { md: "10px", lg: "14px" },
                  },
                  "& span": {
                    fontSize: { md: "14px", lg: "16px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
                className={`${index < data.length - 1 ? "border-b" : ""}`}
              >
                <ListItemButton
                  onClick={() => handleRedirect(item.userAction.userId)}
                  sx={{ padding: "6px 12px", margin: " 0" }}
                  //   selected={selectedIndex === item.index}
                  //   onClick={(event) => handleListItemClick(event, item.index)}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      backgroundColor: `gray`,
                      minWidth: "40px",
                      marginRight: { md: "6px", lg: "12px" },
                      borderRadius: "100%",
                    }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={item.userAction.profilePicUrl || "/OIP.jpg"}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.userAction.fullname}
                    secondary={calculateTimeDifference(item?.timeRelation)}
                  />
                </ListItemButton>
                <Stack
                  direction="row"
                  spacing={0}
                  className="flex min-[1023px]:pl-3 justify-center min-[1023px]:justify-start"
                  sx={{
                    justifyContent: "space-evenly",
                    "& .cancel": {
                      backgroundColor: "#eeeeee",
                    },
                    "& .accept": {
                      backgroundColor: "#2e7d32",
                    },
                  }}
                >
                  <Button
                    className="accept"
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleacceptAddfriend(item?.userAction?.userId)
                    }
                    sx={{
                      borderRadius: "30px",
                    }}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    className="cancel"
                    variant="outlined"
                    onClick={() =>
                      handlerefusedAddfriend(item?.userAction?.userId)
                    }
                    sx={{
                      borderRadius: "30px",
                      backgroundColor: "#eeeeee",
                      color: "#4d3869",
                      border: "none",
                      marginLeft: "4px",
                      "&:hover": {
                        backgroundColor: "#c7c7c7",
                        outline: "none",
                        border: "none",
                      },
                    }}
                  >
                    Từ chối
                  </Button>
                </Stack>
              </Box>
            );
          })
        ) : (
          <Typography
            sx={{ margin: "12px 12px 0 12px", color: GLOBAL_COLOR_BLACK }}
          >
            Chưa có lời mời kết bạn !
          </Typography>
        )}
      </List>
      <CardActions className="justify-center">
        <Button
          size="small"
          variant="contained"
          onClick={() => handleRedirectFriend()}
          sx={{
            borderRadius: "30px",
            backgroundColor: "#eeeeee",
            color: "#4d3869",
            display: data && data.length > 3 ? "flex" : "none",
            "&:hover": {
              backgroundColor: "#ffffff",
              outline: "none",
              border: "none",
            },
          }}
        >
          Tất cả yêu cầu
        </Button>
      </CardActions>
      <Snackbar
        open={snackbarOpen}
        message="Addfriend successfully!"
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        sx={{
          color: "white",
          backgroundColor: "#4CAF50",
        }}
      />
      <Snackbar
        open={snackbar2Open}
        message="Refused to make friends!"
        autoHideDuration={3000}
        onClose={() => setSnackbar2Open(false)}
        sx={{
          color: "black",
          backgroundColor: "##e60839",
        }}
      />
    </Box>
  );
};
export default UserAccept;
