"use client";

import { useDrawer } from "@/lib/custom.content";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useSWR, { SWRResponse, mutate } from "swr";
import { sendRequest } from "../utils/api";
import { CubeSpan } from "../utils/component.global";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_WHITE,
  GLOBAL_SEND_FRIEND,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useRouter } from "next/navigation";

interface IPros {
  session: User;
}

const HomeFriend = ({ session }: IPros) => {
  const socket = new SockJS(GLOBAL_URL + "/friend");
  const stompClient = Stomp.over(socket);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar2Open, setSnackbar2Open] = useState(false);
  const [snackbar3Open, setSnackbar3Open] = useState(false);
  const [snackbar4Open, setSnackbar4Open] = useState(false);
  const [snackbar5Open, setSnackbar5Open] = useState(false);

  const [listDataUserSuitable, setListDataUserSuitable] = useState<
    UserAction[]
  >([]);
  const [listDataSendFriend, setListDataSendFriend] = useState<Relation[]>([]);
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
    GLOBAL_URL + "/api/get-listfriend-suitable",
    fetchDataUserAction,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  useEffect(() => {
    if (listUserSuitable) {
      setListDataUserSuitable(listUserSuitable);
    }
  }, [listUserSuitable]);

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
    GLOBAL_URL + "/api/get-request-friend",
    fetchDataRelation,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  useEffect(() => {
    if (listSendFriend) {
      setListDataSendFriend(listSendFriend);
    }
  }, [listSendFriend]);

  // console.log("check list user Suitable home friend", listUserSuitable);
  // console.log("check list sendfriend home friend", listSendFriend);
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
      if (apiResult === true) {
        showSnackbar();
        const relation: RelationNotificationDTO = {
          userAction: session.user.userId,
          userReceive: UserId,
          createDate: new Date(),
          typeRelation: true,
        };
        stompClient.send(
          `${GLOBAL_SEND_FRIEND}/${UserId}`,
          {},
          JSON.stringify(relation)
        );
        setListDataSendFriend(
          listDataSendFriend.filter((i) => i.userAction.userId != UserId)
        );
      } else {
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
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
        if (type) {
          showSnackbar2();
          setListDataSendFriend(
            listDataSendFriend?.filter((i) => i.userAction.userId != UserId)
          );
        } else {
          showSnackbar5();
        }
        setListDataUserSuitable(
          listDataUserSuitable?.map((t) => {
            if (t.userId == UserId) {
              return { ...t, sendStatus: false };
            }
            return t;
          })
        );
      } else {
        setListDataUserSuitable(
          listDataUserSuitable?.map((t) => {
            if (t.userId == UserId) {
              return { ...t, sendStatus: false };
            }
            return t;
          })
        );

        console.log("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

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

      console.log("test Result: " + apiResult);
      // Kiểm tra kết quả của cuộc gọi API và thực hiện các hành động tương ứng
      if (apiResult === true) {
        // Thành công, chuyển hướng đến trang mới
        showSnackbar3();
        setListDataUserSuitable(
          listDataUserSuitable?.map((t) => {
            if (t.userId == UserId) {
              return { ...t, sendStatus: true };
            }
            return t;
          })
        );
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
        setListDataUserSuitable(
          listDataUserSuitable?.filter((t) => t.userId != UserId)
        );
      } else {
        // Xử lý khi có lỗi trong cuộc gọi API
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };
  //End add Friend

  const connectAndSubscribe = () => {
    stompClient.connect(
      {},
      () => {
        console.log("Connected to WebSocket server home friend");
        stompClient.subscribe(
          `/user/${session?.user?.userId}/friend`,
          (message) => {
            if (message) {
              const data: RelaNotiDTO = JSON.parse(message.body);
              console.log(data);
              mutate(
                GLOBAL_URL + "/api/get-request-friend",
                fetchDataUserAction(GLOBAL_URL + "/api/get-request-friend"),
                false
              );
            }
          }
        );
      },
      (error) => {
        console.error("Error connecting to WebSocket server:", error);
      }
    );
  };
  useEffect(() => {
    if (session) {
      connectAndSubscribe();
    }
  }, [session]);

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
    setTimeout(() => setSnackbar3Open(false), 10000);
  };
  const showSnackbar4 = () => {
    setSnackbar4Open(true);
    setTimeout(() => setSnackbar4Open(false), 10000);
  };
  const showSnackbar5 = () => {
    setSnackbar5Open(true);
    setTimeout(() => setSnackbar5Open(false), 10000);
  };

  //biến chuyển hướng
  const router = useRouter();
  // xử lý chuyển hướng trang cá nhân
  const handleRouterProfile = (id: string) => {
    router.push(`/profile?id=${id}`);
  };

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
          {listDataSendFriend &&
            listDataSendFriend?.map((item) => (
              <Card
                key={item.id + "listSendFriend"}
                sx={{
                  backgroundColor: "#c0c0d7",
                  marginTop: "24px",
                  marginLeft: "24px",
                  width: { xs: "230px" },

                  flexGrow: listDataSendFriend.length >= 12 ? 1 : "auto",
                }}
              >
                <CardMedia
                  sx={{ height: 300 }}
                  image={item.userAction.profilePicUrl || "/OIP.jpg"}
                  title="green iguana"
                  onClick={() => handleRouterProfile(item?.id)}
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
                    onClick={() => handleRouterProfile(item?.id)}
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
                    color="success"
                    variant="contained"
                    onClick={() =>
                      handleAcceptAddfriend(item?.userAction?.userId)
                    }
                    sx={{
                      borderRadius: "30px",
                    }}
                  >
                    Đồng ý
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handlerefusedAddfriend(item?.userAction?.userId, true, 0)
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
                </CardActions>
              </Card>
            ))}
        </Box>
      </Box>
      <CardActions>
        <Button
          size="large"
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "#eeeeee",
            color: "#4d3869",
            display: "flex",
            justifyContent: "center",
            padding: "8px 0",
            "&:hover": {
              backgroundColor: "#ffffff",
              outline: "none",
              border: "none",
            },
          }}
        >
          Xem thêm
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
        Những người bạn có thể biết
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
          {listDataUserSuitable &&
            listDataUserSuitable?.map(
              (item) =>
                item.userId != session.user.userId && (
                  <Card
                    key={item.userId}
                    sx={{
                      backgroundColor: "#c0c0d7",
                      marginTop: "24px",
                      marginLeft: "24px",
                      width: { xs: "215px" },
                      flexGrow: listDataUserSuitable.length >= 12 ? 1 : "auto",
                    }}
                  >
                    <CardMedia
                      sx={{ height: 300, cursor: "pointer" }}
                      image={item.profilePicUrl || "/OIP.jpg"}
                      title="green iguana"
                      onClick={() => handleRouterProfile(item?.userId)}
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
                          cursor: "pointer",
                        }}
                        onClick={() => handleRouterProfile(item?.userId)}
                      >
                        {item?.fullname}
                      </Typography>
                    </CardContent>
                    {!item.sendStatus ? (
                      <CardActions
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          onClick={() => handsenddAddfriend(item?.userId)}
                          sx={{
                            minWidth: "90px",
                            textAlign: "center",
                            borderRadius: "30px",
                            padding: "8px 16px",
                            boxShadow: GLOBAL_BOXSHADOW,
                            background: GLOBAL_BG_BLUE_900,
                            fontWeight: "bold",
                            color: GLOBAL_COLOR_WHITE,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.03)",
                              backgroundColor: GLOBAL_BG_BLUE_300,
                            },
                          }}
                        >
                          Kết Bạn
                        </Box>
                        <Box
                          onClick={() =>
                            handremoveUserofListfriendSuitable(item?.userId)
                          }
                          sx={{
                            minWidth: "90px",
                            borderRadius: "30px",
                            backgroundColor: "#eeeeee",
                            textAlign: "center",
                            color: "#4d3869",
                            marginLeft: "4px",
                            padding: "8px 16px",
                            boxShadow: GLOBAL_BOXSHADOW,
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.03)",
                              backgroundColor: "#e3dede",
                              outline: "none",
                            },
                          }}
                        >
                          Xóa
                        </Box>
                      </CardActions>
                    ) : (
                      <CardActions
                        sx={{
                          display: "flex",

                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          onClick={() =>
                            handlerefusedAddfriend(item?.userId, false, 0)
                          }
                          sx={{
                            minWidth: "90px",
                            textAlign: "center",
                            borderRadius: "30px",
                            padding: "8px 16px",
                            boxShadow: GLOBAL_BOXSHADOW,
                            background: GLOBAL_BG_BLUE_900,
                            fontWeight: "bold",
                            color: GLOBAL_COLOR_WHITE,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.03)",
                              backgroundColor: GLOBAL_BG_BLUE_300,
                            },
                          }}
                        >
                          Hủy kết Bạn
                        </Box>
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
                          }}
                        >
                          Xóa
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                )
            )}
        </Box>
      </Box>
      <CardActions>
        <Button
          size="large"
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "#eeeeee",
            color: "#4d3869",
            display: "flex",
            justifyContent: "center",
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
        message="Thêm bạn thành công!"
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        sx={{
          color: "white",
          backgroundColor: "#4CAF50",
        }}
      />
      <Snackbar
        open={snackbar2Open}
        message="Từ chối kết bạn!"
        autoHideDuration={3000}
        onClose={() => setSnackbar2Open(false)}
        sx={{
          color: "black",
          bgcolor: "white",
        }}
      />
      <Snackbar
        open={snackbar3Open}
        message="Gừi lời mời kết bạn thành công!"
        autoHideDuration={3000}
        onClose={() => setSnackbar3Open(false)}
        sx={{
          color: "black",
          bgcolor: "white",
        }}
      />
      <Snackbar
        open={snackbar4Open}
        message="Đã xóa tài khoản khỏi danh sách gợi ý!"
        autoHideDuration={3000}
        onClose={() => setSnackbar4Open(false)}
        sx={{
          color: "black",
          bgcolor: "white",
        }}
      />
      <Snackbar
        open={snackbar5Open}
        message="Hủy gửi lời mời kết bạn!"
        autoHideDuration={3000}
        onClose={() => setSnackbar5Open(false)}
        sx={{
          color: "black",
          bgcolor: "white",
        }}
      ></Snackbar>
    </Box>
  );
};

export default HomeFriend;
