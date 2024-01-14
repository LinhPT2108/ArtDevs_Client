import * as React from "react";

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import Link from "next/link";
import IosShareIcon from "@mui/icons-material/IosShare";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const OptionChat = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: { xs: "0", md: "97px" },
        overflow: "hidden",
        position: "relative",
        ":hover": {
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "0px",
            visibility: "visible",
            transition: "width 0.5s",
          },
        },
        "::-webkit-scrollbar": {
          width: "0px",
          position: "fixed",
          top: "0",
          right: "0",
          transition: "width 0.5s",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#4CAF50",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
      }}
    >
      <Avatar
        alt="Remy Sharp"
        src="/logo.png"
        sx={{
          width: 56,
          height: 56,
          boxShadow: "0px 0px 5px 1px gray",
          marginTop: "12px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "12px",
          "& a": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
            color: "black",
            width: "70px",
          },
        }}
      >
        <Link href="/">
          <Box
            sx={{
              borderRadius: "100%",
              backgroundColor: "#e4e6eb",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IosShareIcon />
          </Box>
          <Box sx={{ fontSize: "13px", textAlign: "center", marginTop: "6px" }}>
            Chia sẻ
          </Box>
        </Link>
        <Link href="/">
          <Box
            sx={{
              borderRadius: "100%",
              backgroundColor: "#e4e6eb",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AccountCircleIcon />
          </Box>
          <Box sx={{ fontSize: "13px", textAlign: "center", marginTop: "6px" }}>
            Trang cá nhân
          </Box>
        </Link>
        <Link href="/">
          <Box
            sx={{
              borderRadius: "100%",
              backgroundColor: "#e4e6eb",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NotificationsIcon />
          </Box>
          <Box sx={{ fontSize: "13px", textAlign: "center", marginTop: "6px" }}>
            Tắt thông báo
          </Box>
        </Link>
        <Link href="/">
          <Box
            sx={{
              borderRadius: "100%",
              backgroundColor: "#e4e6eb",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SearchIcon />
          </Box>
          <Box sx={{ fontSize: "13px", textAlign: "center", marginTop: "6px" }}>
            Tìm kiếm
          </Box>
        </Link>
      </Box>
      <Box>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Ảnh/Video
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            File
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            Link
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
          <AccordionActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </AccordionActions>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            Thiết lập bảo mật
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
          <AccordionActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </AccordionActions>
        </Accordion>
      </Box>
    </Box>
  );
};

export default OptionChat;
