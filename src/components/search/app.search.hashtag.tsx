"use client";
import SearchIcon from "@mui/icons-material/Search";
import {
  Divider,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import { formatDayVN } from "../utils/utils";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_COLOR_MENU,
  GLOBAL_URL,
} from "../utils/veriable.global";
import { Loader } from "../utils/component.global";
import HashtagSkeleton from "../hash-tag/home.hashtag.skeletion";
import InfiniteScroll from "../hash-tag/Infinite.scroll";
import Image from "next/image";

interface IPros {
  session: User;
  dataFilterHashtags?: {
    tab?: string;
    dir?: string;
  };
}

const SearchHashtag = ({ dataFilterHashtags, session }: IPros) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(0);

  //lấy search params
  const searchParams = useSearchParams();

  const fetchData = async (url: string) => {
    return await sendRequest<IModelPaginate<HashtagInfor>>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: {
        keyword: searchParams.get("keyword") as string,
        page: page,
      },
    });
  };
  const {
    data,
    error,
    isLoading,
    mutate,
  }: SWRResponse<IModelPaginate<HashtagInfor>, any> = useSWR(
    GLOBAL_URL + "/api/search/hashtag",
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const handleRedirectHashtag = (hashtagText: string) => {
    router.push(`/hash-tag/${hashtagText}`);
  };

  useEffect(() => {
    setPage(0);
    console.log(">>> check dataFilterHashtags: ", dataFilterHashtags);
    (async () => {
      const response = await sendRequest<IModelPaginate<HashtagInfor>>({
        url: GLOBAL_URL + "/api/search/hashtag",
        method: "GET",
        headers: { authorization: `Bearer ${session?.access_token}` },
        queryParams: {
          keyword: searchParams.get("keyword") as string,
          page: page,
          ...dataFilterHashtags,
        },
      });
      console.log(">>> check newDataSearch hashtag: ", response);
      mutate(response, false);
    })();
  }, [dataFilterHashtags]);

  useEffect(() => {
    (async () => {
      if (page) {
        const response = await sendRequest<IModelPaginate<HashtagInfor>>({
          url: GLOBAL_URL + "/api/search/hashtag",
          method: "GET",
          headers: { authorization: `Bearer ${session?.access_token}` },
          queryParams: {
            keyword: searchParams.get("keyword") as string,
            page: page,
            ...dataFilterHashtags,
          },
        });

        console.log(">>> check newDataSearch hashtag: ", response);
        const has = data?.result ? data?.result : [];
        const resHash = response?.result ? response?.result : [];
        const newData: HashtagInfor[] = [...has, ...resHash];
        mutate({ meta: response?.meta, result: newData! }, false);
      }
    })();
  }, [page]);

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
  console.log(">>> check data: ", data);

  return (
    <Box sx={{ flexGrow: 1, marginTop: "12px" }}>
      {
        //@ts-ignore
        !data?.statusCode && data?.result?.length > 0 && (
          <>
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
          {
            //@ts-ignore
            !data?.statusCode &&
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
    </Box>
  );
};
export default SearchHashtag;
