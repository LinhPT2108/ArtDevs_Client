import React from "react";
import { Button, Input, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
const MessageBox = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        borderTop: "1px solid gray",
      }}
    >
      <Box
        sx={{
          width: "fit-content",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#bbbdbd",
          padding: "0 0 0 15px",
          borderRadius: "30px",
          marginTop: "10px",
          boxShadow: "0px 0px 6px 1px rgba(188,188,188) inset",
        }}
      >
        <Box
          sx={{
            width: "fit-content",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
            "& label": {
              cursor: "pointer",
              width: "fit-content",
              height: "fit-content",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            },
            "& input": {
              display: "none",
            },
          }}
        >
          <label htmlFor="file">
            <AddPhotoAlternateIcon />
          </label>
          <input type="file" id="file" name="file" />
        </Box>
        <Input
          required
          placeholder="Nhập nội dung ..."
          type="text"
          sx={{
            width: "200px",
            height: "100%",
            backgroundColor: "transparent",
            outline: "none",
            border: "none",
            paddingLeft: "10px",
            color: "black",
            "&::after": {
              border: "none",
            },
            "&::before": {
              border: "none",
              display: "none",
            },
          }}
        />
        <Button
          id="sendButton"
          sx={{
            width: "fit-content",
            height: "100%",
            backgroundColor: "transparent",
            outline: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s",
            ":hover svg path": {
              fill: "#1976d2",
              stroke: "#1976d2",
            },
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default MessageBox;
