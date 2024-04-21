"use client";
import { Grid, Slide, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import MentorAccept from "../left-menu/right-menu/menu.mentoraccept";
import MentorSuitable from "./component/MentorSuitable";
import AllMentor from "./component/allMentor";
import MentorIsReady from "./component/mentorIsReady";
import { useRouter, useSearchParams } from "next/navigation";
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
  //biến lấy giá trị tab mentor
  const [value, setValue] = useState<number>(0);

  //biến lấy giá trị tâb
  const search = useSearchParams();
  //biến chuyển hướng
  const router = useRouter();

  //xử lý chuyển hướng tab
  // const handleChangeTab = (v:string)=>{
  //   router.push("/mentor?tab="+v)
  // }

  const handleChangeTab = (newValue: number | null) => {
    if (newValue == 4) {
      if ((search.get("tab") as string) == "suggest") {
        setValue(0);
      } else if ((search.get("tab") as string) == "suitable") {
        setValue(1);
      } else if ((search.get("tab") as string) == "all") {
        setValue(2);
      } else {
        setValue(4);
      }
    } else {
      if (newValue == 0 && (search.get("tab") as string) != "suggest") {
        router.push("/mentor?tab=suggest");
      } else if (newValue == 1 && (search.get("tab") as string) != "suitable") {
        router.push("/mentor?tab=suitable");
      } else if (newValue == 2 && (search.get("tab") as string) != "all") {
        router.push("/mentor?tab=all");
      } else {
      }
    }
  };

  useEffect(() => {
    handleChangeTab(4);
  }, [search.get("tab") as string]);

  //xử lý thay đổi tab mentor
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    handleChangeTab(newValue);
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
                    {/* tab mentor */}
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Gợi ý"
                        {...a11yProps(0)}
                        sx={{
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      />
                      <Tab
                        label="Phù Hợp"
                        {...a11yProps(1)}
                        sx={{
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      />
                      <Tab
                        label="Tất cả"
                        {...a11yProps(2)}
                        sx={{
                          fontSize: "16px",
                          fontWeight: "bold",
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
