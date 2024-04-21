"use client";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import StarBorder from "@mui/icons-material/StarBorder";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdDateRange,
  MdLabel,
  MdPageview,
  MdPeople,
  MdPersonSearch,
  MdSubject,
} from "react-icons/md";
import PostProfile from "../profile/post.profile";
import { formatBirthDay } from "../utils/utils";
import DateCalendar from "./app.search.date";
import { sendRequest } from "../utils/api";
import { GLOBAL_URL } from "../utils/veriable.global";
import SearchPeople from "./app.search.people";
import SearchMentor from "./app.search.mentor";
import SearchHashtag from "./app.search.hashtag";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface MySearch {
  listUserDTOs: UserAction[];
  listMentorDTOs: UserAction[];
  listHashtagDTOs: HashtagInfor[];
  listPostDTOs: ResPost[];
}

interface IPros {
  session: User;
}

const AppSearch = ({ session }: IPros) => {
  //tạo router xử lý bộ lọc
  const router = useRouter();
  const searchParams = useSearchParams();

  //Biến lấy danh sách thành phố
  const [provinces, setProvinces] = useState<Province[]>([]);
  //Biến lấy danh sách demand
  const [programingLanguage, setProgramingLanguage] = useState<
    MyLanguageProgram[]
  >([]);
  //lấy tất cả dữ liệu tìm kiếm
  const [searchAlls, setSearchAlls] = useState<MySearch>();
  //Biến lấy danh sách bài viết tìm được
  const [posts, setPosts] = useState<ResPost[]>([]);
  //Biến lấy danh sách người dùng tìm được
  const [peoples, setPeoples] = useState<UserAction[]>([]);
  //Biến lấy danh sách mentor tìm được
  const [mentors, setMentors] = useState<MentorInfor[]>([]);
  //Biến lấy danh sách bài viết tìm được
  const [hashtags, setHashtags] = useState<HashtagInfor[]>([]);

  //Biến xử lý city people
  const [cityPeople, setCityPeople] = useState<string>("");
  const [cityMentor, setCityMentor] = useState<string>("");
  const [demandPeople, setDemandPeople] = useState<string>("");
  const [demandMentor, setDemandMentor] = useState<string>("");

  // tạo biến xử lý ẩn hiện bộ lọc tìm kiếm
  const [openPost, setOpenPost] = useState(false);
  const [openAllPeople, setOpenAllPeople] = useState(false);
  const [openMentor, setOpenMentor] = useState(false);
  const [openHashtag, setOpenHashtag] = useState(false);

  // Hàm xử lý ẩn hiện bộ lọc bài đăng
  const handleClickPost = () => {
    setOpenPost(!openPost);
    setOpenAllPeople(false);
    setOpenMentor(false);
    setOpenHashtag(false);
  };
  // Hàm xử lý ẩn hiện bộ lọc mọi người
  const handleClickAllPeople = () => {
    setOpenPost(false);
    setOpenAllPeople(!openAllPeople);
    setOpenMentor(false);
    setOpenHashtag(false);
  };
  // Hàm xử lý ẩn hiện bộ lọc giảng viên
  const handleClickMentor = () => {
    setOpenPost(false);
    setOpenAllPeople(false);
    setOpenMentor(!openMentor);
    setOpenHashtag(false);
  };
  // Hàm xử lý ẩn hiện bộ lọc hashtag
  const handleClickHashtag = () => {
    setOpenPost(false);
    setOpenAllPeople(false);
    setOpenMentor(false);
    setOpenHashtag(!openHashtag);
  };

  // biến xử lý chi tiết bộ lọc
  const [sortOfPost, setSortOfPost] = useState<boolean>(false);
  const [sortLikeOfPost, setSortLikeOfPost] = useState<boolean>(false);
  const [dateOfPost, setDateOfPost] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Value>(null);
  const [endDate, setEndDate] = useState<Value>(new Date());
  const [tab, setTab] = useState<string>("name");
  const [dir, setDir] = useState<boolean>(false);

  // hàm xử lý sắp xếp bài viết
  const handleSortOfPost = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOfPost(event.target.checked);
  };
  // hàm xử lý sắp xếp theo lượt thích của bài viết
  const handleSortLikeOfPost = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortLikeOfPost(event.target.checked);
  };
  // hàm xử lý ngày đăng bài viết
  const handleDateOfPost = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfPost(event.target.checked);
  };
  // hàm xử lý ngày đăng bài viết
  const handleDirHashtag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDir(event.target.checked);
  };

  //xử lý chi tiết bộ lọc bài viết
  const handleFilterPost = () => {
    if (dateOfPost) {
      router.push(
        `/search?keyword=${searchParams.get(
          "keyword"
        )}&sort=${sortOfPost}&sortLike=${sortLikeOfPost}&startDate=${formatBirthDay(
          startDate as Date
        )}&endDate=${formatBirthDay(endDate as Date)}`
      );
    } else {
      router.push(
        `/search?keyword=${searchParams.get(
          "keyword"
        )}&sort=${sortOfPost}&sortLike=${sortLikeOfPost}`
      );
    }
  };
  //xử lý chi tiết bộ lọc mọi người
  const handleFilterPeople = () => {
    router.push(
      `/search?keyword=${searchParams.get(
        "keyword"
      )}&city=${cityPeople}&demands=${demandPeople}`
    );
  };
  //xử lý chi tiết bộ lọc mọi người
  const handleFilterMentor = () => {
    router.push(
      `/search?keyword=${searchParams.get(
        "keyword"
      )}&cityMentor=${cityMentor}&skill=${demandMentor}`
    );
  };
  //xử lý chi tiết bộ lọc mọi người
  const handleFilterHashtag = () => {
    router.push(
      `/search?keyword=${searchParams.get("keyword")}&tab=${tab}&dir=${dir}`
    );
  };

  const handleTabHashtag = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setTab(newAlignment);
  };

  // lấy danh sách thành phố
  useEffect(() => {
    const fetchDataProvince = async () => {
      try {
        const province = await sendRequest<Result<Province[]>>({
          url: "https://vapi.vnappmob.com/api/province/",
          method: "GET",
        });
        province && setProvinces(province.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataProvince();
  }, []);
  // lấy danh sách kỹ năng
  useEffect(() => {
    const fetchDataDemand = async () => {
      try {
        const response = await sendRequest<MyLanguageProgram[]>({
          url: GLOBAL_URL + "/api/programingLanguage",
          method: "GET",
        });
        response && setProgramingLanguage(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataDemand();
  }, []);

  //hàm xử lý thay đổi thành phố của mọi người
  const handleCityPeople = (event: SelectChangeEvent) => {
    setCityPeople(event.target.value);
  };
  //hàm xử lý thay đổi kỹ năng của mọi người
  const handleDemandPeople = (event: SelectChangeEvent) => {
    setDemandPeople(event.target.value);
  };
  //hàm xử lý thay đổi thành phố của mentor
  const handleCityMentor = (event: SelectChangeEvent) => {
    setCityMentor(event.target.value);
  };
  //hàm xử lý thay đổi kỹ năng của mentor
  const handleDemandMentor = (event: SelectChangeEvent) => {
    setDemandMentor(event.target.value);
  };

  // xử lý thay đổi nội dung tìm kiếm bài viết
  useEffect(() => {
    const dataFilter: {
      sort?: string;
      sortLike?: string;
      start?: string;
      end?: string;
    } = {};
    searchParams.get("sort") &&
      (dataFilter.sort =
        (searchParams.get("sort") as string) == "false" ? "asc" : "desc");
    searchParams.get("sortLike") &&
      (dataFilter.sortLike =
        (searchParams.get("sortLike") as string) == "false" ? "asc" : "desc");
    searchParams.get("startDate") &&
      (dataFilter.start = searchParams.get("startDate") as string);
    searchParams.get("endDate") &&
      (dataFilter.end = searchParams.get("endDate") as string);

    const refeshDataSearch = async () => {
      const newDataSearch = await sendRequest<ResPost[]>({
        url: GLOBAL_URL + "/api/search/post",
        method: "GET",
        headers: { authorization: `Bearer ${session?.access_token}` },
        queryParams: {
          page: 0,
          keyword: searchParams.get("keyword") as string,
          ...dataFilter,
        },
      });
      console.log(">>> check seaerch: ", newDataSearch);

      newDataSearch && setPosts(newDataSearch);
    };
    refeshDataSearch();
  }, [
    searchParams.get("keyword") as string,
    searchParams.get("sort") as string,
    searchParams.get("sortLike") as string,
    searchParams.get("startDate") as string,
    searchParams.get("endDate") as string,
  ]);

  // xử lý thay đổi nội dung tìm kiếm mọi người
  // useEffect(() => {
  //   const dataFilter: {
  //     city?: string;
  //     demands?: string;
  //   } = {};
  //   searchParams.get("city") &&
  //     (dataFilter.city = searchParams.get("city") as string);
  //   searchParams.get("demands") &&
  //     (dataFilter.demands = searchParams.get("demands") as string);

  //   const refeshDataSearch = async () => {
  //     const newDataSearch = await sendRequest<UserAction[]>({
  //       url: GLOBAL_URL + "/api/search/people",
  //       method: "GET",
  //       headers: { authorization: `Bearer ${session?.access_token}` },
  //       queryParams: {
  //         page: 0,
  //         keyword: searchParams.get("keyword") as string,
  //         ...dataFilter,
  //       },
  //     });
  //     console.log(">>> check newDataSearch people: ", newDataSearch);
  //     newDataSearch && setPeoples(newDataSearch);
  //   };
  //   refeshDataSearch();
  // }, [
  //   searchParams.get("keyword") as string,
  //   searchParams.get("city") as string,
  //   searchParams.get("demands") as string,
  // ]);

  // xử lý thay đổi nội dung tìm kiếm mentor
  // useEffect(() => {
  //   const dataFilter: {
  //     city?: string;
  //     skill?: string;
  //   } = {};
  //   searchParams.get("cityMentor") &&
  //     (dataFilter.city = searchParams.get("cityMentor") as string);
  //   searchParams.get("skill") &&
  //     (dataFilter.skill = searchParams.get("skill") as string);

  //   const refeshDataSearch = async () => {
  //     const newDataSearch = await sendRequest<MentorInfor[]>({
  //       url: GLOBAL_URL + "/api/search/mentor",
  //       method: "GET",
  //       headers: { authorization: `Bearer ${session?.access_token}` },
  //       queryParams: {
  //         page: 0,
  //         keyword: searchParams.get("keyword") as string,
  //         ...dataFilter,
  //       },
  //     });
  //     console.log(">>> check newDataSearch mentor: ", newDataSearch);
  //     newDataSearch && setMentors(newDataSearch);
  //   };
  //   refeshDataSearch();
  // }, [
  //   searchParams.get("keyword") as string,
  //   searchParams.get("cityMentor") as string,
  //   searchParams.get("skill") as string,
  // ]);

  // xử lý thay đổi nội dung tìm kiếm hashtag
  // useEffect(() => {
  //   const dataFilter: {
  //     tab?: string;
  //     dir?: string;
  //   } = {};
  //   searchParams.get("dir") &&
  //     (dataFilter.dir =
  //       (searchParams.get("dir") as string) == "false" ? "asc" : "desc");
  //   searchParams.get("tab") &&
  //     (dataFilter.tab = searchParams.get("tab") as string);

  //   const refeshDataSearch = async () => {
  //     const newDataSearch = await sendRequest<HashtagInfor[]>({
  //       url: GLOBAL_URL + "/api/search/hashtag",
  //       method: "GET",
  //       headers: { authorization: `Bearer ${session?.access_token}` },
  //       queryParams: {
  //         page: 0,
  //         keyword: searchParams.get("keyword") as string,
  //         ...dataFilter,
  //       },
  //     });
  //     console.log(">>> check newDataSearch hashtag: ", newDataSearch);
  //     newDataSearch && setHashtags(newDataSearch);
  //   };
  //   refeshDataSearch();
  // }, [
  //   searchParams.get("keyword") as string,
  //   searchParams.get("dir") as string,
  //   searchParams.get("tab") as string,
  // ]);

  useEffect(() => {
    const refeshDataSearch = async () => {
      if (session) {
        const newDataSearch = await sendRequest<MySearch>({
          url: GLOBAL_URL + "/api/search/all",
          method: "GET",
          headers: { authorization: `Bearer ${session?.access_token}` },
          queryParams: {
            page: 0,
            keyword: searchParams.get("keyword") as string,
          },
        });
        newDataSearch && setSearchAlls(newDataSearch);
        console.log(">>> check newDataSearch: ", newDataSearch);
      }
    };
    refeshDataSearch();
  }, [searchParams.get("keyword") as string, session]);
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
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <MdPageview className="h-6 w-6" />
                </ListItemIcon>
                <ListItemText primary="Bài viết" />
                {openPost ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openPost} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Sắp xếp" />
                    <Switch onChange={handleSortOfPost} checked={sortOfPost} />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Sắp xết theo lượt thích" />
                    <Switch
                      onChange={handleSortLikeOfPost}
                      checked={sortLikeOfPost}
                    />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4, flexDirection: "column" }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ListItemText primary="Ngày đăng" />
                      <Switch
                        onChange={handleDateOfPost}
                        checked={dateOfPost}
                      />
                    </Box>
                  </ListItemButton>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Collapse in={dateOfPost}>
                      <DateCalendar
                        text={"Bất đầu"}
                        startDate={startDate}
                        setStartDate={setStartDate}
                      />
                      -
                      <DateCalendar
                        text={"Kết thúc"}
                        startDate={endDate}
                        setStartDate={setEndDate}
                      />
                    </Collapse>
                    {endDate && endDate <= new Date() ? (
                      startDate && startDate > endDate ? (
                        <Typography sx={{ color: "red" }}>
                          Ngày bất đầu nhỏ hơn ngày kết thúc!
                        </Typography>
                      ) : (
                        ""
                      )
                    ) : (
                      <Typography sx={{ color: "red" }}>
                        Ngày kết thúc nhỏ hơn hoặc bằng hiện tại !
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="secondary"
                      variant="outlined"
                      sx={{ margin: "12px 28px 16px 0" }}
                      onClick={handleFilterPost}
                    >
                      Lọc
                    </Button>
                  </Box>
                </List>
              </Collapse>

              {/* Hiển thị bộ lọc mọi người */}
              <ListItemButton onClick={handleClickAllPeople}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <MdPeople className="h-6 w-6" />
                </ListItemIcon>
                <ListItemText primary="Mọi người" />
                {openAllPeople ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAllPeople} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel id="city-select-label">
                        Tỉnh/Thành phố
                      </InputLabel>
                      <Select
                        labelId="city-select-label"
                        id="city-select"
                        value={cityPeople}
                        label="Tỉnh/Thành phố"
                        onChange={handleCityPeople}
                      >
                        {provinces?.map((province) => (
                          <MenuItem
                            value={province?.province_name}
                            key={province?.province_id}
                          >
                            {province?.province_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demand-people-select-label">
                        Kỹ năng
                      </InputLabel>
                      <Select
                        labelId="demand-people-select-label"
                        id="demand-people-select"
                        value={demandPeople}
                        label="Kỹ năng"
                        onChange={handleDemandPeople}
                      >
                        {programingLanguage?.map((programingL) => (
                          <MenuItem
                            value={programingL.languageName}
                            key={programingL?.id}
                          >
                            {programingL.languageName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItemButton>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="secondary"
                      variant="outlined"
                      sx={{ margin: "12px 16px 16px 0" }}
                      onClick={handleFilterPeople}
                    >
                      Lọc
                    </Button>
                  </Box>
                </List>
              </Collapse>

              {/* Hiển thị bộ lọc giảng viên */}
              <ListItemButton onClick={handleClickMentor}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <MdPersonSearch className="h-6 w-6" />
                </ListItemIcon>
                <ListItemText primary="Giảng viên" />
                {openMentor ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMentor} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel id="city-mentor-select-label">
                        Tỉnh/Thành phố
                      </InputLabel>
                      <Select
                        labelId="city-mentor-select-label"
                        id="city-mentor-select"
                        value={cityMentor}
                        label="Tỉnh/Thành phố"
                        onChange={handleCityMentor}
                      >
                        {provinces?.map((province) => (
                          <MenuItem
                            value={province?.province_name}
                            key={province?.province_id}
                          >
                            {province?.province_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demand-mentor-select-label">
                        Kỹ năng
                      </InputLabel>
                      <Select
                        labelId="demand-mentor-select-label"
                        id="demand-mentor-select"
                        value={demandMentor}
                        label="Kỹ năng"
                        onChange={handleDemandMentor}
                      >
                        {programingLanguage?.map((programingL) => (
                          <MenuItem
                            value={programingL.languageName}
                            key={programingL?.id}
                          >
                            {programingL.languageName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItemButton>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="secondary"
                      variant="outlined"
                      sx={{ margin: "12px 16px 16px 0" }}
                      onClick={handleFilterMentor}
                    >
                      Lọc
                    </Button>
                  </Box>
                </List>
              </Collapse>

              {/* Hiển thị bộ lọc hashtag */}
              <ListItemButton onClick={handleClickHashtag}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Hashtag" />
                {openHashtag ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openHashtag} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Sắp xếp" />
                    <Switch onChange={handleDirHashtag} checked={dir} />
                  </ListItemButton>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ToggleButtonGroup
                      color="primary"
                      value={tab}
                      exclusive
                      onChange={handleTabHashtag}
                      aria-label="Platform"
                    >
                      <ToggleButton value="name">Tên</ToggleButton>
                      <ToggleButton value="createDate">Ngày tạo</ToggleButton>
                      <ToggleButton value="popular">Thịnh hành</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </List>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    sx={{ margin: "12px 24px 16px 0" }}
                    onClick={handleFilterHashtag}
                  >
                    Lọc
                  </Button>
                </Box>
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
          {searchAlls && (
            <Box sx={{ width: "1000px" }}>
              <SearchPeople
                searchAlls={searchAlls}
                session={session}
                setSearchAlls={setSearchAlls}
              />
              <SearchMentor
                peoples={searchAlls?.listMentorDTOs}
                session={session}
                setPeoples={setPeoples}
              />
              <SearchHashtag hashtags={searchAlls?.listHashtagDTOs} />
              <PostProfile session={session} search="/search/post" />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default AppSearch;
