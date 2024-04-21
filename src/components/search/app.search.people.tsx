import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

interface MySearch {
  listUserDTOs: UserAction[];
  listMentorDTOs: UserAction[];
  listHashtagDTOs: HashtagInfor[];
  listPostDTOs: ResPost[];
}

interface IPros {
  searchAlls: MySearch;
  session: User;
  setSearchAlls: (v: any) => void;
}

export default function SearchPeople({
  searchAlls,
  session,
  setSearchAlls,
}: IPros) {
  //biến setting slide show
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  //biến data peoples
  const { listUserDTOs } = searchAlls;

  //biến xử lý socket
  const socket = new SockJS(GLOBAL_URL + "/friend");
  const stompClient = Stomp.over(socket);

  // biến thông báo
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbar2Open, setSnackbar2Open] = useState<boolean>(false);
  const [snackbar3Open, setSnackbar3Open] = useState<boolean>(false);
  const [snackbar4Open, setSnackbar4Open] = useState<boolean>(false);
  const [snackbar5Open, setSnackbar5Open] = useState<boolean>(false);

  //xử lý trạng thái thông báo
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

  // hàm xử lý thêm bạn bè
  const handsenddAddfriend = async (UserId: string) => {
    try {
      const apiResult = await sendAddfriend(UserId);

      if (apiResult === true) {
        showSnackbar3();
        setSearchAlls((prevState: any) => ({
          ...prevState,
          listUserDTOs: searchAlls?.listUserDTOs?.map((t) => {
            if (t.userId == UserId) {
              return { ...t, sendStatus: true };
            }
            return t;
          }),
        }));

        const relation: RelationNotificationDTO = {
          userAction: session?.user?.userId,
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

  //Gửi kết bạn
  const sendAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${GLOBAL_URL}/api/send-request-friend/${UserId}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      console.log(response);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error sending match:", error);
      return false;
    }
  };

  //xử lý xóa gợi ý kết bạn
  const handremoveUserofListfriendSuitable = async (UserId: string) => {
    try {
      const apiResult = await removeUserofListfriendSuitable(UserId);

      console.log("test Result" + apiResult);
      if (apiResult === true) {
        showSnackbar4();
        setSearchAlls((prevState: any) => ({
          ...prevState,
          listUserDTOs: searchAlls?.listUserDTOs?.filter(
            (t) => t.userId != UserId
          ),
        }));
      } else {
        console.error("Match request failed.");
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };
  //xóa gọi ý kết bạn
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

  //xử lý từ hủy kết bạn
  const handlerefusedAddfriend = async (UserId: string, type: boolean) => {
    try {
      const apiResult = await refusedAddfriend(UserId);
      console.log("test Result" + apiResult);
      if (apiResult === true) {
        if (type) {
          showSnackbar2();
          setSearchAlls((prevState: any) => ({
            ...prevState,
            listUserDTOs: searchAlls?.listUserDTOs?.filter(
              (t) => t.userId != UserId
            ),
          }));
        } else {
          showSnackbar5();
        }
        setSearchAlls((prevState: any) => ({
          ...prevState,
          listUserDTOs: searchAlls?.listUserDTOs?.map((t) => {
            if (t.userId == UserId) {
              return { ...t, sendStatus: true };
            }
            return t;
          }),
        }));
      } else {
        setSearchAlls((prevState: any) => ({
          ...prevState,
          listUserDTOs: searchAlls?.listUserDTOs?.map((t) => {
            if (t.userId == UserId) {
              return { ...t, sendStatus: true };
            }
            return t;
          }),
        }));
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  //hủy kết bạn
  const refusedAddfriend = async (UserId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-request-friend/${UserId}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending match:", error);
      return false;
    }
  };

  return (
    <Box>
      <Slider {...settings}>
        {listUserDTOs &&
          listUserDTOs?.map((item) => (
            <Box key={item.userId} sx={{ paddingX: "6px" }}>
              <Card
                sx={{
                  backgroundColor: "#c0c0d7",
                }}
              >
                <CardMedia
                  sx={{ height: 300 }}
                  image={item?.profilePicUrl || "/OIP.jpg"}
                  title="green iguana"
                />
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingY: 0,
                    marginTop: "16px", // Nếu không sử dụng theme, bạn có thể truyền giá trị dạng chuỗi cho margin
                    width: 200, // Độ rộng của khung chứa văn bản
                    overflow: "hidden", // Ẩn nội dung vượt quá khung
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textOverflow: "ellipsis", // Hiển thị dấu "..." khi văn bản bị cắt
                      overflow: "hidden", // Ẩn văn bản dư
                      whiteSpace: "nowrap", // Ngăn văn bản xuống dòng
                      marginBottom: 0, // Không cần thiết khi sử dụng Typography variant="h5"
                    }}
                  >
                    {item.fullname}
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
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => handsenddAddfriend(item?.userId)}
                      sx={{
                        borderRadius: "30px",
                      }}
                    >
                      Kết Bạn
                    </Button>
                    <Button
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
                ) : (
                  <CardActions
                    sx={{
                      display: "flex",

                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() =>
                        handlerefusedAddfriend(item?.userId, false)
                      }
                      sx={{
                        borderRadius: "30px",
                      }}
                    >
                      Hủy kết Bạn
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
                      }}
                    >
                      Xóa
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Box>
          ))}
      </Slider>
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
        }}
      />
      <Snackbar
        open={snackbar3Open}
        message="Gừi lời mời kết bạn thành công!"
        autoHideDuration={3000}
        onClose={() => setSnackbar3Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar4Open}
        message="Đã xóa tài khoản khỏi danh sách gợi ý!"
        autoHideDuration={3000}
        onClose={() => setSnackbar4Open(false)}
        sx={{
          color: "black",
        }}
      />
      <Snackbar
        open={snackbar5Open}
        message="Hủy gửi lời mời kết bạn!"
        autoHideDuration={3000}
        onClose={() => setSnackbar5Open(false)}
        sx={{
          color: "black",
        }}
      />
    </Box>
  );
}
