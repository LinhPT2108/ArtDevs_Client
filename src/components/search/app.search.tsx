"use client";
import {
  Divider,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import FeedIcon from "@mui/icons-material/Feed";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SchoolIcon from "@mui/icons-material/School";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";
interface IPros {
  session: User;
}

const AppSearch = ({ session }: IPros) => {
  const [value, setValue] = React.useState(0);
  const param = useSearchParams();
  const keyword = param.get("keyword");

  const [alignment, setAlignment] = React.useState("posts");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body1"
            color="initial"
            fontSize={"26px"}
            fontWeight={"bold"}
            py={2}
            mr={1}
          >
            Kết quả tìm kiếm:
          </Typography>
          <Typography variant="body1" color="initial" fontSize={"26px"}>
            {keyword}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            color="initial"
            fontSize={"16px"}
            fontWeight={"bold"}
          >
            Có 100 Kết quả
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{
              marginBottom: "5px",
              fontSize: "16px",
            }}
          >
            <ToggleButton value="posts">
              <FeedIcon /> Bài viết
            </ToggleButton>
            <ToggleButton value="people">
              <PeopleIcon />
              Mọi người
            </ToggleButton>
            <ToggleButton value="mentor">
              <SchoolIcon />
              Giảng viên
            </ToggleButton>
            <ToggleButton value="hashtag">
              <LocalOfferIcon />
              Hashtag
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box className="site-filter">
            
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};
export default AppSearch;
