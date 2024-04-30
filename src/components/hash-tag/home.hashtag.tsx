"use client";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Slide,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import ReportIcon from "@mui/icons-material/Report";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { sendRequest } from "../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDayVN } from "../utils/utils";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_COLOR_BLACK,
  GLOBAL_COLOR_MENU,
  GLOBAL_ERROR_MESSAGE,
  GLOBAL_URL,
} from "../utils/veriable.global";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import HashtagSkeleton from "./home.hashtag.skeletion";
import InfiniteScroll from "./Infinite.scroll";
import { Loader } from "../utils/component.global";
import CircularProgress from "@mui/material/CircularProgress";
import { TransitionProps } from "react-transition-group/Transition";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
interface Ips {
  session: User;
}
const HomeHashtag = ({ session }: Ips) => {
  const router = useRouter();

  const searchParam = useSearchParams();
  const [site, setSite] = useState(true);

  const [openAlert, setOpenAlert] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState<HashtagInfor | null>(
    null
  );

  const handleClickOpenAlert = (item: HashtagInfor) => {
    setSelectedHashtag(item);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setSelectedHashtag(null);
    setOpenAlert(false);
  };

  const [openBackDrop, setOpenBackDrop] = useState(false);
  const handleCloseBackDrop = () => {
    setOpenBackDrop(false);
  };
  const handleOpenBackDrop = () => {
    setOpenBackDrop(true);
  };
  //properties handle update hashtag

  const [openDialogReport, setOpenDialogReport] = useState<{
    openDialog: boolean;
    hashtag: HashtagInfor;
  }>({
    openDialog: false as boolean,
    hashtag: null as unknown as HashtagInfor,
  });
  const [hashtagDTO, setHashtagDTO] = useState<{
    hashtagId: number | null;
    description: string;
  }>({
    hashtagId: null,
    description: openDialogReport?.hashtag?.description,
  });
  const handleOpenDialogHashtag = (hashtag: HashtagInfor) => {
    console.log(hashtag);
    setOpenDialogReport({
      openDialog: true as boolean,
      hashtag: hashtag as unknown as HashtagInfor,
    });
    setHashtagDTO({
      hashtagId: hashtag.id,
      description: hashtag.description,
    });
  };
  const handleCloseDialogReportPost = () => {
    setOpenDialogReport({
      openDialog: false as boolean,
      hashtag: null as unknown as HashtagInfor,
    });
    console.log("close modal report");
  };

  const [searchHashtag, setSearchHashTag] = useState<string>("");
  const [dataHashtag, setDatahashtag] = useState<HashtagInfor[]>([]);
  const [page, setPage] = useState<number>(0);

  //tạo biến xử lý modal report hashtag
  const [anchorEl, setAnchorEl] = useState<
    ((EventTarget & HTMLElement) | null)[]
  >([]);

  const [open2, setOpen2] = useState([]);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    hashtagId: number,
    index: number
  ) => {
    const newOpenArray = [...open2] as boolean[];
    newOpenArray[index] = true;

    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;

    setOpen2(newOpenArray as []);
    setAnchorEl(newAnchorEl);
    setSelectedItemId(hashtagId);
  };

  const handleCloses = (index: number) => {
    const newOpenArray = [...open2] as boolean[];
    newOpenArray[index] = false;

    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;

    setOpen2(newOpenArray as []);
    setAnchorEl(newAnchorEl);

    setSelectedItemId(null);
  };

  const fetchData = async (url: string) => {
    const queryParams: Record<string, string | number | null> = {
      keyword: "",
      page: page,
    };
    return await sendRequest<IModelPaginate<HashtagInfor>>({
      url: url,
      method: "GET",
      queryParams: queryParams,
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
  const [dataSnackbar, setDataSnackbar] = useState<any>({
    openSnackbar: false,
    contentSnackbar: "",
    type: "success",
  });

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setDataSnackbar({
      openSnackbar: false,
      contentSnackbar: "",
      type: "",
    });
  };

  const [alignment, setAlignment] = useState("popular");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setPage(0);
    if (newAlignment != null) {
      if (alignment === newAlignment) {
        const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
        await setSortOrder(newSortOrder);
      } else {
        await setAlignment(newAlignment);
        await setSortOrder("desc");
      }
    } else {
      let newSortOrder = null;
      if (sortOrder == "desc") newSortOrder = "asc";
      if (sortOrder == "asc") newSortOrder = "desc";
      await setSortOrder(newSortOrder!);
    }
    await fetchHashtagSearch("", alignment, sortOrder);
  };

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
      fetchHashtagSearch(value, "", "");
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

  
  const fetchHashtagUserLogged = async (
  ) => {
    const newData = await sendRequest<IModelPaginate<HashtagInfor>>({
      url: GLOBAL_URL + `/api/detailhashtag-userLogged`,
      method: "GET",
      headers: { authorization: `Bearer ${session?.access_token}` },
      queryParams: { keyword: "" },
    });
    console.log(newData);
    
    if (newData) {
      mutate(newData, false);
    }
  };

  const fetchHashtagSearch = async (
    v: string,
    tab: string,
    sortType: string
  ) => {
    console.log(tab, sortType);
    const queryParams: Record<string, string | number | null> = {
      keyword: v,
      tab: tab,
      sort: sortType,
    };

    const newData = await sendRequest<IModelPaginate<HashtagInfor>>({
      url: GLOBAL_URL + `/api/detailhashtag`,
      method: "GET",
      queryParams: queryParams,
    });

    if (newData) {
      mutate(newData, false);
    }
  };

  const handleDeleteHashtag = async (hashtagId: number | undefined) => {
    handleOpenBackDrop();
    console.log(hashtagId);

    const newData = await sendRequest<any>({
      url: GLOBAL_URL + `/api/delete-detailhashtag`,
      method: "GET",
      queryParams: {
        HashtagID: hashtagId,
      },
    });
    if (newData.errorCode == 200) {
      const newListUpdate: any = data?.result.filter((item) => {
        if (item.id != hashtagId) return item;
      });
      const newMeta: IModelPaginate<HashtagInfor> = {
        meta: data!.meta,
        result: newListUpdate,
      };
      mutate(newMeta, false);
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: newData.message,
        type: "success",
      });
      handleCloseBackDrop();
      handleCloseAlert();
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
      handleCloseAlert();
      handleCloseBackDrop();
    }
  };

  const handleUpdateHashtag = async () => {
    handleOpenBackDrop();
    console.log(hashtagDTO);

    const newData = await sendRequest<any>({
      url: GLOBAL_URL + `/api/update-detailhashtag/${hashtagDTO.hashtagId}`,
      method: "PUT",
      queryParams: {
        description: hashtagDTO.description,
      },
    });
    if (newData.errorCode == 200) {
      const newListUpdate: any = data?.result.map((item) => {
        if (item.id == hashtagDTO.hashtagId) {
          return {
            ...item,
            description: hashtagDTO.description,
          };
        } else {
          return item;
        }
      });
      const newMeta: IModelPaginate<HashtagInfor> = {
        meta: data!.meta,
        result: newListUpdate,
      };
      mutate(newMeta, false);
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: newData.message,
        type: "success",
      });
      handleCloseDialogReportPost();
      handleCloseBackDrop();
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
      handleCloseBackDrop();
    }
  };

  const handleReportHashtag = async (hashtagId: number) => {
    const newData = await sendRequest<any>({
      url: GLOBAL_URL + `/api/report-hashtag/${hashtagId}`,
      method: "PUT",
    });
    console.log(newData);
    if (newData.errorCode == 200) {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: newData.message,
        type: "success",
      });
    } else {
      setDataSnackbar({
        openSnackbar: true,
        contentSnackbar: GLOBAL_ERROR_MESSAGE,
        type: "error",
      });
    }
  };

  console.log(">>> check data: ", data);
  useEffect(() => {
    (async () => {
      if (page) {
        let tab = searchParam.get("tab") ?? null;
        let typeSort = searchParam.get("sort") ?? null;
        const queryParams: Record<string, string | number | null> = {
          keyword: searchHashtag,
          page: page,
        };

        if (tab != null) {
          queryParams.tab = tab;
        }
        if (typeSort != null) {
          queryParams.sort = typeSort;
        }
        const response = await sendRequest<IModelPaginate<HashtagInfor>>({
          url: GLOBAL_URL + `/api/detailhashtag`,
          method: "GET",
          queryParams: queryParams,
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
      <Backdrop
        sx={{ color: "#fff", zIndex: 9999999 }}
        open={openBackDrop}
        onClick={handleCloseBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={dataSnackbar.openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        {dataSnackbar.openSnackbar && (
          <Alert variant="filled" severity={dataSnackbar.type}>
            {dataSnackbar.type == "success"
              ? dataSnackbar.contentSnackbar
              : GLOBAL_ERROR_MESSAGE}
          </Alert>
        )}
      </Snackbar>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          Xóa Hashtag &quot;<strong>{selectedHashtag?.hashtagText}</strong>
          &quot;{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Lưu ý: Bạn sẽ không thể phục hồi lại Hashtag này nếu bạn ấn xóa !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Hủy</Button>
          <Button onClick={() => handleDeleteHashtag(selectedHashtag?.id)}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <BootstrapDialog
        onClose={handleCloseDialogReportPost}
        aria-labelledby="customized-dialog-title"
        open={openDialogReport.openDialog}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, color: GLOBAL_COLOR_BLACK }}
          id="customized-dialog-title"
          fontSize={"18px"}
        >
          Chỉnh sửa mô tả Hashtag &quot;
          <strong>{openDialogReport?.hashtag?.hashtagText}</strong>&quot;
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialogReportPost}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TextField
            id="standard-basic-report"
            label="Nội dung Cập nhật"
            variant="standard"
            autoComplete="off"
            fullWidth
            value={hashtagDTO?.description}
            onChange={(e) => {
              setHashtagDTO({
                hashtagId: hashtagDTO.hashtagId,
                description: e.target.value,
              });
            }}
          />
          {!hashtagDTO.description && (
            <FormHelperText sx={{ color: "red" }}>
              Vui lòng nhập nội dung cập nhật
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogReportPost}
            sx={{
              color: "gray",
            }}
          >
            Hủy
          </Button>
          <Button
            autoFocus
            onClick={() => handleUpdateHashtag()}
            disabled={!hashtagDTO.description}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Paper
          sx={{
            my: "auto",
            p: "2px 12px",
            // marginBottom: "12px",
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
        {/* {sortOrder + " " + alignment} */}
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="popular" aria-label="left aligned">
            Phổ biến
          </ToggleButton>
          <ToggleButton value="name" aria-label="centered">
            Tên
          </ToggleButton>
          <ToggleButton value="createDate" aria-label="right aligned">
            Ngày tạo
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          my: 4,
        }}
      >
        <Button
          variant={site?"contained":"outlined"}
          sx={{
            mr: 1,
          }}
          onClick={()=>{
            setSite(true);
          fetchHashtagSearch("","popular","desc");
          }}
        >
          Tất cả
        </Button>
        <Button
          variant={!site?"contained":"outlined"}
          sx={{
            ml: 1,
          }}
          
          onClick={()=>{
            setSite(false);
            fetchHashtagUserLogged();
          }}
        >
          Của tôi
        </Button>
      </Box>
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
                        justifyContent: "space-between",
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
                      <Box
                        sx={{
                          transform: "rotate(90deg)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            cursor: "pointer",
                            borderRadius: "4px",
                            transition: "all 0.2s linear",
                            "&:hover": {
                              backgroundColor: "#eeeeee",
                            },
                          }}
                          onClick={(event) =>
                            handleClick(event, item.id, index)
                          }
                        >
                          <Box
                            sx={{
                              display: "flex",
                              padding: "8px 4px ",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                          >
                            <MoreVertIcon />
                          </Box>
                        </Box>
                        <Menu
                          anchorEl={anchorEl[index]}
                          id={`account-menu-${index}`}
                          open={Boolean(anchorEl[index])}
                          onClose={() => handleCloses(index)}
                          onClick={() => handleCloses(index)}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.32))",
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
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <Box>
                            {item?.userAction?.userId == session.user.userId ? (
                              <Box>
                                <MenuItem
                                  onClick={() => handleOpenDialogHashtag(item)}
                                >
                                  <ListItemIcon>
                                    <EditIcon fontSize="small" />
                                  </ListItemIcon>
                                  Chỉnh sửa
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleClickOpenAlert(item)}
                                >
                                  <ListItemIcon>
                                    <DeleteIcon fontSize="small" />
                                  </ListItemIcon>
                                  Xóa
                                </MenuItem>
                              </Box>
                            ) : (
                              <MenuItem
                                onClick={() => handleReportHashtag(item.id)}
                              >
                                <ListItemIcon>
                                  <ReportIcon fontSize="small" />
                                </ListItemIcon>
                                Báo cáo
                              </MenuItem>
                            )}
                          </Box>
                        </Menu>
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
                      {item?.description ? item?.description : ""}
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
