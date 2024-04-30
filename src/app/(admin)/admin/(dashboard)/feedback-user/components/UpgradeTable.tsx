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
  DialogContent,
  DialogContentText,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import useSWR, { SWRResponse } from "swr";
import { FilterTable } from "../../report/component/FilterTable";
import CancelUpgrade from "./CancelUpgrade";
import SkillMentor from "./skillMentor";

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
const UpgradeTable = (props: Props) => {
  const { columnsData } = props;
  const [dataForTableUpgrade, setDataForTableUpgrade] = useState<FeedbackDTO[]>(
    []
  );
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalFormReply, setOpenModalFormReply] = useState(false);
  const [openModalAcceptUpgrade, setOpenModalAcceptUpgrade] = useState(false);
  const [dataHastagFeedback, setdataHastagFeedback] =
    useState<FeedbackDTO | null>(null);
  const [openSnackbar, setopenSnackbar] = useState(false);
  const [messageReponseApi, setMessageReponseApi] = useState(String);
  const [selectedRow, setSelectedRow] = useState<Row<FeedbackDTO> | null>(null);
  const [feedbackReply, setFeedbackReply] = useState("");
  const [listSkillOfMentor, setListSkillOfMentor] = useState<String[]>([]);
  const [errorDemand, setErrorDemand] = useState<boolean>(false);
  const [messageDemand, setMessageDemand] = useState<string>("");
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

  const fetchDataLanguage = async (url: string) => {
    return await sendRequest<MyLanguageProgram[]>({
      url: url,
      method: "GET",
    });
  };
  const {
    data: responseLanguage,
    error: errorLanguage,
    isLoading: isLoadingLanguage,
  }: SWRResponse<MyLanguageProgram[], any> = useSWR(
    `${GLOBAL_URL}/api/programingLanguage`,
    fetchDataLanguage,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );
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
    `${GLOBAL_URL}/api/admin/get-upgrade`,
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );
  console.log("check data...", reponseAPI);
  const handleListSkillOfUser = (
    myLanguageProgram: MyLanguageProgram[],
    userId: String
  ) => {
    let arrayOfValues: string[] = [];
    if (myLanguageProgram) {
      arrayOfValues = Object.values(myLanguageProgram).map(
        (item) => item.languageName
      );
    }
    if (myLanguageProgram.length > 0) {
      setErrorDemand(false);
      setMessageDemand("");
    } else {
      setErrorDemand(true);
      setMessageDemand("Chọn ít nhất một danh mục quan tâm !");
    }
    setListSkillOfMentor(arrayOfValues);
    // setData((prevData) => ({
    //   ...prevData,
    //   listSkillOfUser: arrayOfValues,
    // }));
  };
  const handleAcceptUpgrade = async (userId: String, FeedbackId: number) => {
    try {
      if (listSkillOfMentor.length > 0) {
        setErrorDemand(false);
        setMessageDemand("");
        handleClickOpenLoading();
        const fetchData = await sendRequest<ReponseFeedbackFormAdmin>({
          url: `${GLOBAL_URL}/api/admin/accept-upgrade`,
          method: "POST",
          queryParams: { listSkillOfMentor, userId, FeedbackId },
        });
        setMessageReponseApi(fetchData.message);
        handleOpenSnackbar();

        if (fetchData.statusCode === 200) {
          // Sao chép mảng model để tránh cập nhật trực tiếp
          handleCloseLoading();
          handleCloseModalDetail();
          const updatedModel = [...dataForTableUpgrade];
          //@ts-ignore
          const newdataupdate: FeedbackDTO = fetchData.model;
          const index = updatedModel.findIndex(
            (item: FeedbackDTO) => item.id === FeedbackId
          );

          if (index !== -1) {
            // Thay thế phần tử tại index bằng newdataupdate
            updatedModel.splice(index, 1, newdataupdate);
            setDataForTableUpgrade(updatedModel);
          }
          handleCloseLoading();
          handleCloseModalAcceptUpgrade();
        }
      } else {
        setErrorDemand(true);
        setMessageDemand("Chọn ít nhất một danh mục quan tâm !");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // Xử lý lỗi ở đây nếu cần thiết
    }
  };
  if (reponseAPI && dataForTableUpgrade && dataForTableUpgrade.length == 0) {
    setDataForTableUpgrade(reponseAPI.model);
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
  const handleOpenModalAcceptUpgrade = () => {
    setOpenModalAcceptUpgrade(true);
  };
  const handleCloseModalAcceptUpgrade = () => {
    setOpenModalAcceptUpgrade(false);
  };

  const handleReplyFeedback = async (
    FeddbackText: string,
    userId: String,
    FeedbackId: number
  ) => {
    handleClickOpenLoading();
    try {
      const fetchData = await sendRequest<ReponseFeedbackFormAdmin>({
        url: `${GLOBAL_URL}/api/admin/reply-upgrade`,
        method: "POST",
        queryParams: { FeddbackText, userId, FeedbackId },
      });
      setMessageReponseApi(fetchData.message);
      handleOpenSnackbar();

      if (fetchData.statusCode === 200) {
        // Sao chép mảng model để tránh cập nhật trực tiếp
        handleCloseLoading();
        const updatedModel = [...dataForTableUpgrade];
        //@ts-ignore
        const newdataupdate: FeedbackDTO = fetchData.model;
        const index = updatedModel.findIndex(
          (item: FeedbackDTO) => item.id === FeedbackId
        );
        if (index !== -1) {
          // Thay thế phần tử tại index bằng newdataupdate
          updatedModel.splice(index, 1, newdataupdate);
          setDataForTableUpgrade(updatedModel);
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
  const data = useMemo(() => dataForTableUpgrade, [dataForTableUpgrade]);
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
          Phê duyệt yêu cầu nâng cấp tài khoản
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
                      const formattedDate = moment(
                        row.original.createFeedback
                      ).format("MMMM Do YYYY");
                      renderData = (
                        <p className="text-md font-medium text-gray-600 dark:text-white">
                          {formattedDate}
                        </p>
                      );
                    } else if (cell.column.Header === "Ngày Trả Lời Phản Hồi") {
                      const formattedDate = moment(
                        row.original.dateHandle
                      ).format("MMMM Do YYYY");
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
        <Box
          sx={{ ...style, width: 1000, overflow: "scroll", maxHeight: "90vh" }}
        >
          <Typography
            id="keep-mounted-modal-title"
            variant="h6"
            component="h2"
            sx={{
              border: "1px solid gray",
              borderRadius: "5px",
            }}
          >
            {dataHastagFeedback && <CancelUpgrade item={dataHastagFeedback} />}
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
              sx={{ marginRight: "8px" }}
            >
              Phản Hồi yêu cầu
            </Button>
            <Button
              variant="outlined"
              endIcon={<SendOutlined />}
              onClick={() => handleOpenModalAcceptUpgrade()}
            >
              Nâng cấp tài khoản
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
      <Modal
        open={openModalAcceptUpgrade}
        onClose={handleCloseModalAcceptUpgrade}
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
          <SkillMentor
            programingLanguage={responseLanguage}
            userId={dataHastagFeedback?.userId}
            handleListSkillOfUser={handleListSkillOfUser}
            errorDemand={errorDemand}
            messageDemand={messageDemand}
          />
          <Button
            variant="outlined"
            endIcon={<SendOutlined />}
            onClick={() =>
              dataHastagFeedback &&
              handleAcceptUpgrade(
                dataHastagFeedback?.userId,
                dataHastagFeedback?.id
              )
            }
            sx={{ marginTop: "12px" }}
          >
            Xác Nhận
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
              Loading
            </Typography>
          </DialogContentText>
        </DialogContent>
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

export default UpgradeTable;
