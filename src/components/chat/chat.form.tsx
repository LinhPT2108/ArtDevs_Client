"use client";
import {
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Messsages from "./chat.messages";
import MessageBox from "./chat.input";

const ChatMessagesForm = (pros: any) => {
  const { data, formatTimeDifference } = pros;
  const [content, setContent] = React.useState<MessageContent>();
  const [preViewImage, setPreviewImage] = React.useState<boolean>(false);
  const handleContent = (messageContent: MessageContent) => {
    messageContent.from = "123";
    messageContent.to = data.user.content;
    setContent(messageContent);
  };

  const handelPreview = (isPre: boolean) => {
    setPreviewImage(isPre);
  };
  console.log(">>> check content messages: ", content);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 320,
        height: 400,
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
        }}
      >
        {data && (
          <ListItemButton
            sx={{
              padding: { xs: "6px" },
              margin: " 0",
              borderBottom: "1px solid gray",
            }}
          >
            <ListItemIcon
              sx={{
                color: "white",
                backgroundColor: `${data?.user.bgColor}`,
                padding: "8px",
                minWidth: "40px",
                marginRight: { xs: "6px" },
                borderRadius: "100%",
              }}
            >
              {data?.user.icon}
            </ListItemIcon>

            <ListItemText
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginLeft: "12px",
                "& p": {
                  fontSize: "12px",
                },
                "& p::before": {
                  content: `""`,
                  backgroundColor: `${
                    data?.active ? "success.main" : "#7a837e"
                  }`,
                  padding: "0 6px",
                  minWidth: "6px",
                  borderRadius: "100%",
                  fontSize: "12px",
                  marginRight: "6px",
                },
              }}
              primary={data?.user.content}
              secondary={`${
                data?.active
                  ? "Online"
                  : `hoạt động ${formatTimeDifference(
                      new Date(),
                      data?.timeActive
                    )}`
              }`}
            />
            <IconButton
              aria-label="delete"
              size="large"
              onClick={pros.toggleDrawer("right", false)}
            >
              <ClearIcon />
            </IconButton>
          </ListItemButton>
        )}
        <Messsages preViewImage={preViewImage} />
        <MessageBox
          handleContent={handleContent}
          handelPreview={handelPreview}
        />
      </Box>
    </Box>
  );
};

export default ChatMessagesForm;
