"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/admin/card";
import Progress from "@/components/admin/progress";
import moment from "moment";
import {
  Row,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { sendRequest } from "@/components/utils/api";
import { GLOBAL_URL } from "@/components/utils/veriable.global";
import useSWR, { SWRResponse } from "swr";
import { Badge } from "@mui/material";

type Props = {
  columnsData: any[];
  tableData: UserFormAdminDTO[];
  onRowClick: (rowData: UserFormAdminDTO) => void;
};

function TopCreatorTable(props: Props) {
  const { columnsData, tableData, onRowClick } = props;
  const [dataPresent, setdataPresent] = useState(props.tableData);
  const [selectedRow, setSelectedRow] = useState<Row<UserFormAdminDTO> | null>(
    null
  ); // Sử dụng state để lưu trữ hàng được chọn
  // Trong component của bạn:

  // Hàm callback để truyền dữ liệu khi click vào hàng
  const handleRowClick = (rowData: UserFormAdminDTO) => {
    // Gọi prop callback để truyền dữ liệu lên component cha
    props.onRowClick(rowData);
  };

  const checkIfNew = (createDate: Date) => {
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - createDate.getTime()) / (1000 * 3600); // Tính khoảng thời gian trong giờ
    return diffInHours <= 72;
  };
  useEffect(() => {
    console.log("check data 3", tableData);
    setdataPresent(tableData);
  }, [tableData]);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => {
    console.log("check data table 1", dataPresent);
    return dataPresent;
  }, [dataPresent]);

  useEffect(() => {
    console.log("check data 2", data);
  }, [data]);

  const tableInstance = useTable(
    {
      columns,
      data: data,
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

  return (
    <Card className={"h-[650px] w-full pb-5  relative "}>
      {/* Top Creator Header */}
      <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pt-4 pb-[20px] shadow-2xl shadow-gray-100 dark:!bg-navy-700 dark:shadow-none">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Top Creators
        </h4>
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
      </div>

      {/* Top Creator Heading */}
      <div className="w-full h-full px-4 overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full min-w-[500px] overflow-x-scroll"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                  >
                    <div className="flex items-center justify-between pt-4 pb-2 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="px-4">
            {page.map((row, index) => {
              prepareRow(row);
              // Kiểm tra xem liệu hàng có phải là hàng mới hay không
              const createDate =
                row.original.createDate instanceof Date
                  ? row.original.createDate // Nếu là đối tượng Date, sử dụng trực tiếp
                  : new Date(row.original.createDate);
              const isNewRow = checkIfNew(createDate);

              return (
                <tr
                  {...row.getRowProps()}
                  key={index}
                  onClick={() => {
                    setSelectedRow(row);
                    onRowClick(row.original);
                  }}
                  // Đặt lớp CSS để chỉ định hàng được chọn
                  className={`${row === selectedRow ? "bg-gray-200" : ""}`}
                >
                  {row.cells.map((cell, index) => {
                    let renderData;
                    if (cell.column.Header === "UserID") {
                      renderData = (
                        <div className="flex items-center gap-2">
                          {isNewRow ? (
                            <Badge
                              color="error"
                              badgeContent="New"
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              style={{ fontSize: "0.1rem"}}
                            >
                              <div className="h-[30px] w-[30px] rounded-full">
                                <img
                                  src={
                                    row.original.userPictureAvatar
                                      ? row.original.userPictureAvatar
                                      : "/OIP.jpg"
                                  }
                                  className="h-full w-full rounded-full"
                                  alt=""
                                />
                              </div>
                            </Badge>
                          ) : (
                            <div className="h-[30px] w-[30px] rounded-full">
                              <img
                                src={
                                  row.original.userPictureAvatar
                                    ? row.original.userPictureAvatar
                                    : "/OIP.jpg"
                                }
                                className="h-full w-full rounded-full"
                                alt=""
                              />
                            </div>
                          )}
                          <p className="text-sm font-medium text-navy-700 dark:text-white">
                            {row.original.userId}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "createDate") {
                      const formattedDate = moment(
                        row.original.createDate
                      ).format("MMMM Do YYYY");
                      renderData = (
                        <p className="text-md font-medium text-gray-600 dark:text-white">
                          {formattedDate}
                        </p>
                      );
                    } else if (cell.column.Header === "Email") {
                      renderData = (
                        <div className="mx-2 flex font-bold">
                          <p className="text-md font-medium text-gray-600 dark:text-white">
                            {row.original.email}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Role") {
                      renderData = (
                        <div className="mx-2 flex font-bold">
                          <p className="text-md font-medium text-gray-600 dark:text-white">
                            {row.original.role.roleName}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <td
                        className="py-3 text-sm"
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
    </Card>
  );
}

export default TopCreatorTable;
