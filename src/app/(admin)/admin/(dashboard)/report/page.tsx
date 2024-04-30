"use client";
import Box from "@mui/material/Box";

import { sendRequest } from "@/components/utils/api";
import useSWR, { SWRResponse } from "swr";
import {
  GLOBAL_LISTUSERREPORT1,
  GLOBAL_LISTUSERREPORT2,
  GLOBAL_LISTUSERREPORT3,
  GLOBAL_URL,
} from "@/components/utils/veriable.global";
import ComplexTable from "./table/ReportTable";

import { useEffect, useState } from "react";
import ReportTable from "./table/ReportTable";
import Storage from "./table/Storage";
import {
  BsExclamationCircle,
  BsExclamationCircleFill,
  BsExclamationOctagonFill,
} from "react-icons/bs";
import { Button, Modal } from "@mui/material";
import { tableColumnsTopCreators } from "../dashboard/variables/tableColumnsTopCreators";
import TopCreatorTable from "../dashboard/components/table/TableTopCreators";
import UserForm from "./component/Userform";
import {
  columnsDataPostReport,
  columnsDataReport,
} from "../dashboard/variables/columnsData";
import PostReportTable from "./table/PostReportTable";
import Banner from "../dashboard/components/table/Banner";
import Banner1 from "../feedback-user/components/Banner";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1300,
  height: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const style2 = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Example = () => {
  const [dataForTableReport, setDataForTableReport] = useState<Report[]>([]);
  const [dataForTablePostReport, setDataForTablePostReport] = useState<Post[]>(
    []
  );
  const [dataForTableUserReport, setDataForTableUserReport] = useState<
    UserFormAdminDTO[]
  >([]);
  const [openModalReport, setOpenModalReport] = useState(false);
  const [openModalPostReport, setOpenModalPostReport] = useState(false);
  const [openModalUserReport, setOpenModalUserReport] = useState(false);
  const [openModalUserDetail, setOpenModalUserDetail] = useState(false);
  const [userData, setUserData] = useState<UserFormAdminDTO | null>(null);
  const [listNameTable, setlistNameTable] = useState<string>("");
  const handleOpenModalReport = (datatable: Report[]) => {
    setOpenModalReport(true);
    setDataForTableReport(datatable);
  };
  const handleCloseModalReport = () => setOpenModalReport(false);

  const handleOpenModalPostReport = (datatable: Post[]) => {
    setOpenModalPostReport(true);
    setDataForTablePostReport(datatable);
  };
  const handleCloseModalPostReport = () => setOpenModalPostReport(false);

  const handleOpenModalUserReport = (
    datatable: UserFormAdminDTO[],
    listnametable: string
  ) => {
    setOpenModalUserReport(true);
    setDataForTableUserReport(datatable);
    setlistNameTable(listnametable);
  };
  const handleCloseModalUserReport = () => setOpenModalUserReport(false);

  const handleCloseModalUserDetail = () => setOpenModalUserDetail(false);

  const handleRowClick = (rowData: UserFormAdminDTO) => {
    // Xử lý dữ liệu của hàng được chọn tại đây, ví dụ:
    setUserData(rowData);
    setOpenModalUserDetail(true);
    // Truyền dữ liệu sang component Banner
    // Implement your logic here
  };
  // Xử lý lấy dữ liệu

  const fetchData = async (url: string) => {
    return await sendRequest<ReponseReportFormAdmin>({
      url: url,
      method: "GET",
    });
  };
  const {
    data: dataGetAll,
    error,
    isLoading,
    mutate,
  }: SWRResponse<ReponseReportFormAdmin, any> = useSWR(
    `${GLOBAL_URL}/api/admin/get-all-report`,
    fetchData,
    {
      shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
      revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
    }
  );

  //end sử lý lấy dữ liệu
  const handleUnlockPost = (postId: string) => {
    const newListPostisDel = dataGetAll?.model?.listPostisDel.filter(
      (post) => post?.postId != postId
    );
    if (newListPostisDel) {
      const updatedData = {
        ...dataGetAll,
        model: {
          ...dataGetAll?.model,
          listPostisDel: newListPostisDel,
        },
      };
      //@ts-ignore
      mutate(updatedData, false);
      setDataForTablePostReport(newListPostisDel);
    }
  };

  const handleLockPost = (postId: string) => {
    const newListReport = dataGetAll?.model?.listReport.filter(
      (report) => report.reportPostId != postId
    );
    if (newListReport) {
      const updatedData = {
        ...dataGetAll,
        model: {
          ...dataGetAll?.model,
          listReport: newListReport,
        },
      };
      //@ts-ignore
      mutate(updatedData, false);
      setDataForTableReport(newListReport);
    }
  };

  const handleLockReport = (reportId: number) => {
    const newListReport = dataGetAll?.model?.listReport.filter(
      (report) => report.id != reportId
    );
    if (newListReport) {
      const updatedData = {
        ...dataGetAll,
        model: {
          ...dataGetAll?.model,
          listReport: newListReport,
        },
      };
      //@ts-ignore
      mutate(updatedData, false);
      setDataForTableReport(newListReport);
    }
  };

  const returnlistname = (listnametable: string): UserFormAdminDTO[] | null => {
    switch (listnametable) {
      case GLOBAL_LISTUSERREPORT1:
        // Xử lý trường hợp GLOBAL_LISTALLACCOUNT
        // Ví dụ:
        return dataGetAll?.model.listUserReport1 || [];
      case GLOBAL_LISTUSERREPORT2:
        // Xử lý trường hợp GLOBAL_LISTALLBAND
        // Ví dụ:
        return dataGetAll?.model.listUserReport2 || [];
      case GLOBAL_LISTUSERREPORT3:
        // Xử lý trường hợp GLOBAL_LISTMENTOR
        // Ví dụ:
        return dataGetAll?.model.listUserReport3 || [];

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

    setDataForTableUserReport([...listResult!]);
    handleRowClick(DataUser);
  };
  // Sử dụng hook useEffect để cập nhật state dataForTable khi dataGetAll thay đổi

  return (
    <Box sx={{ flexGrow: 2 }}>
      <div className="mt-10 grid h-full grid-cols-1 gap-20 md:grid-cols-2">
        <Storage
          title="Báo Cáo Mới"
          total={dataGetAll?.model.listNewReport.length || 0}
          description="Thông tin báo cáo mới trong 24h"
          icon={<BsExclamationOctagonFill />}
          onClick={() =>
            handleOpenModalReport(dataGetAll?.model.listNewReport || [])
          }
        />
        <Storage
          title="Tổng Hợp Báo Cáo"
          total={dataGetAll?.model.listReport.length || 0}
          description="Tổng hợp danh sách tất cả các báo cáo chưa xử lý"
          icon={<BsExclamationOctagonFill />}
          onClick={() =>
            handleOpenModalReport(dataGetAll?.model.listReport || [])
          }
        />
      </div>
      <div className="mt-10 grid h-full grid-cols-1 gap-20 md:grid-cols-2">
        <Storage
          title="Tài Khoản Bị Báo Cáo Lần 1"
          total={dataGetAll?.model.listUserReport1.length || 0}
          description="Thông tin các tài khoản bị báo cáo lần 1"
          icon={<BsExclamationCircle />}
          onClick={() =>
            handleOpenModalUserReport(
              dataGetAll?.model.listUserReport1 || [],
              GLOBAL_LISTUSERREPORT1
            )
          }
        />

        <Storage
          title="Tài Khoản bị báo cáo lần 2"
          total={dataGetAll?.model.listUserReport2.length || 0}
          description="Thông tin các tài khoản bị báo cáo lần 2"
          icon={<BsExclamationCircleFill />}
          onClick={() =>
            handleOpenModalUserReport(
              dataGetAll?.model.listUserReport2 || [],
              GLOBAL_LISTUSERREPORT2
            )
          }
        />
      </div>

      <div className="mt-10 grid h-full grid-cols-1 gap-20 md:grid-cols-2">
        <Storage
          title="Tài Khoản bị báo cáo lần 3 +"
          total={dataGetAll?.model.listUserReport3.length || 0}
          description="Thông tin các tài khoản bị báo cáo lần 3+"
          icon={<BsExclamationOctagonFill />}
          onClick={() =>
            handleOpenModalUserReport(
              dataGetAll?.model.listUserReport3 || [],
              GLOBAL_LISTUSERREPORT3
            )
          }
        />
        <Storage
          title="Bài viết bị khóa"
          total={dataGetAll?.model.listPostisDel.length || 0}
          description="Danh sách các bài viết bị khóa"
          icon={<BsExclamationOctagonFill />}
          onClick={() =>
            handleOpenModalPostReport(dataGetAll?.model.listPostisDel || [])
          }
        />
      </div>
      <Modal
        keepMounted
        open={openModalReport}
        onClose={handleCloseModalReport}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <ReportTable
            columnsData={columnsDataReport}
            tableData={dataForTableReport}
            handlelockPost={handleLockPost}
            handlelockRePort={handleLockReport}
          />
        </Box>
      </Modal>

      <Modal
        keepMounted
        open={openModalPostReport}
        onClose={handleCloseModalPostReport}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <PostReportTable
            columnsData={columnsDataPostReport}
            tableData={dataForTablePostReport}
            handleUnlockPost={handleUnlockPost}
          />
        </Box>
      </Modal>

      <Modal
        keepMounted
        open={openModalUserReport}
        onClose={handleCloseModalUserReport}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <TopCreatorTable
            columnsData={tableColumnsTopCreators}
            tableData={dataForTableUserReport}
            onRowClick={handleRowClick}
            titleTable={""}
          />
        </Box>
      </Modal>

      <Modal
        keepMounted
        open={openModalUserDetail}
        onClose={handleCloseModalUserDetail}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style2}>
          {userData && (
            <UserForm
              listnametable={listNameTable}
              handlepropdata={handleWidgetClick1}
              user={userData}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};
export default Example;
