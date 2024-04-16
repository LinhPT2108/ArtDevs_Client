"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import CardMenu from "@/components/admin/card/CardMenu";
import Card from "@/components/admin/card";
import Progress from "@/components/admin/progress";
import { DiApple, DiAndroid, DiWindows } from "react-icons/di";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Snackbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import { FilterTable } from "../../report/component/FilterTable";
import HashtagDetail from "./HashtagDetail";

type Props = {
  columnsData: any[];
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const HashtagTable = (props: Props) => {
  const { columnsData } = props;
  const [dataForTableHashtag, setDataForTableHashtag] = useState<
    HashtagInfor[]
  >([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataHastagDetail, setdataHastagDetail] = useState<HashtagInfor | null>(
    null
  );
  const [openDeletePostDialog, setOpenDeletePostDialog] = useState(false);
  const [hashtagID, setHashtagID] = useState(Number);
  const [openSnackbar, setopenSnackbar] = useState(false);
  const [messageReponseApi, setMessageReponseApi] = useState(String);
  const [selectedRow, setSelectedRow] = useState<Row<HashtagInfor> | null>(
    null
  );

  const fetchData = async (url: string) => {
    return await sendRequest<ReponseHashtagFormAdmin>({
      url: url,
      method: "GET",
    });
  };
  const {
    data: reponseAPI,
    error,
    isLoading,
    mutate,
  }: SWRResponse<ReponseHashtagFormAdmin, any> = useSWR(
    `${GLOBAL_URL}/api/admin/get-all-hashtag`,
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  if (reponseAPI && !dataForTableHashtag.length) {
    setDataForTableHashtag(reponseAPI.model);
  }

  const handleOpenSnackbar = () => {
    setopenSnackbar(true);
  };
  const handleCloseSnackbar = () => setopenSnackbar(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
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
        const updatedModel = [...dataForTableHashtag]; // Sao chép mảng model để tránh cập nhật trực tiếp
        const index = updatedModel.findIndex(
          (item: HashtagInfor) => item.id === HashtagID
        );
        if (index !== -1) {
          updatedModel.splice(index, 1);
          setDataForTableHashtag(updatedModel);
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // Xử lý lỗi ở đây nếu cần thiết
    }
  };

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => dataForTableHashtag, [dataForTableHashtag]);
  // Hàm xử lý khi click vào một dòng
  const handleRowClick = (model: HashtagInfor) => {
    setdataHastagDetail(model);
  };
  const updateDataHashtagDetail = (newData: HashtagInfor) => {
    console.log("check new data", newData);
    if (reponseAPI && reponseAPI.model) {
      const updatedModel = [...reponseAPI.model]; // Sao chép mảng model để tránh cập nhật trực tiếp
      const index = updatedModel.findIndex(
        (item: HashtagInfor) => item.id === newData.id
      );

      if (index !== -1) {
        console.log("check index ", index);
        updatedModel[index] = newData; // Thay thế phần tử cũ bằng phần tử mới
        const updatedData = { ...reponseAPI, model: updatedModel };
        console.log("check list new  ", updatedData); // Cập nhật dữ liệu mới
        // Sử dụng mutate để cập nhật dữ liệu
        setDataForTableHashtag(updatedModel);
        setdataHastagDetail(updatedModel[index]);
      }
    }
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
          HashTag
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
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span className="text-gray-700">| Show </span>
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
                      handleOpenModal(),
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
                    } else if (cell.column.Header === "Tên Hashtag") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.hashtagText}
                        </p>
                      );
                    } else if (cell.column.Header === "Chi tiết Hashtag") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.description}
                        </p>
                      );
                    } else if (cell.column.Header === "Số lượng bài viết") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.totalPostUseHashtag}
                        </p>
                      );
                    } else if (cell.column.Header === "Thao Tác") {
                      renderData = (
                        <Box>
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={(e) => {
                              {
                                e.stopPropagation();
                                handleOpenDelete(row.original.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
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
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 800 }}>
          <HashtagDetail
            data={dataHastagDetail}
            getDataNew={updateDataHashtagDetail}
          />
        </Box>
      </Modal>
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

export default HashtagTable;
