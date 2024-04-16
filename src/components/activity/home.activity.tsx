"use client";
import Box from "@mui/material/Box";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
import useSWR, { SWRResponse } from "swr";
import { useEffect } from "react";
interface IPros {
  session: User;
}
const HomeActivity = ({ session }: IPros) => {
  //lấy dữ liệu lịch sử hoạt đ
  const fetchData = async (url: string) => {
    const data = await sendRequest({
      url: url,
      method: "GET",
    });
    console.log(">>> check data: ", data);
  };
  fetchData(GLOBAL_URL + "/api/log");

  //   const {
  //     data,
  //     error,
  //     isLoading,
  //     mutate,
  //   }: SWRResponse<IModelPaginate<HashtagInfor>, any> = useSWR(
  //     GLOBAL_URL + "/api/log",
  //     fetchData,
  //     {
  //       shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
  //       revalidateOnFocus: false, // Tự động thực hiện yêu cầu lại khi trang được focus lại
  //     }
  //   );

  return <Box sx={{ flexGrow: 1 }}>HomeActivity</Box>;
};
export default HomeActivity;
