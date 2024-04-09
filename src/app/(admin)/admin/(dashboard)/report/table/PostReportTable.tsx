"use client";

import React, { useMemo, useState } from "react";
import {
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import CardMenu from "@/components/admin/card/CardMenu";
import Card from "@/components/admin/card";
import Progress from "@/components/admin/progress";
import moment from "moment";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import PostDetail from "./PostDetail";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type Props = {
  columnsData: any[];
  tableData: Post[];
};

const PostReportTable = (props: Props) => {
  const { columnsData, tableData } = props;
  const [openModal, setOpenModal] = React.useState(false);
  const [openSnackbar, setopenSnackbar] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [selectedRow, setSelectedRow] = useState<Row<Post> | null>(null);

  const [openDeletePostDialog, setOpenDeletePostDialog] = React.useState(false);

  const handleDeletePost = () => {
    setOpenDeletePostDialog(true);
  };

  const handleCancelDeletePost = () => {
    setOpenDeletePostDialog(false);
  };
  const handleOpenModal = async (postId: string) => {
    setOpenModal(true);
    const fetchData = await sendRequest<Post>({
      url: `${GLOBAL_URL}/api/post-with-id`,
      method: "GET",
      queryParams: { postId },
    });

    setPost(fetchData);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenSnackbar = (message: string) => {
    setopenSnackbar(true), setMessage(message);
  };
  const handleCloseSnackbar = () => setopenSnackbar(false);

  const hanleCallOpenPost = async (postId: string) => {
    try {
      // Gọi API để xóa bài đăng
      const fetchData = await sendRequest<ReponseError>({
        url: `${GLOBAL_URL}/api/admin/change-isdel-post`,
        method: "POST",
        queryParams: { postId },
      });

      // Kiểm tra kết quả từ API
      if (fetchData.errorCode === 200) {
        // Hiển thị thông báo thành công
        handleOpenSnackbar(fetchData.message);

        // Đóng modal sau khi xóa thành công
        handleCloseModal();
      } else {
        // Hiển thị thông báo lỗi
        handleOpenSnackbar(fetchData.message);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      handleOpenSnackbar("Có lỗi xảy ra khi xóa bài đăng.");
    } finally {
      // Đóng dialog sau khi xử lý xong
      setOpenDeletePostDialog(false);
    }
  };

  // lấy dữ liệu đổ lên UserTable
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
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
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    setPageSize,
  } = tableInstance;
  //---------**********************

  return (
    <Card className={"w-full h-full p-4 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Post Report Table
        </div>
        <div className="flex items-center justify-center space-x-2">
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
          <span className="text-gray-700">| Go to page: </span>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="w-12 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
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
        <CardMenu />
      </div>

      <div className="mt-8 h-full overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
                  >
                    <p className="text-xs tracking-wide text-gray-600">
                      {column.render("Header")}
                    </p>
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
                    setSelectedRow(row);
                    handleOpenModal(row.original.postId);
                  }}
                  // Đặt lớp CSS để chỉ định hàng được chọn
                  className={row === selectedRow ? "bg-gray-200" : ""}
                >
                  {row.cells.map((cell, index) => {
                    let renderData;
                    if (cell.column.Header === "ID") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.postId}
                        </p>
                      );
                    } else if (cell.column.Header === "Nội Dung Bài Viết") {
                      renderData = (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {row.original.content}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Tài Khoản Đăng Bài") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.userPost.userId}
                        </p>
                      );
                    } else if (cell.column.Header === "Thời Gian Đăng Bài") {
                      const formattedDate = moment(row.original.time).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      );
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {formattedDate}
                        </p>
                      );
                    } else if (cell.column.Header === "Chế Độ Bài Viết") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row.original.typePost}
                        </p>
                      );
                    }

                    return (
                      <td
                        className="pt-[14px] pb-[18px] sm:text-[14px]"
                        {...cell.getCellProps()}
                        key={index}
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

      <div>
        <Modal
          keepMounted
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="keep-mounted-modal-title"
              variant="h6"
              component="h2"
              sx={{
                border: "1px solid gray",
                borderRadius: "5px",
              }}
            >
              <PostDetail item={post!} />
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
                endIcon={<DeleteIcon />}
                onClick={() => handleDeletePost()}
              >
                Mở Khóa Bài Viết
              </Button>
            </Box>
          </Box>
        </Modal>

        <Dialog open={openDeletePostDialog} onClose={handleCancelDeletePost}>
          <DialogTitle>Xác nhận mở khóa</DialogTitle>
          <DialogContent>
            <p>Bạn có muốn mở khóa bài viết này không?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDeletePost} color="primary">
              Hủy
            </Button>
            <Button
              onClick={() => hanleCallOpenPost(post?.postId!)}
              color="primary"
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          message={message}
        />
      </div>
    </Card>
  );
};

export default PostReportTable;
