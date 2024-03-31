"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/admin/card";
import Progress from "@/components/admin/progress";
import moment from 'moment';
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

type Props = {
  columnsData: any[];
  tableData: UserFormAdminDTO[];
  onRowClick: (rowData: UserFormAdminDTO) => void;
};
type TableData = UserFormAdminDTO[];

function TopCreatorTable(props: Props) {
  const { columnsData,tableData, onRowClick } = props;
  const [selectedRow, setSelectedRow] = useState<Row<UserFormAdminDTO> | null>(
    null
  ); // Sử dụng state để lưu trữ hàng được chọn
  // Trong component của bạn:
 
  

  // Hàm callback để truyền dữ liệu khi click vào hàng
  const handleRowClick = (rowData: UserFormAdminDTO) => {
    // Gọi prop callback để truyền dữ liệu lên component cha
    props.onRowClick(rowData);
  };

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  console.log("check data table",data);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  return (
    <Card className={"h-[600px] w-full pb-5"}>
      {/* Top Creator Header */}
      <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pt-4 pb-[20px] shadow-2xl shadow-gray-100 dark:!bg-navy-700 dark:shadow-none">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Top Creators
        </h4>
        <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
          See all
        </button>
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
              return (
                <tr
                  {...row.getRowProps()}
                  key={index}
                  onClick={() => {
                    setSelectedRow(row);
                    onRowClick(row.original);
                  }}
                  // Đặt lớp CSS để chỉ định hàng được chọn
                  className={row === selectedRow ? "bg-gray-200" : ""}
                >
                  {row.cells.map((cell, index) => {
                    let renderData;
                    if (cell.column.Header === "UserID") {
                      renderData = (
                        <div className="flex items-center gap-2">
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
                          <p className="text-sm font-medium text-navy-700 dark:text-white">
                            {row.original.userId}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "createDate") {
                      const formattedDate = moment(row.original.createDate).format('MMMM Do YYYY, h:mm:ss a');
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