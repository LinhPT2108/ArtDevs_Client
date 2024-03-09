"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Container,
  CssBaseline,
  Divider,
  Grid,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import * as React from "react";
import LockIcon from "@mui/icons-material/Lock";

const options = ["Chỉ mình tôi", "Công khai", "Bạn bè"];
export default function HomeSecure() {
  const [anchorEls, setAnchorEls] = React.useState<Array<null | HTMLElement>>(
    Array(options.length).fill(null)
  );
  const [selectedIndexes, setSelectedIndexes] = React.useState<Array<number>>(
    Array(options.length).fill(1)
  );
  let listActivity = [
    "Ai có thể xem các bài viết của bạn trong tương lai?",
    "Giới hạn đối tượng cho các bài viết bạn đã chia sẻ với Bạn của bạn bè hoặc chia sẻ Công khai?",
    "Ai có thể nhìn thấy những người, Trang và danh sách mà bạn theo dõi?",
  ];
  const handleClickListItem =
    (index: number) => (event: React.MouseEvent<HTMLElement>) => {
      const newAnchorEls = [...anchorEls];
      newAnchorEls[index] = event.currentTarget;
      setAnchorEls(newAnchorEls);
    };

  const handleMenuItemClick = (index: number, optionIndex: number) => () => {
    const newSelectedIndexes = [...selectedIndexes];
    newSelectedIndexes[index] = optionIndex;
    setSelectedIndexes(newSelectedIndexes);
    setAnchorEls(Array(options.length).fill(null)); // Close all menus
  };

  const handleClose = (index: number) => () => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginTop: "12px" }}>
        <Typography component={"h4"} variant="h4">
          Bảo mật
        </Typography>
        <Divider sx={{ marginBottom: "24px" }} />
        <Card sx={{ maxWidth: 1200 }}>
          <CardHeader
            title="Đăng nhập"
            sx={{
              boxShadow: "0 0 1px 1px #8080806b",
              backgroundColor: "#f5f6f7",
            }}
          />

          <Box>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f6f787",
                }}
              >
                Đổi mật khẩu
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  columns={6}
                  sx={{
                    flexDirection: {
                      xs: "column-reverse",
                      sm: "row",
                    },
                  }}
                >
                  <Grid item container xs={5} md={1} columns={3} spacing={2}>
                    <Grid item xs={3}>
                      <TextField
                        id="filled-password-input"
                        label="Mật khẩu cũ"
                        type="password"
                        variant="filled"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="filled-new-password-input"
                        label="Mật khẩu mới"
                        type="password"
                        variant="filled"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="filled-confirm-password-input"
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        variant="filled"
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ marginX: "6px" }}
                      >
                        Hủy bỏ
                      </Button>
                      <Button variant="contained">Lưu lại</Button>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={5}
                    md={2}
                    columns={3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="194"
                      image="/locked.png"
                      alt="lock"
                      sx={{
                        width: "auto",
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) ",
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f6f787",
                }}
              >
                Hoạt động của bạn
              </AccordionSummary>
              <AccordionDetails>
                {listActivity?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 8px",
                    }}
                  >
                    <Typography
                      sx={{ textAlign: "justify", paddingRight: "18px" }}
                    >
                      {item}
                    </Typography>
                    <Box
                      sx={{
                        color: "#3339",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <List
                        component="nav"
                        aria-label="Device settings"
                        sx={{
                          bgcolor: "background.paper",
                          padding: 0,
                          width: "120px",
                        }}
                      >
                        <ListItemButton
                          id={`lock-button-${index}`}
                          aria-haspopup="listbox"
                          aria-controls={`lock-menu-${index}`}
                          aria-label="when device is locked"
                          aria-expanded={
                            Boolean(anchorEls[index]) ? "true" : undefined
                          }
                          onClick={handleClickListItem(index)}
                          sx={{ padding: 0, justifyContent: "flex-end" }}
                        >
                          <LockIcon
                            sx={{ fontSize: "18px", marginRight: "6px" }}
                          />
                          <Box sx={{ color: "#007deb" }}>
                            {options[selectedIndexes[index]] ||
                              options[selectedIndexes[1]]}
                          </Box>
                        </ListItemButton>
                      </List>
                      <Menu
                        id={`lock-menu-${index}`}
                        anchorEl={anchorEls[index]}
                        open={Boolean(anchorEls[index])}
                        onClose={handleClose(index)}
                        MenuListProps={{
                          "aria-labelledby": `lock-button-${index}`,
                          role: "listbox",
                        }}
                      >
                        {options.map((option, optionIndex) => (
                          <MenuItem
                            key={option}
                            selected={optionIndex === selectedIndexes[index]}
                            onClick={handleMenuItemClick(index, optionIndex)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Card>
      </Container>
    </React.Fragment>
  );
}
