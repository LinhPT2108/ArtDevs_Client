import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import useSWR, { SWRResponse } from "swr";
import InfiniteScroll from "../hash-tag/Infinite.scroll";
import { sendRequest } from "../utils/api";
import { Loader } from "../utils/component.global";
import {
  GLOBAL_COLOR_MENU,
  GLOBAL_SEND_FRIEND,
  GLOBAL_URL,
} from "../utils/veriable.global";
import SkeletonPeople from "./skeleton.people";

interface IPros {
  session: User;
  dataFilterPeoples?: { city?: string; demands?: string };
}

export default function SearchPeople({ session, dataFilterPeoples }: IPros) {
  //biến xử lý socket
  const socket = new SockJS(GLOBAL_URL + "/friend");
  const stompClient = Stomp.over(socket);

  //phân trang
  const [page, setPage] = useState<number>(0);

  //lấy search params
  const searchParams = useSearchParams();

  // biến thông báo
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbar2Open, setSnackbar2Open] = useState<boolean>(false);
  const [snackbar3Open, setSnackbar3Open] = useState<boolean>(false);
  const [snackbar4Open, setSnackbar4Open] = useState<boolean>(false);
  const [snackbar5Open, setSnackbar5Open] = useState<boolean>(false);

  //lấy dữ liệu db
  const fetchData = async (url: string) => {
    return await sendRequest<IModelPaginate<UserAction>>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: { keyword: searchParams.get("keyword") as string, page: 0 },
    });
  };
  const {
    data,
    error,
    isLoading,
    mutate,
  }: SWRResponse<IModelPaginate<UserAction>, any> = useSWR(
    GLOBAL_URL + "/api/search/people",
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    console.log(">>> check dataFilterPeoples: ", dataFilterPeoples);
    const refeshDataSearch = async () => {
      setPage(0);
      const newDataSearch = await sendRequest<IModelPaginate<UserAction>>({
        url: GLOBAL_URL + "/api/search/people",
        method: "GET",
        headers: { authorization: `Bearer ${session?.access_token}` },
        queryParams: {
          page: page,
          keyword: searchParams.get("keyword") as string,
          ...dataFilterPeoples,
        },
      });
      console.log(">>> check newDataSearch people: ", newDataSearch);
      mutate(newDataSearch, false);
    };
    refeshDataSearch();
  }, [dataFilterPeoples]);

  useEffect(() => {
    if (page) {
      const refeshDataSearch = async () => {
        const newDataSearch = await sendRequest<IModelPaginate<UserAction>>({
          url: GLOBAL_URL + "/api/search/people",
          method: "GET",
          headers: { authorization: `Bearer ${session?.access_token}` },
          queryParams: {
            page: page,
            keyword: searchParams.get("keyword") as string,
            ...dataFilterPeoples,
          },
        });
        console.log(">>> check newDataSearch people: ", newDataSearch);
        const peoples = data?.result ? data?.result : [];
        const resPeoples = newDataSearch?.result ? newDataSearch?.result : [];
        const newData: UserAction[] = [...peoples, ...resPeoples];
        mutate({ meta: newDataSearch?.meta, result: newData! }, false);
      };
      refeshDataSearch();
    }
  }, [page]);

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

        const newData: UserAction[] | undefined = data?.result?.map((t) => {
          if (t.userId == UserId) {
            return { ...t, sendStatus: true };
          }
          return t;
        });

        if (newData) {
          const newDataObject: IModelPaginate<UserAction> = {
            meta: data
              ? data.meta
              : {
                  current: 0,
                  pageSize: 0,
                  pages: 0,
                  total: 0,
                },
            result: newData,
          };
          mutate(newDataObject, false);
        }

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

        const newData: UserAction[] | undefined = data?.result?.filter(
          (t) => t.userId != UserId
        );

        if (newData) {
          const newDataObject: IModelPaginate<UserAction> = {
            meta: data
              ? data.meta
              : {
                  current: 0,
                  pageSize: 0,
                  pages: 0,
                  total: 0,
                },
            result: newData,
          };
          mutate(newDataObject, false);
        }
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
          const newData: UserAction[] | undefined = data?.result?.filter(
            (t) => t.userId != UserId
          );

          if (newData) {
            const newDataObject: IModelPaginate<UserAction> = {
              meta: data
                ? data.meta
                : {
                    current: 0,
                    pageSize: 0,
                    pages: 0,
                    total: 0,
                  },
              result: newData,
            };
            mutate(newDataObject, false);
          }
        } else {
          showSnackbar5();
        }
        const newData: UserAction[] | undefined = data?.result?.map((t) => {
          if (t.userId == UserId) {
            return { ...t, sendStatus: true };
          }
          return t;
        });

        if (newData) {
          const newDataObject: IModelPaginate<UserAction> = {
            meta: data
              ? data.meta
              : {
                  current: 0,
                  pageSize: 0,
                  pages: 0,
                  total: 0,
                },
            result: newData,
          };
          mutate(newDataObject, false);
        }
      } else {
        const newData: UserAction[] | undefined = data?.result?.map((t) => {
          if (t.userId == UserId) {
            return { ...t, sendStatus: true };
          }
          return t;
        });

        if (newData) {
          const newDataObject: IModelPaginate<UserAction> = {
            meta: data
              ? data.meta
              : {
                  current: 0,
                  pageSize: 0,
                  pages: 0,
                  total: 0,
                },
            result: newData,
          };
          mutate(newDataObject, false);
        }
      }
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };
  //hủy kết bạn
  const refusedAddfriend = async (
    UserId: string,
    status: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${GLOBAL_URL}/api/cancel-request-friend/${UserId}?status=${status}`,
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
  if (isLoading) {
    return <SkeletonPeople />;
  }
  return (
    <Box>
      {
        //@ts-ignore
        !data?.statusCode && data?.result?.length > 0 && (
          <>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <Typography sx={{ fontSize: "20px", color: GLOBAL_COLOR_MENU }}>
                Tìm thấy:
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "20px", marginX: "4px" }}
              >
                {data?.result?.length}
              </Typography>
              <Typography sx={{ fontSize: "20px", color: GLOBAL_COLOR_MENU }}>
                kết quả phù hợp
              </Typography>
            </Box>
            <Divider />
          </>
        )
      }
      <InfiniteScroll
        loader={<Loader />}
        className=" my-5 pb-3"
        fetchMore={() => setPage((prev) => prev + 1)}
        hasMore={data && page + 1 < data?.meta?.total}
        totalPage={data ? data?.meta?.total : 1}
        endMessage={
          data && data?.meta?.total > data?.meta?.current ? (
            <Box
              sx={{ fontWeight: "bold", textAlign: "center", margin: "12px 0" }}
            >
              Bạn đã xem hết !
            </Box>
          ) : (
            ""
          )
        }
      >
        <Grid columns={12} container spacing={1}>
          {
            //@ts-ignore
            !data?.statusCode &&
              data?.result?.map((item) => (
                <Grid
                  key={item.userId}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ paddingX: "6px" }}
                >
                  <Card
                    sx={{
                      maxWidth: 400,
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
                        marginTop: "16px",
                        width: 200,
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          marginBottom: 0,
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
                            handlerefusedAddfriend(item?.userId, false, 0)
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
                </Grid>
              ))
          }
          {
            //@ts-ignore
            ((!data?.statusCode && data?.result?.length == 0) ||
              //@ts-ignore
              data?.statusCode) && (
              <Box>
                <Image
                  src="/not_find_result.png"
                  width={1000}
                  height={500}
                  alt="not find result"
                />
              </Box>
            )
          }
        </Grid>
      </InfiniteScroll>
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
