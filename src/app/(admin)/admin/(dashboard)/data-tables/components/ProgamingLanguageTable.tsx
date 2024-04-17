"use client";

import { useMemo, useState } from "react";
import Card from "@/components/admin/card";
import DeleteIcon from "@mui/icons-material/Delete";
import { FcReadingEbook } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Snackbar,
  TextField,
} from "@mui/material";
import useSWR, { SWRResponse } from "swr";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import { sendRequest } from "@/components/utils/api";
import { FilterTable } from "../../report/component/FilterTable";
import { set } from "date-fns";

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
type Props = {
  columnsData: any[];
};

const ProgamingLanguageTable = (props: Props) => {
  const { columnsData } = props;
  const [dataForTableLanguage, setDataForTableLanguage] = useState<
    MyLanguageProgram[]
  >([]);
  const [openSnackbar, setopenSnackbar] = useState(false);
  const [messageReponseApi, setMessageReponseApi] = useState(String);
  const [languageID, setLanguageID] = useState(Number);
  const [openDeletePostDialog, setOpenDeleteLanguageDialog] = useState(false);
  const [openCreateLanguageDialog, setOpenCreateLanguageDialog] =
    useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<MyLanguageProgram>({
    languageName: "",
    id: 0,
    countUserOfLanguage: 0,
    countMentorOfLanguage: 0,
  });
  const fetchData = async (url: string) => {
    return await sendRequest<ReponseLangugeFormAdmin>({
      url: url,
      method: "GET",
    });
  };
  const {
    data: reponseAPI,
    error,
    isLoading,
  }: SWRResponse<ReponseLangugeFormAdmin, any> = useSWR(
    `${GLOBAL_URL}/api/admin/get-all-progaminglanguage`,
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  if (reponseAPI && !dataForTableLanguage.length) {
    setDataForTableLanguage(reponseAPI.model);
  }
  const handleOpenSnackbar = () => {
    setopenSnackbar(true);
  };
  const handleCloseSnackbar = () => {
    setopenSnackbar(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCancelDelete = () => {
    setOpenDeleteLanguageDialog(false);
  };
  const handleOpenDelete = (LanguageID: number) => {
    setLanguageID(LanguageID);
    setOpenDeleteLanguageDialog(true);
  };

  const handleActionDelete = async (LanguageID: number) => {
    try {
      const fetchData = await sendRequest<ReponseError>({
        url: `${GLOBAL_URL}/api/delete-programingLanguage`,
        method: "GET",
        queryParams: { LanguageID },
      });
      setMessageReponseApi(fetchData.message);
      setOpenDeleteLanguageDialog(false);
      handleOpenSnackbar();
      if (fetchData.errorCode === 200) {
        const updatedModel = [...dataForTableLanguage]; // Sao chép mảng model để tránh cập nhật trực tiếp
        const index = updatedModel.findIndex(
          (item: MyLanguageProgram) => item.id === LanguageID
        );
        if (index !== -1) {
          updatedModel.splice(index, 1);
          setDataForTableLanguage(updatedModel);
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // Xử lý lỗi ở đây nếu cần thiết
    }
  };
  const handleSubmit = () => {
    setOpenCreateLanguageDialog(true);
  };
  const handleCancelDiaglogCreate = () => {
    setOpenCreateLanguageDialog(false);
  };
  const handleActionCreate = async () => {
    try {
      const fetchData = await sendRequest<ReponseHashtagInfor>({
        url: `${GLOBAL_URL}/api/programingLanguage`,
        method: "POST",
        body: formData,
      });
      setMessageReponseApi(fetchData.message);
      setOpenCreateLanguageDialog(false);
      handleOpenSnackbar();
      handleCloseModal();
      if (fetchData.statusCode === 200) {
        const updatedModel = [...dataForTableLanguage]; // Sao chép mảng model để tránh cập nhật trực tiếp
        updatedModel.push(formData);
        setDataForTableLanguage(updatedModel);
        console.log(" form data nè", formData);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // Xử lý lỗi ở đây nếu cần thiết
    }
  };
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => dataForTableLanguage, [dataForTableLanguage]);
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
    <Card className={"w-full sm:overflow-auto p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Ngôn ngữ lập trình
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
      </header>

      <div className="mt-8 overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full"
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
                    className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700"
                    key={index}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
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
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let renderData;
                    if (cell.column.Header === "Tên Ngôn Ngữ Lập Trình") {
                      renderData = (
                        <div className="flex items-center">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {row.original.languageName}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Học Viên Quan Tâm") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          <span
                            style={{
                              display: "inline-block",
                              marginRight: "5px",
                              fontSize: "24px",
                            }}
                          >
                            {/* <FcReadingEbook /> */}
                          </span>
                          <span style={{ fontSize: "20px" }}>
                            {row.original.countUserOfLanguage}
                          </span>
                        </p>
                      );
                    } else if (cell.column.Header === "Người Hướng Dẫn") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          <span
                            style={{
                              display: "inline-block",
                              marginRight: "5px",
                              fontSize: "24px",
                            }}
                          >
                            {/* <FcBusinessman /> */}
                          </span>
                          <span style={{ fontSize: "20px" }}>
                            {row.original.countMentorOfLanguage}
                          </span>
                        </p>
                      );
                    } else if (cell.column.Header === "Thao Tác") {
                      renderData = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          <Box>
                            <Button
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleOpenDelete(row.original.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </p>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
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
        <Button
          variant="outlined"
          startIcon={<AddCircleRoundedIcon />}
          className="w-full"
          onClick={() => handleOpenModal()}
        >
          Thêm Mới
        </Button>
      </div>
      <Dialog open={openDeletePostDialog} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <p>Bạn có muốn xóa ngôn ngữ lập trình này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => handleActionDelete(languageID)}
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
        message={messageReponseApi}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 800 }}>
          {/* Form */}
          {/* Input cho languageName */}
          <TextField
            label="Tên ngôn ngữ"
            variant="outlined"
            value={formData.languageName}
            onChange={(e) =>
              setFormData({ ...formData, languageName: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="outlined" onClick={handleSubmit}>
            Tạo mới
          </Button>
        </Box>
      </Modal>
      <Dialog
        open={openCreateLanguageDialog}
        onClose={handleCancelDiaglogCreate}
      >
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <p>Bạn muốn thêm Ngôn Ngữ Lập Trình ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDiaglogCreate} color="primary">
            Hủy
          </Button>
          <Button onClick={() => handleActionCreate()} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProgamingLanguageTable;
