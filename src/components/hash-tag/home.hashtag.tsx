"use client";
import SearchIcon from "@mui/icons-material/Search";
import {
  Grid,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { formatDayVN } from "../utils/utils";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_COLOR_MENU,
  GLOBAL_URL,
} from "../utils/veriable.global";
import HashtagSkeleton from "./home.hashtag.skeletion";
import InfiniteScroll from "./Infinite.scroll";
import { Loader } from "../utils/component.global";

const HomeHashtag = () => {
  const router = useRouter();
  const [searchHashtag, setSearchHashTag] = useState<string>("");
  const [dataHashtag, setDatahashtag] = useState<HashtagInfor[]>([]);
  const [page, setPage] = useState<number>(0);

  const fetchData = async (url: string) => {
    return await sendRequest<IModelPaginate<HashtagInfor>>({
      url: url,
      method: "GET",
      queryParams: { keyword: "", page: page },
    });
  };
  const {
    data,
    error,
    isLoading,
    mutate,
  }: SWRResponse<IModelPaginate<HashtagInfor>, any> = useSWR(
    GLOBAL_URL + "/api/detailhashtag",
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const handleRedirectHashtag = (hashtagText: string) => {
    router.push(`/hash-tag/${hashtagText}`);
  };

  let typingTimeout: ReturnType<typeof setTimeout>;
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    const { value } = event.target;
    setSearchHashTag(value);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      fetchHashtagSearch(value);
    }, 1500);
  };

  // const fetchHashtagSearch = async (v: string) => {
  //   const newData = await sendRequest<IModelPaginate<HashtagInfor>>({
  //     url: GLOBAL_URL + `/api/search-detailhashtag`,
  //     method: "GET",
  //     queryParams: { keyword: v, page: page },
  //   });
  //   if (newData) {
  //     mutate(newData, false);
  //   }
  // };

  const fetchHashtagSearch = async (v: string) => {
    const newData = await sendRequest<IModelPaginate<HashtagInfor>>({
      url: GLOBAL_URL + `/api/detailhashtag`,
      method: "GET",
      queryParams: { keyword: v, page: page },
    });
    if (newData) {
      mutate(newData, false);
    }
  };
  console.log(">>> check page: ", page);
  useEffect(() => {
    (async () => {
      if (page) {
        const response = await sendRequest<IModelPaginate<HashtagInfor>>({
          url: GLOBAL_URL + `/api/detailhashtag`,
          method: "GET",
          queryParams: { keyword: searchHashtag, page: page },
        });
        const has = data?.result ? data?.result : [];
        const resHash = response?.result ? response?.result : [];
        const newData: HashtagInfor[] = [...has, ...resHash];
        setDatahashtag(newData);
        mutate({ meta: response?.meta, result: newData! }, false);
      }
    })();
  }, [page, searchHashtag]);
  if (isLoading) {
    return (
      <Box
        sx={{
          height: "86vh",
          width: "100%",
          marginTop: "16px",
        }}
      >
        <Grid
          container
          columns={12}
          spacing={2}
          sx={{
            backgroundColor: "transparent",
            justifyContent: "flex-start",
          }}
        >
          {Array.from({ length: 11 }).map((_, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <HashtagSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, marginTop: "12px" }}>
      <Paper
        sx={{
          p: "2px 12px",
          marginBottom: "12px",
          display: "flex",
          backgroundColor: "#eeeeee",
          borderRadius: "30px",
          alignItems: "center",
          "@media (min-width: 600px)": {
            width: "144px",
          },
          "@media (min-width: 700px)": {
            width: "240px",
          },
          "@media (min-width: 1023px)": {
            width: "300px",
          },
        }}
      >
        <InputBase
          onChange={handleSearchChange}
          sx={{
            ml: 1,
            flex: 1,
          }}
          placeholder="Tìm kiếm..."
          inputProps={{ "aria-label": "search" }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <InfiniteScroll
        loader={<Loader />}
        className=" my-10"
        fetchMore={() => setPage((prev) => prev + 1)}
        hasMore={data && page + 1 < data?.meta?.total}
        totalPage={data ? data?.meta?.total : 1}
        endMessage={
          data && data?.meta?.total > 1 ? (
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
        <Grid
          container
          columns={12}
          spacing={2}
          sx={{
            backgroundColor: "transparent",
            justifyContent: "flex-start",
          }}
        >
          {data &&
            data?.result?.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ padding: "12px" }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        onClick={() => {
                          handleRedirectHashtag(item?.hashtagText);
                        }}
                        sx={{
                          width: "auto",
                          padding: "0 12px",
                          minWidth: "80px",
                          textDecoration: "none",
                          fontWeight: "bold",
                          boxShadow: `0 0 3px 1px ${GLOBAL_BG_BLUE_900}`,
                          textAlign: "center",
                          color: GLOBAL_BG_BLUE_900,
                          borderRadius: "16px",
                          transition: "all .2s",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      >
                        {item?.hashtagText}
                      </Box>
                    </Box>
                    <Box
                      height={100}
                      sx={{
                        fontSize: { md: "14px", lg: "16px" },
                        textAlign: "justify",
                        lineHeight: "1.4",
                        maxHeight: 4 * 1.4 + "em",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 4,
                        color: GLOBAL_COLOR_MENU,
                      }}
                    >
                      {item?.description ? item?.description : "..."}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "8px",
                        color: GLOBAL_COLOR_MENU,
                      }}
                    >
                      <Box
                        width={100}
                        height={30}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          fontSize: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            marginRight: "4px",
                            fontSize: "14px",
                          }}
                        >
                          {item?.totalPostUseHashtag}
                        </Typography>
                        bài viết
                      </Box>
                      <Box
                        width={100}
                        height={30}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          fontSize: "12px",
                        }}
                      >
                        Ngày tạo{" "}
                        <Typography
                          sx={{ fontWeight: "bold", fontSize: "14px" }}
                        >
                          {formatDayVN(item?.timeCreate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          {data?.result?.length == 0 ? (
            <Box sx={{ margin: "16px" }}>Không tìm thấy hashtag !</Box>
          ) : (
            ""
          )}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
};
export default HomeHashtag;
