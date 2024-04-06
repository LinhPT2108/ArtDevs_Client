"use client";
import {
  Button,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import * as React from "react";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_WHITE,
} from "../utils/veriable.global";

export default function HomeFeedback() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: "12px",
        padding: { xs: "24px 12px 12px 12px", sm: "0" },
      }}
    >
      <Box
        sx={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#050505",
        }}
      >
        Chung tay cải thiện Art Devs
      </Box>
      <Divider sx={{ margin: "8px 0 24px 0" }} />
      <Grid
        container
        columns={8}
        sx={{
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Grid item container xs={5} md={3} columns={5} spacing={2}>
          <Grid item xs={5} md={5}>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#050505",
              }}
            >
              Chúng tôi có thể cải thiện như thế nào ?
            </Box>
            <TextField
              id="title"
              hiddenLabel
              type="text"
              variant="filled"
              autoComplete="off"
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={5}
            md={5}
            sx={{
              "& .MuiTextField-root": {
                "& textarea": {
                  overflowY: "auto",
                  maxHeight: "200px", // Điều chỉnh chiều cao tối đa của text area
                  scrollbarWidth: "thin", // Đảm bảo thanh cuộn mỏng
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "red", // Màu sắc của thanh cuộn
                    borderRadius: "3px", // Bo tròn hai đầu của thanh cuộn
                  },
                },
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#050505",
                }}
              >
                Chi tiết
              </Box>
              (Vui lòng chia sẻ chi tiết nhất có thể)
            </Box>
            <TextField
              id="outlined-multiline-flexible"
              hiddenLabel
              multiline
              fullWidth
              maxRows={6}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={5} md={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                position: "relative",
                cursor: "pointer",
                "& label": {
                  width: "fit-content",
                  height: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                },
                "& input": {
                  "&::after": {
                    border: "none",
                    cursor: "pointer",
                  },
                  "&::before": {
                    border: "none",
                    display: "none",
                    cursor: "pointer",
                  },
                  // display: "none",v
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "pointer",
                },
              }}
            >
              <InputLabel htmlFor="file">
                <AttachFileIcon /> Thêm video hoặc ảnh chụp màn hình (đề xuất)
              </InputLabel>
              <input
                multiple
                type="file"
                id="file"
                name="image"
                // onChange={handleChange}
              />
            </Box>
          </Grid>
          <Grid item xs={5} md={5}>
            <Box sx={{ padding: "12px 0 12px 0", textAlign: "justify" }}>
              Nếu bạn có ý tưởng để cải thiện sản phẩm thì hãy cho chúng tôi
              biết nhé. Còn nếu cần trợ giúp để khắc phục vấn đề cụ thể.
            </Box>
          </Grid>
          <Grid
            item
            xs={5}
            md={5}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              aria-label="add an alarm"
              sx={{
                minWidth: "100px",
                textAlign: "center",
                borderRadius: "30px",
                padding: "8px 16px",
                boxShadow: GLOBAL_BOXSHADOW,
                background: GLOBAL_BG_BLUE_900,
                fontWeight: "bold",
                color: GLOBAL_COLOR_WHITE,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  backgroundColor: GLOBAL_BG_BLUE_300,
                },
              }}
            >
              <SendIcon />
              <Typography sx={{ marginLeft: "6px" }}>GỬI</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          xs={5}
          md={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            padding: "16px 0",
          }}
        >
          <CardMedia
            component="img"
            height="280"
            image="/locked.png"
            alt="lock"
            sx={{
              width: "auto",
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) ",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
