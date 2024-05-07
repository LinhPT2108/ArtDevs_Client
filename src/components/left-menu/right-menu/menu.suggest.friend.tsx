"use client";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  Stack,
} from "@mui/material";
import { useState } from "react";
import useSWR, { SWRResponse } from "swr";
const MenuSuggestFriend = ({ session }: { session: User }) => {
  const fetchData = async (url: string) => {
    return await sendRequest<any>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
    });
  };
  const { data, error, isLoading }: SWRResponse<any, any> = useSWR(
    GLOBAL_URL + "/api/get-userOfDemand",
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  const sendAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/send-request-friend/${UserId}`,
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

  const handleSendAddFriend = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await sendAddfriend(UserId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        // showSnackbar();
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };

  console.log("check dataSuggest: ", data);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 250,
      }}
    >
      <List
        sx={{
          width: "100%",
          bgcolor: "#293145",
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
            Gợi ý kết bạn
          </ListSubheader>
        }
      >
        {
          //@ts-ignore
          !data?.statusCode &&
            //@ts-ignore
            data?.map((item, index) => {
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
                  className={`${index < data?.length - 1 ? "border-b" : ""}`}
                >
                  <ListItemButton
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
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      {item.profileImageUrl}
                    </ListItemIcon>
                    <ListItemText primary={item.fullname} />
                  </ListItemButton>
                  <Stack
                    direction="row"
                    spacing={0}
                    className="flex min-[1023px]:pl-3 justify-center min-[1023px]:justify-start"
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleSendAddFriend(item.id)}
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
                      Thêm bạn bè
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "30px",
                        backgroundColor: "#eeeeee",
                        color: "#4d3869",
                        border: "none",
                        marginLeft: "4px",
                        width: "20px",
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
                      Xóa
                    </Button>
                  </Stack>
                </Box>
              );
            })
        }
      </List>
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
    </Box>
  );
};
export default MenuSuggestFriend;
