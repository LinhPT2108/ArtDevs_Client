"use client";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import PostProfile from "../profile/post.profile";
import {
  MdDateRange,
  MdLabel,
  MdList,
  MdPageview,
  MdPeople,
  MdPeopleAlt,
  MdPeopleOutline,
  MdPersonSearch,
  MdSubject,
} from "react-icons/md";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface IPros {
  session: User;
}

const AppSearch = ({ session }: IPros) => {
  // tạo biến xử lý ẩn hiện bộ lọc tìm kiếm
  const [openPost, setOpenPost] = useState(true);
  const [openAllPeople, setOpenAllPeople] = useState(true);
  const [openMentor, setOpenMentor] = useState(true);
  const [openHashtag, setOpenHashtag] = useState(true);

  // Hàm xử lý ẩn hiện bộ lọc bài đăng
  const handleClickPost = () => {
    setOpenPost(!openPost);
  };
  // Hàm xử lý ẩn hiện bộ lọc mọi người
  const handleClickAllPeople = () => {
    setOpenAllPeople(!openAllPeople);
  };
  // Hàm xử lý ẩn hiện bộ lọc giảng viên
  const handleClickMentor = () => {
    setOpenMentor(!openMentor);
  };
  // Hàm xử lý ẩn hiện bộ lọc hashtag
  const handleClickHashtag = () => {
    setOpenHashtag(!openHashtag);
  };

  // Taọ biến lấy giá trị search
  const searchParams = useSearchParams();
  // const [keyword, setKeyword] = useState<string>(
  //   searchParams.get("keyword") as string
  // );
  // useEffect(() => {
  //   setKeyword(searchParams.get("keyword") as string);
  // }, [searchParams.get("keyword")]);

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", marginTop: "100px" }}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box
          sx={{
            position: "relative",
            width: "320px",
          }}
        >
          <Box
            sx={{
              position: "fixed",
              padding: "12px",
              width: "320px",
              borderRight: "1px solid gray",
              height: "100%",
            }}
          >
            <Box
              sx={{
                color: "#000",
                fontWeight: "bold",
                fontSize: "20px",
                paddingLeft: "16px",
              }}
            >
              Kết quả tìm kiếm
            </Box>
            <Divider
              sx={{
                marginLeft: "16px",
                padding: "4px 0",
              }}
            />
            <List
              sx={{ width: "100%" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  sx={{
                    backgroundColor: "transparent",
                    color: "#000",
                    fontSize: "16px",
                  }}
                >
                  Bộ lọc
                </ListSubheader>
              }
            >
              {/* Hiển thị bộ lọc bài đăng */}
              <ListItemButton onClick={handleClickPost}>
                <ListItemIcon>
                  <MdPageview className="h-6 w-6" />
                </ListItemIcon>
                <ListItemText primary="Bài viết" />
                {openPost ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openPost} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <MdDateRange className="h-6 w-6" />
                    </ListItemIcon>
                    <ListItemText primary="Ngày đăng" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Lượt thích" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Hiển thị bộ lọc mọi người */}
              <ListItemButton onClick={handleClickAllPeople}>
                <ListItemIcon>
                  <MdPeople className="h-6 w-6" />
                </ListItemIcon>
                <ListItemText primary="Mọi người" />
                {openAllPeople ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAllPeople} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <MdLabel className="h-6 w-6" />
                    </ListItemIcon>
                    <ListItemText primary="Tỉnh/Thành phố" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <MdSubject className="h-6 w-6" />
                    </ListItemIcon>
                    <ListItemText primary="Demand" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Hiển thị bộ lọc giảng viên */}
              <ListItemButton onClick={handleClickMentor}>
                <ListItemIcon>
                  <MdPersonSearch className="h-6 w-6" />
                </ListItemIcon>
                <ListItemText primary="Giảng viên" />
                {openMentor ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMentor} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <MdLabel className="h-6 w-6" />
                    </ListItemIcon>
                    <ListItemText primary="Tỉnh/Thành phố" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <MdSubject className="h-6 w-6" />
                    </ListItemIcon>
                    <ListItemText primary="Demand" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Hiển thị bộ lọc hashtag */}
              <ListItemButton onClick={handleClickHashtag}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Hashtag" />
                {openHashtag ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openHashtag} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <MdDateRange className="h-6 w-6" />
                    </ListItemIcon>
                    <ListItemText primary="Ngày đăng" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Số lượt sử dụng của hashtag" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            padding: "24px 12px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "1000px" }}>
            <PostProfile
              session={session}
              search="/search/post"
              searchContent={searchParams.get("keyword")}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default AppSearch;
