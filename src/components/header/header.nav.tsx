"use client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SchoolIcon from "@mui/icons-material/School";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GLOBAL_BG_NAV, GLOBAL_COLOR_NAV } from "../utils/veriable.global";

const IconTabs = () => {
  // gắn giá trị định hình vị trí tab đang chọn
  const [value, setValue] = useState<number | null>(0);

  // lấy url hiện tại
  const currentPath = usePathname();

  //tạo biến router xử lý chuyển hướng tab
  const router = useRouter();

  // xử lý khi change tab
  const handleChangeNavTab = (newValue: number | null) => {
    if (newValue == 4) {
      if (currentPath == "/") {
        setValue(0);
      } else if (currentPath == "/friend-post") {
        setValue(1);
      } else if (currentPath == "/mentor") {
        setValue(2);
      } else if (currentPath == "/profile") {
        setValue(3);
      } else {
        setValue(4);
      }
    } else {
      if (newValue == 0 && currentPath !== "/") {
        router.push("/");
      } else if (newValue == 1 && currentPath != "/friend-post") {
        router.push("/friend-post");
      } else if (newValue == 2 && currentPath != "/mentor") {
        router.push("/mentor?tab=all");
      } else if (newValue == 3 && currentPath != "/profile") {
        router.push("/profile");
      } else {
      }
    }
  };

  useEffect(() => {
    handleChangeNavTab(4);
  }, [currentPath]);
  return (
    <Tabs
      sx={{
        display: { xs: "none", md: "flex" },
        marginLeft: { md: "6px", lg: "24px" },
        "& .MuiButtonBase-root": {
          backgroundColor: "#d5d8db2e",
        },
        "& .Mui-selected": {
          backgroundColor: "#2d679785",
          transition: "all 0.3s ease-in",
          boxShadow: " 0px 0px 0px 1px rgba(0, 0, 0, 0.2)",
        },
        "& .MuiTabs-indicator": {
          display: "none",
        },
      }}
      value={value}
      onChange={(event, newValue) => {
        handleChangeNavTab(newValue);
      }}
      aria-label="icon tabs example"
    >
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          borderRadius: "100%",
          backgroundColor: GLOBAL_BG_NAV,
          color: GLOBAL_COLOR_NAV,
        }}
        icon={<HomeIcon />}
        aria-label="phone"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          borderRadius: "100%",
          backgroundColor: GLOBAL_BG_NAV,
          color: GLOBAL_COLOR_NAV,
        }}
        icon={<RecentActorsIcon />}
        aria-label="favorite"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          backgroundColor: GLOBAL_BG_NAV,
          color: GLOBAL_COLOR_NAV,
          borderRadius: "100%",
        }}
        icon={<SchoolIcon />}
        aria-label="person"
      />
      <Tab
        sx={{
          minWidth: { md: "50px", lg: "50px" },
          padding: "10px 0",
          margin: "6px",
          backgroundColor: GLOBAL_BG_NAV,
          color: GLOBAL_COLOR_NAV,
          borderRadius: "100%",
        }}
        icon={<AccountCircleIcon />}
        aria-label="favorite"
      />
    </Tabs>
  );
};
export default IconTabs;
