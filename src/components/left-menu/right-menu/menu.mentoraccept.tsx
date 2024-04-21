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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  Stack,
} from "@mui/material";
import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";
import { calculateTimeDifference } from "@/components/utils/utils";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IPros {
  session: User;
}

const MentorAccept = ({ session }: IPros) => {
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
    GLOBAL_URL + "/api/get-match-from-user",
    fetchData,
    {
      shouldRetryOnError: true, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  const acceptMatch = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(`${GLOBAL_URL}/api/accept-match/${UserId}`, {
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

  const handleacceptMatch = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await acceptMatch(UserId);

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

  const refusedacceptMatch = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-sendmatch/${UserId}`,
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

  const handrefusedacceptMatch = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await refusedacceptMatch(UserId);

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
  console.log("check data>>", data);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
        bgcolor: "#293145",
      }}
    >
      <List
        sx={{
          width: "100%",

          color: "white",
          marginTop: "12px",
          "& p": {
            color: "white",
          },
        }}
        className="rounded-md"
        component="nav"
        aria-label="main mailbox folders"
        subheader={
          <ListSubheader
            sx={{
              bgcolor: "#293145",
              color: "white",
              fontWeight: "bold",
              zIndex: "0",
              position: "relative",
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
            className="rounded-md"
          >
            Yêu cầu Match
          </ListSubheader>
        }
      >
        {data &&
          data.length &&
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
                      padding: "8px",
                      minWidth: "40px",
                      marginRight: { md: "6px", lg: "24px" },
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
                    primary={item.userAction.userId}
                    secondary={calculateTimeDifference(item?.timeRelation)}
                  />
                </ListItemButton>
                <Stack
                  direction="row"
                  spacing={0}
                  className="flex min-[1023px]:pl-3 justify-center min-[1023px]:justify-start"
                  sx={{
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleacceptMatch(item?.userAction?.userId)}
                    sx={{
                      borderRadius: "30px",

                      // "@media (min-width: 900px)": {
                      //   "&": {
                      //     fontSize: "10px",
                      //     paddingX: "4px",
                      //   },
                      // },
                      // "@media (min-width: 1023px)": {
                      //   "&": {
                      //     paddingX: "12px",
                      //   },
                      // },
                      // "@media (min-width: 1200px)": {
                      //   "&": {
                      //     fontSize: "14px",
                      //     paddingX: "16px",
                      //   },
                      // },
                    }}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handrefusedacceptMatch(item?.userAction?.userId)
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
                      // "@media (min-width: 900px)": {
                      //   "&": {
                      //     fontSize: "10px",
                      //     marginLeft: "4px",
                      //     paddingX: "10px",
                      //   },
                      // },
                      // "@media (min-width: 1200px)": {
                      //   "&": {
                      //     fontSize: "14px",
                      //     marginLeft: "8px",
                      //     paddingX: "16px",
                      //   },
                      // },
                    }}
                  >
                    Từ chối
                  </Button>
                </Stack>
              </Box>
            );
          })}
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
export default MentorAccept;
