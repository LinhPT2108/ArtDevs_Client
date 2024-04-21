"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Rating,
  Slide,
  Snackbar,
  Tab,
  Tabs,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CubeSpan } from "../utils/component.global";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import useSWR, { SWRResponse } from "swr";
import { formatVND } from "../utils/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_URL,
} from "../utils/veriable.global";
import { TransitionProps } from "@mui/material/transitions";
import MentorAccept from "../left-menu/right-menu/menu.mentoraccept";
import HomeFriend from "../friend/home.friend";
import HistoryCard from "@/app/(admin)/admin/(dashboard)/nft-marketplace/components/HistoryCard";
import TaskCard from "@/app/(admin)/admin/(dashboard)/dashboard/components/TaskCard";
import General from "@/app/(admin)/admin/(dashboard)/profile/components/General";
import MentorIsReady from "./component/mentorIsReady";
import AllMentor from "./component/allMentor";
import MentorSuitable from "./component/MentorSuitable";
import NftCard from "../admin/card/NftCard";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
interface IPros {
  user: User;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const HomeMentor = ({ user }: IPros) => {
  const [value, setValue] = useState(0);

  // var router = useRouter();
  // const fetchData = async (url: string) => {
  //   return await sendRequest<MentorInfor[]>({
  //     url: url,
  //     method: "GET",
  //     headers: { authorization: `Bearer ${user?.access_token}` },
  //   });
  // };
  // const { data, error, isLoading }: SWRResponse<MentorInfor[], any> = useSWR(
  //   GLOBAL_URL + "/api/get-mentor",
  //   fetchData,
  //   {
  //     shouldRetryOnError: false, // Ngăn SWR thử lại yêu cầu khi có lỗi
  //     revalidateOnFocus: true, // Tự động thực hiện yêu cầu lại khi trang được focus lại
  //   }
  // );

  // const sendMatchRequest = async (mentorId: string): Promise<boolean> => {
  //   try {
  //     // Thực hiện cuộc gọi API ở đây
  //     const response = await fetch(`${GLOBAL_URL}/api/send-match/${mentorId}`, {
  //       method: "POST", // hoặc 'GET' tùy thuộc vào yêu cầu của bạn
  //       headers: {
  //         authorization: `Bearer ${user?.access_token}`,
  //       },
  //       // Các tùy chọn khác nếu cần
  //     });
  //     console.log(response);
  //     // Xử lý kết quả
  //     const data = await response.json();

  //     return data; // Giả sử API trả về một trường success kiểu boolean
  //   } catch (error) {
  //     console.error("Error sending match:", error);
  //     return false; // Trả về false nếu có lỗi
  //   }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: "24px" }}>
      <Grid
        container
        columns={12}
        spacing={2}
        sx={{
          "& .MuiGrid-item": {
            padding: { xs: "0 0 16px 16px", md: "0 0 0 16px" },
          },
        }}
      >
        {user?.user?.role?.id == 3 ? (
          <MentorAccept session={user} />
        ) : (
          <Box
            sx={{
              width: "100%",
              "& .css-1phy807": {
                paddingY: 0,
              },
            }}
          >
            <Box>
              {/* Header */}
              <div className="mt-2 mb-8 w-full">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h2 className="px-2 text-2xl font-bold text-navy-700 dark:text-white">
                    Người hướng dẫn
                  </h2>
                  <div style={{ marginLeft: "auto" }}>
                    {" "}
                    {/* Sử dụng margin-left: auto để đẩy Tabs sang phải */}
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Gợi ý"
                        {...a11yProps(0)}
                        sx={{
                          // Sử dụng sx để tùy chỉnh CSS cho label
                          fontSize: "16px", // Tùy chỉnh kích thước chữ của label
                          fontWeight: "bold", // Tùy chỉnh độ đậm của chữ
                          // Thêm các thuộc tính CSS khác tùy thuộc vào nhu cầu của bạn
                        }}
                      />
                      <Tab
                        label="Phù Hợp"
                        {...a11yProps(1)}
                        sx={{
                          // Sử dụng sx để tùy chỉnh CSS cho label
                          fontSize: "16px", // Tùy chỉnh kích thước chữ của label
                          fontWeight: "bold", // Tùy chỉnh độ đậm của chữ
                          // Thêm các thuộc tính CSS khác tùy thuộc vào nhu cầu của bạn
                        }}
                      />
                      <Tab
                        label="Tất cả"
                        {...a11yProps(2)}
                        sx={{
                          // Sử dụng sx để tùy chỉnh CSS cho label
                          fontSize: "16px", // Tùy chỉnh kích thước chữ của label
                          fontWeight: "bold", // Tùy chỉnh độ đậm của chữ
                          // Thêm các thuộc tính CSS khác tùy thuộc vào nhu cầu của bạn
                        }}
                      />
                    </Tabs>
                  </div>
                </div>
                <p className="mt-2 px-2 text-lg text-gray-600">
                  Người hướng dẫn trong lập trình đóng vai trò quan trọng trong
                  việc hỗ trợ người mới học. Họ cung cấp kiến thức cơ bản, giúp
                  giải quyết vấn đề, chia sẻ kinh nghiệm và lời khuyên, cùng hỗ
                  trợ trong việc xây dựng dự án. Nhờ sự hướng dẫn của họ, người
                  mới học có cơ hội phát triển kỹ năng lập trình và tiếp cận một
                  cộng đồng chia sẻ kiến thức.
                </p>
              </div>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Box
                sx={{
                  width: "100%",
                  padding: "20px 0px",
                }}
              >
                <MentorIsReady session={user} />
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Box
                sx={{
                  width: "100%",
                  padding: "20px 0px",
                }}
              >
                <Box>
                  <MentorSuitable session={user} />
                </Box>
              </Box>
            </CustomTabPanel>{" "}
            <CustomTabPanel value={value} index={2}>
              <Box
                sx={{
                  width: "100%",
                  padding: "20px 0px",
                }}
              >
                <Box>
                  <AllMentor session={user} />
                </Box>
              </Box>
            </CustomTabPanel>
          </Box>
        )}
      </Grid>
    </Box>
  );
};
export default HomeMentor;
