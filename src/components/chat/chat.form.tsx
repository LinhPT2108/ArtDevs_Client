"use client";
import {
  Avatar,
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from "@mui/icons-material/Clear";
import Messsages from "./chat.messages";
import MessageBox from "./chat.input";

type Anchor = "top" | "left" | "bottom" | "right";

interface IPros {
  data: UserMessage|undefined;
  dataMessage: MessageContent[]|null;
  formatTimeDifference: (startTime: Date, endTime: Date) => string;
  toggleDrawer?: (
    anchor: Anchor,
    open: boolean,
    item: UserMessage | undefined
  ) => void;
  pageUrl: string;
  session: User 
}

const ChatMessagesForm = (pros: IPros) => {
  const { data, formatTimeDifference, toggleDrawer, pageUrl, session, dataMessage } = pros;
  const [content, setContent] = React.useState<MessageContentToPost>();
  const [preViewImage, setPreviewImage] = React.useState<boolean>(false);
  const handleContent = (messageContent: MessageContentToPost) => {
    messageContent.formUserId = session?.user?.userId;
    messageContent.toUserId = data?.userId!;
    setContent(messageContent);
  };

  const handelPreview = (isPre: boolean) => {
    setPreviewImage(isPre);
  };
  console.log(">>> check content messages: ", content);
  console.table(dataMessage)
  if(!dataMessage){
    return 
  }
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: `${pageUrl == "home" ? 320 : "auto"}`,
        height: `${pageUrl == "home" ? 400 : "86vh"}`,
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          height: "100%",
          // overflow: "auto",
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
              borderBottom: "1px solid #80808026",
            }}
          >
            {data?.profilePicUrl ? (
              <Avatar
                alt={data?.profilePicUrl || ""}
                src={data?.profilePicUrl}
                sx={{
                  boxShadow: "0 0 2px 2px gray",
                }}
              />
            ) : (
              <ListItemIcon
                sx={{
                  color: "white",
                  backgroundColor: "grey",
                  padding: "8px",
                  minWidth: "40px",
                  marginRight: { xs: "6px" },
                  borderRadius: "100%",
                }}
              >
                <AccountCircleIcon />
              </ListItemIcon>
            )}

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
                    data?.online ? "success.main" : "#7a837e"
                  }`,
                  padding: "0 6px",
                  minWidth: "6px",
                  borderRadius: "100%",
                  fontSize: "12px",
                  marginRight: "6px",
                },
              }}
              primary={data?.fullname}
              secondary={`${data?.online ? "Online" : "Offline"}`}
            />
            {toggleDrawer && (
              <IconButton
                aria-label="delete"
                size="large"
                onClick={() => toggleDrawer("right", false, undefined)}
              >
                <ClearIcon />
              </IconButton>
            )}
          </ListItemButton>
        )}
        <Messsages preViewImage={preViewImage} pageUrl={pageUrl} dataMessage={dataMessage} session={session}/>
        <MessageBox
          handleContent={handleContent}
          handelPreview={handelPreview}
          pageUrl={pageUrl}
        />
      </Box>
    </Box>
  );
};

export default ChatMessagesForm;
