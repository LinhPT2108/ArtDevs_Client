"use client";
import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";

// import MiniCalendar from "@/components/calendar/MiniCalendar";
import WeeklyRevenue from "./components/WeeklyRevenue";
import TotalSpent from "./components/TotalSpent";
import PieChartCard from "./components/PieChartCard";
import { IoIosAlert, IoIosPerson, IoMdHome } from "react-icons/io";
import { IoDocuments, IoStar } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck } from "./variables/columnsData";

import Widget from "@/components/admin/widget/Widget";
import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";
import DailyTraffic from "./components/DailyTraffic";
import TaskCard from "./components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

import { tableColumnsTopCreators } from "./variables/tableColumnsTopCreators";

import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";
import {
  GLOBAL_LISTADMIN,
  GLOBAL_LISTALLACCOUNT,
  GLOBAL_LISTALLBAND,
  GLOBAL_LISTMENTOR,
  GLOBAL_LISTNEWUSER,
  GLOBAL_LISTUSER,
  GLOBAL_TURNON_MENTOR,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
import TopCreatorTable from "./components/table/TableTopCreators";
import Banner from "./components/table/Banner";
import { useSession } from "next-auth/react";
import { Badge } from "@mui/material";

const MiniCalendar = dynamic(
  () => import("@/components/admin/calendar/MiniCalendar"),
  {
    loading: () => <p>loading...</p>,
    ssr: false,
  }
);

type Props = {};

const DashboardPage: FC<Props> = () => {
  const { data: sessions, update: sessionUpdate } = useSession();
  const [dataForTable, setDataForTable] = useState<UserFormAdminDTO[]>([]);
  const [listNameTable, setlistNameTable] = useState<string>(
    GLOBAL_LISTALLACCOUNT
  );
  const [userData, setUserData] = useState<UserFormAdminDTO | null>(null);

  const handleRowClick = (rowData: UserFormAdminDTO) => {
    // Xử lý dữ liệu của hàng được chọn tại đây, ví dụ:
    setUserData(rowData);
    console.log("Row data:", rowData);
    // Truyền dữ liệu sang component Banner
    // Implement your logic here
  };

  console.log("prop", sessions);
  const fetchData = async (url: string) => {
    return await sendRequest<ReponseAllUserFormAdmin>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${sessions?.access_token}` },
    });
  };
  const {
    data: dataGetAll,
    error,
    isLoading,
  }: SWRResponse<ReponseAllUserFormAdmin, any> = useSWR(
    `${GLOBAL_URL}/api/admin/get-all-account`,
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  const fetchDataCount = async (url: string) => {
    return await sendRequest<ReponseCountAllUserFormAdmin>({
      url: url,
      method: "GET",
      headers: { authorization: `Bearer ${sessions?.access_token}` },
    });
  };
  const {
    data: CountAccount,
    error: ErrorCount,
  }: SWRResponse<ReponseCountAllUserFormAdmin, any> = useSWR(
    `${GLOBAL_URL}/api/admin/get-count-account`,
    fetchDataCount,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );
  useEffect(() => {
    setDataForTable(dataGetAll?.model?.listAllAccount ?? []);
  }, [dataGetAll]);
  const handleWidgetClick = (
    listData: UserFormAdminDTO[],
    listname: string
  ) => {
    // Truyền danh sách dữ liệu từ Widget vào TopCreatorTable khi người dùng click vào Widget
    setDataForTable(listData);
    setlistNameTable(listname);
  };

  console.log("get all ne", dataGetAll);
  const returnlistname = (listnametable: string): UserFormAdminDTO[] | null => {
    switch (listnametable) {
      case GLOBAL_LISTALLACCOUNT:
        // Xử lý trường hợp GLOBAL_LISTALLACCOUNT
        // Ví dụ:
        return dataGetAll?.model.listAllAccount || [];
      case GLOBAL_LISTALLBAND:
        // Xử lý trường hợp GLOBAL_LISTALLBAND
        // Ví dụ:
        return dataGetAll?.model.listBand || [];
      case GLOBAL_LISTMENTOR:
        // Xử lý trường hợp GLOBAL_LISTMENTOR
        // Ví dụ:
        return dataGetAll?.model.listMentor || [];
      case GLOBAL_LISTADMIN:
        // Xử lý trường hợp GLOBAL_LISTNEWMENTOR
        // Ví dụ:
        return dataGetAll?.model.listAdmin || [];
      case GLOBAL_LISTUSER:
        // Xử lý trường hợp GLOBAL_LISTUSER
        // Ví dụ:
        return dataGetAll?.model.listUser || [];

      default:
        // Trường hợp không khớp với bất kỳ giá trị nào được xác định
        return null;
    }
  };

  const handleWidgetClick1 = (
    DataUser: UserFormAdminDTO,
    typeupdate: string,
    listname: string
  ) => {
    // Truyền danh sách dữ liệu từ Widget vào TopCreatorTable khi người dùng click vào Widget
    // setDataForTable(listData);
    const listResult: UserFormAdminDTO[] | null = returnlistname(listname);

    const index: number | undefined = listResult?.findIndex(
      (t) => t.userId == DataUser.userId
    );
    listResult?.splice(index!, 1, DataUser);

    setDataForTable([...listResult!]);
    console.log("check data listresult", listResult);
    console.log("check data listresult", dataForTable);
    handleRowClick(DataUser);
  };
  useEffect(() => {
    setUserData(dataForTable[0]);
  }, [dataForTable]);

  return (
    <>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-5">
        <Widget
          icon={<IoMdHome className="h-7 w-7" />}
          title={"Tài khoản "}
          subtitle={
            CountAccount?.model?.listAllAccount.toString() || "Loading..."
          }
          newAccount={
            //@ts-ignore
            CountAccount?.model?.listNewMentor +
            //@ts-ignore
            CountAccount?.model?.listNewUser
          }
          onWidgetClick={() =>
            handleWidgetClick(
              dataGetAll?.model?.listAllAccount ?? [],
              GLOBAL_LISTALLACCOUNT
            )
          }
        />
        <Widget
          icon={<IoIosPerson className="h-6 w-6" />}
          title={"Số lượng Học Viên"}
          subtitle={CountAccount?.model?.listUser.toString() || "Loading..."}
          newAccount={CountAccount?.model?.listNewUser}
          onWidgetClick={() =>
            handleWidgetClick(
              dataGetAll?.model?.listUser ?? [],
              GLOBAL_LISTUSER
            )
          }
        />

        <Widget
          icon={<IoStar className="h-7 w-7" />}
          title={"Số lượng Người Hướng Dẫn"}
          subtitle={CountAccount?.model?.listMentor.toString() || "Loading..."}
          newAccount={CountAccount?.model?.listNewMentor}
          onWidgetClick={() =>
            handleWidgetClick(
              dataGetAll?.model?.listMentor ?? [],
              GLOBAL_LISTMENTOR
            )
          }
        />
        <Widget
          icon={<IoIosAlert className="h-6 w-6" />}
          title={"Số lượng tài khoản bị khóa"}
          subtitle={CountAccount?.model?.listBand.toString() || "Loading..."}
          onWidgetClick={() =>
            handleWidgetClick(
              dataGetAll?.model?.listBand ?? [],
              GLOBAL_LISTALLBAND
            )
          }
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Quản Trị Viên"}
          subtitle={CountAccount?.model?.listAdmin.toString() || "Loading..."}
          onWidgetClick={() =>
            handleWidgetClick(
              dataGetAll?.model?.listAdmin ?? [],
              GLOBAL_LISTADMIN
            )
          }
        />
      </div>

      {/* Charts */}
      {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div> */}

      {/* Tables & Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <TopCreatorTable
            // extra="mb-5"
            columnsData={tableColumnsTopCreators}
            tableData={dataForTable}
            onRowClick={handleRowClick}
            titleTable="Danh sách tài khoản"
          />
        </div>
        <div className="xl:col-span-2">
          {userData && (
            <Banner
              user={userData}
              listnametable={listNameTable}
              handlepropdata={handleWidgetClick1}
            />
          )}
        </div>
        {/* Check Table */}
        {/* <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div> */}

        {/* Traffic chart & Pie Chart */}
        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div> */}

        {/* Complex Table , Task & Calendar */}
        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}

        {/* Task chart & Calendar */}
        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default DashboardPage;
