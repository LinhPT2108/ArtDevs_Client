"use client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SchoolIcon from "@mui/icons-material/School";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BottomNavbar = () => {
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
    <Box sx={{ pb: 7 }}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2000 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            handleChangeNavTab(newValue);
          }}
        >
          <BottomNavigationAction label="Trang chủ" icon={<HomeIcon />} />
          <BottomNavigationAction
            label="Bài viết bạn bè"
            icon={<SchoolIcon />}
          />
          <BottomNavigationAction
            label="Giảng viên"
            icon={<RecentActorsIcon />}
          />
          <BottomNavigationAction
            label="Trang cá nhân"
            icon={<AccountCircleIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
export default BottomNavbar;
