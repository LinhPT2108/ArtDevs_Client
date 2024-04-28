"use client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Avatar,
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect } from "react";
import { GLOBAL_BG_NAV } from "../utils/veriable.global";
import MessageBox from "./chat.input";
import Messsages from "./chat.messages";
import { useRouter } from "next/navigation";

type Anchor = "top" | "left" | "bottom" | "right";

interface IPros {
  data: UserMessage | undefined;
  dataMessage: MessageContent[] | null;
  formatTimeDifference: (startTime: Date, endTime: Date) => string;
  toggleDrawer?: (
    anchor: Anchor,
    open: boolean,
    item: UserMessage | undefined
  ) => void;
  pageUrl: string;
  session: User;
}

const ChatMessagesForm = (pros: IPros) => {
  const {
    data,
    formatTimeDifference,
    toggleDrawer,
    pageUrl,
    session,
    dataMessage,
  } = pros;

  const [newDataMessage, setNewDataMessage] = React.useState<
    MessageContent[] | null
  >();
  const [content, setContent] = React.useState<MessageContentToPost>();
  const [preViewImage, setPreviewImage] = React.useState<boolean>(false);
  const handleContent = (messageContent: MessageContentToPost) => {
    messageContent.formUser = session?.user?.userId;
    messageContent.toUser = data?.userId!;
    setContent(messageContent);
  };

  const handelPreview = (isPre: boolean) => {
    setPreviewImage(isPre);
  };

  useEffect(() => {
    console.log(dataMessage);
    setNewDataMessage(dataMessage);
  }, [dataMessage]);
  useEffect(() => {
    if (content) {
      // dataMessage?.push(content as any);
      const contentNew: MessageContent = {
        messageId: content.messageId,
        content: content.content,
        timeMessage: content.timeMessage.toISOString(),
        subject: content.subject,
        formUserId: content.formUser,
        toUserId: content.toUser,
        relationShipId: true,
        pictureOfMessages: content.pictureOfMessages,
      };
      console.log(">>> check new content messages: ", contentNew);
      setNewDataMessage((pre: any) => [...pre, contentNew]);
      // if (contentNew.pictureOfMessages.length > 0) {
      //   console.log(contentNew.pictureOfMessages);

      // } else {
      //   console.log("khoong co canh");
      // }
    }
  }, [content]);
  useEffect(() => {
    console.log(newDataMessage);
  }, [newDataMessage]);

  //biến chuyển hướng
  const router = useRouter();
  // xử lý chuyển hướng trang cá nhân
  const handleRouterProfile = (id: string) => {
    router.push(`/profile?id=${id}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: `${pageUrl == "home" ? 320 : "auto"}`,
        height: `${pageUrl == "home" ? 400 : "86vh"}`,
        backgroundColor: GLOBAL_BG_NAV,
      }}
    >
      {" "}
      <Box
        sx={{
          height: "100%",
          // overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
        }}
      >
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
              onClick={() => handleRouterProfile(data?.userId)}
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
              onClick={() => handleRouterProfile(data?.userId!)}
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
                backgroundColor: `${data?.online ? "success.main" : "#7a837e"}`,
                padding: "0 6px",
                minWidth: "6px",
                borderRadius: "100%",
                fontSize: "12px",
                marginRight: "6px",
              },
            }}
            onClick={() => handleRouterProfile(data?.userId!)}
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

        <Messsages
          preViewImage={preViewImage}
          pageUrl={pageUrl}
          dataMessage={newDataMessage!}
          session={session}
        />
        <MessageBox
          handleContent={handleContent}
          handelPreview={handelPreview}
          pageUrl={pageUrl}
          session={session}
        />
      </Box>
    </Box>
  );
};

export default ChatMessagesForm;
