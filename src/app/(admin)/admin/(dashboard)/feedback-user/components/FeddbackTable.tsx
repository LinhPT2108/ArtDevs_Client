"use client";

import { useMemo, useState } from "react";
import {
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import Card from "@/components/admin/card";
import { sendRequest } from "@/components/utils/api";
import { Loader } from "@/components/utils/component.global";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import { SendOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import useSWR, { SWRResponse } from "swr";
import { FilterTable } from "../../report/component/FilterTable";
import FeedbackDetail from "./FeedbackDetail";
import { formatDayVN } from "@/components/utils/utils";

type Props = {
  columnsData: any[];
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const FeddbackTable = (props: Props) => {
  const { columnsData } = props;
  const [dataForTableFeedback, setDataForTableFeedback] = useState<
    FeedbackDTO[]
  >([]);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalFormReply, setOpenModalFormReply] = useState(false);
  const [dataHastagFeedback, setdataHastagFeedback] =
    useState<FeedbackDTO | null>(null);
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false);
  const [hashtagID, setHashtagID] = useState(Number);
  const [openSnackbar, setopenSnackbar] = useState(false);
  const [messageReponseApi, setMessageReponseApi] = useState(String);
  const [selectedRow, setSelectedRow] = useState<Row<FeedbackDTO> | null>(null);
  const [feedbackReply, setFeedbackReply] = useState("");

  // modal loading
  const [openLoading, setOpenLoading] = useState(false);

  //xử lý mở modal loading
  const handleClickOpenLoading = () => {
    setOpenLoading(true);
  };

  //xử lý đóng modal loading
  const handleCloseLoading = () => {
    setOpenLoading(false);
  };

  const fetchData = async (url: string) => {
    return await sendRequest<ReponseFeedbackFormAdmin>({
      url: url,
      method: "GET",
    });
  };
  const {
    data: reponseAPI,
    error,
    isLoading,
    mutate,
  }: SWRResponse<ReponseFeedbackFormAdmin, any> = useSWR(
    `${GLOBAL_URL}/api/admin/get-feedback`,
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  if (
    reponseAPI &&
    dataForTableFeedback &&
    dataForTableFeedback.length == 0 &&
    reponseAPI.model.length > 0
  ) {
    setDataForTableFeedback(reponseAPI.model);
  }

  const handleOpenSnackbar = () => {
    setopenSnackbar(true);
  };
  const handleCloseSnackbar = () => setopenSnackbar(false);

  const handleOpenModalDetail = () => {
    setOpenModalDetail(true);
  };
  const handleCloseModalDetail = () => {
    setOpenModalDetail(false);
  };

  const handleOpenModalFormReply = () => {
    setOpenModalFormReply(true);
  };
  const handleCloseModalFormReply = () => {
    setOpenModalFormReply(false);
  };
  const handleCancelDelete = () => {
    setOpenDeletePostDialog(false);
  };
  const handleOpenDelete = (HashtagID: number) => {
    setHashtagID(HashtagID);
    setOpenDeletePostDialog(true);
  };

  const handleActionDelete = async (HashtagID: number) => {
    try {
      const fetchData = await sendRequest<ReponseError>({
        url: `${GLOBAL_URL}/api/delete-detailhashtag`,
        method: "GET",
        queryParams: { HashtagID },
      });
      setMessageReponseApi(fetchData.message);
      setOpenDeletePostDialog(false);
      handleOpenSnackbar();
      if (fetchData.errorCode === 200) {
        const updatedModel = [...dataForTableFeedback]; // Sao chép mảng model để tránh cập nhật trực tiếp
        const index = updatedModel.findIndex(
          (item: FeedbackDTO) => item.id === HashtagID
        );
        if (index !== -1) {
          updatedModel.splice(index, 1);
          setDataForTableFeedback(updatedModel);
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // Xử lý lỗi ở đây nếu cần thiết
    }
  };
  const handleReplyFeedback = async (
    FeddbackText: string,
    userId: String,
    FeedbackId: number
  ) => {
    handleClickOpenLoading();
    try {
      const fetchData = await sendRequest<ReponseFeedbackFormAdmin>({
        url: `${GLOBAL_URL}/api/admin/reply-feedback`,
        method: "POST",
        queryParams: { FeddbackText, userId, FeedbackId },
      });
      setMessageReponseApi(fetchData.message);
      handleOpenSnackbar();
      if (fetchData.statusCode === 200) {
        // Sao chép mảng model để tránh cập nhật trực tiếp
        handleCloseLoading();
        const updatedModel = [...dataForTableFeedback];
        //@ts-ignore
        const newdataupdate: FeedbackDTO = fetchData.model;
        console.log("check new model", newdataupdate);
        const index = updatedModel.findIndex(
          (item: FeedbackDTO) => item.id === FeedbackId
        );
        console.log("check updated model", updatedModel);
        console.log("check index", index);
        if (index !== -1) {
          // Thay thế phần tử tại index bằng newdataupdate
          updatedModel.splice(index, 1, newdataupdate);
          setDataForTableFeedback(updatedModel);
          console.log("check updated model 2 -", dataForTableFeedback);
        }
        handleCloseModalDetail();
        handleCloseModalFormReply();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // Xử lý lỗi ở đây nếu cần thiết
    }
  };
  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lấy dữ liệu từ TextField và cập nhật vào state
    setFeedbackReply(event.target.value);
  };
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => dataForTableFeedback, [dataForTableFeedback]);
  // Hàm xử lý khi click vào một dòng
  const handleRowClick = (model: FeedbackDTO) => {
    setdataHastagFeedback(model);
  };

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    setGlobalFilter,
    headerGroups,
    page,
    prepareRow,
    state: { globalFilter, pageIndex, pageSize },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    setPageSize,
  } = tableInstance;
  return (
    <Card className={"w-full h-full p-4"}>
      <div className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Phản hồi của người dùng
        </div>
        <div className="flex items-center justify-center space-x-2">
          <FilterTable
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:text-gray-500"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:text-gray-500"
          >
            {">"}
          </button>
          <span className="text-gray-700">
            Trang{" "}
            <strong>
              {pageIndex + 1} của {pageOptions.length}
            </strong>{" "}
          </span>
          <span className="text-gray-700">| Hiển thị </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-full overflow-x-auto">
        <table
          {...getTableProps()}
          className="mt-8 h-max w-full"
          color="gray-500"
          // variant="simple"
          // mb="24px"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-32 pb-[10px] text-start dark:!border-navy-700 "
                    key={index}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={index}
                  onClick={() => {
                    {
                      handleOpenModalDetail(),
                        setSelectedRow(row),
                        handleRowClick(row.original);
                    }
                  }}
                  // Đặt lớp CSS để chỉ định hàng được chọn
                  className={row === selectedRow ? "bg-gray-200" : ""}
                >
                  {row.cells.map((cell, index) => {
                    let renderData;
                    if (cell.column.Header === "ID") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.id}
                        </p>
                      );
                    } else if (cell.column.Header === "Tiêu Đề") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.title}
                        </p>
                      );
                    } else if (cell.column.Header === "Người Phản Hồi") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.userId}
                        </p>
                      );
                    } else if (cell.column.Header === "Ngày Phản Hồi") {
                      const formattedDate = row.original.createFeedback
                        ? formatDayVN(row.original.createFeedback)
                        : "";
                      renderData = (
                        <p className="text-md font-medium text-gray-600 dark:text-white">
                          {formattedDate}
                        </p>
                      );
                    } else if (cell.column.Header === "Ngày Trả Lời Phản Hồi") {
                      const formattedDate = row.original.dateHandle
                        ? formatDayVN(row.original.dateHandle)
                        : "";
                      renderData = (
                        <p className="text-md font-medium text-gray-600 dark:text-white">
                          {formattedDate}
                        </p>
                      );
                    } else if (cell.column.Header === "Trạng Thái Phản Hồi") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          <div>
                            {row.original.status ? ( // Kiểm tra giá trị của status
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-500" // Class cho biểu tượng tick
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 0a10 10 0 110 20 10 10 0 010-20zm4.95 7.64a.5.5 0 00-.7-.03l-4.97 4.97-2.28-2.28a.5.5 0 00-.64.76l2.5 2.5a.5.5 0 00.8-.06l5.5-6a.5.5 0 00-.07-.66z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              // Nếu status là false
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-500" // Class cho biểu tượng X
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 0a10 10 0 110 20 10 10 0 010-20zm5.3 14.7a1 1 0 01-1.4 1.4L10 11.4l-3.9 3.9a1 1 0 01-1.4-1.4L8.6 10 4.7 6.1a1 1 0 111.4-1.4L10 8.6l3.9-3.9a1 1 0 111.4 1.4L11.4 10l3.9 3.9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {row.original.status}
                            </p>
                          </div>
                        </p>
                      );
                    }

                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="pt-[14px] pb-3 text-[14px]"
                      >
                        {renderData}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        open={openModalDetail}
        onClose={handleCloseModalDetail}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 1000 }}>
          <Typography
            id="keep-mounted-modal-title"
            variant="h6"
            component="h2"
            sx={{
              border: "1px solid gray",
              borderRadius: "5px",
            }}
          >
            {dataHastagFeedback && (
              <FeedbackDetail feedback={dataHastagFeedback} />
            )}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              endIcon={<SendOutlined />}
              onClick={() => handleOpenModalFormReply()}
            >
              Phản Hồi Ý Kiến Người Dùng
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openModalFormReply}
        onClose={handleCloseModalFormReply}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "700px", // Đặt chiều rộng tối đa
            width: "100%",
            outline: "none", // Loại bỏ viền xung quanh Modal
          }}
        >
          <Typography variant="h6" component="h2" sx={{ marginBottom: "20px" }}>
            Phản hồi ý kiến
          </Typography>
          <TextField
            id="standard-multiline-flexible"
            label="Phản hồi ý kiến"
            multiline
            maxRows={8}
            variant="standard"
            value={feedbackReply}
            onChange={handleFeedbackChange}
            sx={{ width: "100%", marginBottom: "20px" }}
          />
          <Button
            variant="outlined"
            endIcon={<SendOutlined />}
            onClick={() =>
              dataHastagFeedback &&
              handleReplyFeedback(
                feedbackReply,
                dataHastagFeedback?.userId,
                dataHastagFeedback?.id
              )
            }
          >
            Gửi Phản Hồi
          </Button>
        </Box>
      </Modal>
      <Dialog
        open={openLoading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Loader />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                marginTop: "12px ",
              }}
            >
              Đang gửi mail trả lời phản hồi của người dùng <br /> Vui lòng chờ
              trong giây lát{" "}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog open={openDeletePostDialog} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <p>Bạn có muốn xóa Hashtag này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={() => handleActionDelete(hashtagID)} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={messageReponseApi}
      />
    </Card>
  );
};

export default FeddbackTable;
