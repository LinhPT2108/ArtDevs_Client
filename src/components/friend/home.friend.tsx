"use client";

import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { CubeSpan } from "../utils/component.global";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useDrawer } from "@/lib/custom.content";
import { Content } from "next/font/google";
import { GLOBAL_URL } from "../utils/veriable.global";
import { useState } from "react";
interface IPros {
  session: User;
}
const HomeFriend = ({ session }: IPros) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [snackbar3Open, setSnackbar3Open] = useState(false);
  const [snackbar4Open, setSnackbar4Open] = useState(false);
  const { drawerOpen } = useDrawer();

  let pageNumber: number = 0;

  const fetchDataUserAction = async (url: string) => {
    return await sendRequest<UserAction[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: {
        page: pageNumber,
      },
    });
  };
  const {
    data: listUserSuitable,
    error,
    isLoading,
  }: SWRResponse<UserAction[], any> = useSWR(
    "http://localhost:8080/api/get-listfriend-suitable",
    fetchDataUserAction,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  const fetchDataRelation = async (url: string) => {
    return await sendRequest<Relation[]>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: {
        page: 0,
      },
    });
  };
  const {
    data: listSendFriend,
    error: ErrorSendFriend,
    isLoading: loadingSendFriend,
  }: SWRResponse<Relation[], any> = useSWR(
    "http://localhost:8080/api/get-request-friend",
    fetchDataRelation,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  console.log("check list user Suitable home friend", listUserSuitable);
  console.log("check list sendfriend home friend", listSendFriend);
  //End Fetch Data

  // add friend

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

      // Xử lý kết quả
      const data = await response.json();

      return data; // Giả sử API trả về một trường success kiểu boolean
    } catch (error) {
      console.error("Error sending match:", error);
      return false; // Trả về false nếu có lỗi
    }
  };

  const handleAcceptAddfriend = async (UserId: string) => {
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
  //End Request Friend

  //Send add Friend
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

  const handsenddAddfriend = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await sendAddfriend(UserId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        showSnackbar3();
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const removeUserofListfriendSuitable = async (
    UserId: string
  ): Promise<boolean> => {
    try {
      // Thực hiện cuộc gọi API ở đây
      const response = await fetch(
        `${GLOBAL_URL}/api/remove-user-of-listfriend-suitable/${UserId}`,
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

  const handremoveUserofListfriendSuitable = async (UserId: string) => {
    try {
      // Gọi hàm thực hiện cuộc gọi API
      const apiResult = await removeUserofListfriendSuitable(UserId);

      console.log("test Result" + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        showSnackbar4();
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };
  //End add Friend

  //Snackbar
  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 10000);
  };

  const showSnackbar2 = () => {
    setSnackbar2Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };

  const showSnackbar3 = () => {
    setSnackbar3Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };
  const showSnackbar4 = () => {
    setSnackbar4Open(true);
    setTimeout(() => setSnackbar2Open(false), 10000);
  };
  //End Snack Bar

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
    <Box>
      <CardContent
        sx={{
          // Màu chữ
          fontSize: "32px", // Kích thước chữ
          fontWeight: "bold", // Độ đậm của chữ
          padding: "8px",
        }}
      >
        Friend Request
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        className="cube-"
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          {listSendFriend &&
            listSendFriend?.map((item) => (
              <Card
                sx={{
                  backgroundColor: "#c0c0d7",
                  marginTop: "24px",
                  marginLeft: "24px",
                  width: { xs: "230px" },

                  flexGrow: listSendFriend.length >= 12 ? 1 : "auto",
                }}
              >
                <CardMedia
                  sx={{ height: 300 }}
                  image={item.userAction.profilePicUrl || "/OIP.jpg"}
                  title="green iguana"
                />
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingY: "0",
                    marginTop: "16px",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      marginBottom: "0",
                    }}
                  >
                    {item.userAction.fullname}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleAcceptAddfriend(item?.userAction?.userId)
                    }
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
                </CardActions>
              </Card>
            ))}
        </Box>
      </Box>
      <CardActions className="justify-center">
        <Button
          size="large"
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "#eeeeee",
            color: "#4d3869",
            display: "flex",
            "&:hover": {
              backgroundColor: "#ffffff",
              outline: "none",
              border: "none",
            },
          }}
        >
          See more
        </Button>
      </CardActions>
      <hr></hr>
      <CardContent
        sx={{
          // Màu chữ
          fontSize: "32px", // Kích thước chữ
          fontWeight: "bold", // Độ đậm của chữ
          padding: "8px",
        }}
      >
        Prople you may know
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        className="cube-"
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          {listUserSuitable &&
            listUserSuitable?.map((item) => (
              <Card
                sx={{
                  backgroundColor: "#c0c0d7",
                  marginTop: "24px",
                  marginLeft: "24px",
                  width: { xs: "215px" },
                  flexGrow: listUserSuitable.length >= 12 ? 1 : "auto",
                }}
              >
                <CardMedia
                  sx={{ height: 300 }}
                  image={item.profilePicUrl || "/OIP.jpg"}
                  title="green iguana"
                />
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingY: "0",
                    marginTop: "16px",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      marginBottom: "0",
                    }}
                  >
                    {item.fullname}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handsenddAddfriend(item?.userId)}
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
                    Kết Bạn
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handremoveUserofListfriendSuitable(item?.userId)
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
                    Xóa
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Box>
      </Box>
      <CardActions className="justify-center">
        <Button
          size="large"
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "#eeeeee",
            color: "#4d3869",
            display: "flex",
            "&:hover": {
              backgroundColor: "#ffffff",
              outline: "none",
              border: "none",
            },
          }}
        >
          See more
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
      <Snackbar
        open={snackbar3Open}
        message="Send addfriend successfully!"
        autoHideDuration={3000}
        onClose={() => setSnackbar2Open(false)}
        sx={{
          color: "black",
          backgroundColor: "##e60839",
        }}
      />
      <Snackbar
        open={snackbar4Open}
        message="Remove Account of Suitable List Friend successfully!"
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

export default HomeFriend;
