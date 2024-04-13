import React from "react";
import { Button, Input, Box, InputLabel } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import { Translate } from "@mui/icons-material";
import {
  GLOBAL_NOTIFI,
  GLOBAL_SEND_IMAGE,
  GLOBAL_SEND_MESSAGE,
  GLOBAL_URL,
  // stompClient
} from "../utils/veriable.global";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { format } from "date-fns";
import { generateUniqueId } from "../utils/utils";
interface IPros {
  handleContent: (messageContent: MessageContentToPost) => void;
  handelPreview: (isPre: boolean) => void;
  pageUrl: string;
  session: User;
}

const socket = new SockJS("http://localhost:8080/wss");
const stompClient = Stomp.over(socket);

const MessageBox = (pros: IPros) => {
  const { handleContent, handelPreview, pageUrl, session } = pros;
  const getCurrentTime = (): string => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  };
  const [formData, setFormData] = React.useState<MessageContentToPost>({
    messageId: generateUniqueId(),
    subject: "",
    content: "",
    pictureOfMessages: null,
    formUser: "",
    toUser: "",
    timeMessage: new Date(),
  });

  const [imgReturn, setImgReturn] = React.useState<pictureOfMessageDTOs[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = React.useState<string[]>([]);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    const fileInput = event.target as HTMLInputElement;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "pictureOfMessages" && fileInput.type === "file"
          ? fileInput.files
          : value,
    }));

    const selected = fileInput.files;

    if (selected || (selected == undefined && selectedFiles.length > 0)) {
      const newSelectedFiles = Array.from(
        selected == null ? selectedFiles : selected
      );
      setSelectedFiles(newSelectedFiles);

      const newPreviewURLs: string[] = [];

      newSelectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewURLs.push(reader.result as string);
          setPreviewURLs([...newPreviewURLs]);
        };
        reader.readAsDataURL(file);
      });
      handelPreview(true);
    } else {
      setSelectedFiles([]);
      setPreviewURLs([]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);

    const newPreviewURLs = [...previewURLs];
    newPreviewURLs.splice(index, 1);
    setPreviewURLs(newPreviewURLs);
    newPreviewURLs.length == 0 ? handelPreview(false) : "";
  };
  const handleClickSendMess = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    formData.pictureOfMessages = selectedFiles;
    handleContent(formData);

    const notificationToPostDTO: notificationToPostDTO = {
      message: "message",
      receiverId: `${formData?.toUser}`,
      senderId: `${formData?.formUser}`,
      postId: "",
      shareId: "",
      type: "message",
    };
    stompClient.send(
      `${GLOBAL_NOTIFI}/${formData?.toUser}`,
      {},
      JSON.stringify(notificationToPostDTO)
    );

    await stompClient.send(
      `${GLOBAL_SEND_MESSAGE}/${formData?.toUser}`,
      {},
      JSON.stringify(formData)
    );
    if (formData.pictureOfMessages.length > 0) {
      console.log(formData.pictureOfMessages);
      const listPicDataFormdata = new FormData();
      if (formData.pictureOfMessages) {
        formData.pictureOfMessages.forEach((file: any, index: any) => {
          listPicDataFormdata.append("pictureOfMessages", file);
        });
      } else {
        listPicDataFormdata.append("pictureOfMessages", "");
      }
      const response = await fetch(
        GLOBAL_URL + `/api/img-message/${formData.messageId}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${session?.access_token}` },
          body: listPicDataFormdata,
        }
      );
      console.log(">>> check image data: ", response.status);
      if (response.status == 200) {
        const data = await response.json();
        console.log(data);
        formData.pictureOfMessages = data;
        handleContent(formData);
        // const pictureOfMessageDTO: pictureOfMessageDTOs[] = data;
        // console.log(JSON.parse(data));

        // setImgReturn(JSON.parse(data));
        data.forEach((e: any) => {
          console.log(e);
          stompClient.send(
            `${GLOBAL_SEND_IMAGE}/${formData?.toUser}`,
            {},
            JSON.stringify(e)
          );
        });
      } else {
        console.log("error respone");
      }
    } else {
      console.log("khongco anhr");
    }
    handleClearAll();
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setPreviewURLs([]);
    setFormData({
      messageId: generateUniqueId(),
      subject: "",
      content: "",
      pictureOfMessages: null,
      formUser: "",
      toUser: "",
      timeMessage: new Date(),
    });
    handelPreview(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "1px solid #80808026",
        "& form": {
          width: `${pageUrl === "home" ? "auto" : "100%"}`,
        },
        width: "100%",
      }}
    >
      {previewURLs.length > 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            "& img": {
              margin: "10px 0px 0px 10px",
            },
            "& video": {
              margin: "10px 0px 0px 10px",
            },
            overflow: "auto",
          }}
        >
          {previewURLs.map((url, index) => (
            <Box sx={{ position: "relative" }} key={index}>
              {url.match("image") != null ? (
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  width="68"
                  height="68"
                />
              ) : null}
              {url.match("video") != null ? (
                <video src={url} controls width="200" height="70" style={{
                  borderRadius: "16px",
                }} ></video>
              ) : null}
              <Button
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  minWidth: "20px",
                  transform: "Translate(30%, 0%)",
                  color: "#7b7b7b",
                  bgcolor:"#bababa",
                  p:0,
                  borderRadius:"50%"
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <ClearIcon />
              </Button>
            </Box>
          ))}
        </Box>
      )}
      <form onSubmit={handleClickSendMess}>
        <Box
          sx={{
            width: `${pageUrl === "home" ? "fit-content" : "100%"}`,
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#bbbdbd",
            padding: "0 0 0 15px",
            borderRadius: "30px",
            marginTop: `${previewURLs.length > 0 ? "0" : "10px"}`,
            boxShadow: "0px 0px 6px 1px rgba(188,188,188) inset",
          }}
        >
          <Box
            sx={{
              width: "25px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
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
                "&::after": {
                  border: "none",
                },
                "&::before": {
                  border: "none",
                  display: "none",
                },
                // display: "none",
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
              <AddPhotoAlternateIcon />
            </InputLabel>
            <input
              multiple
              type="file"
              id="file"
              name="pictureOfMessages"
              onChange={handleChange}
            />
          </Box>
          <Input
            placeholder="Nhập nội dung ..."
            autoComplete="off"
            type="text"
            onChange={handleChange}
            name="content"
            value={formData.content}
            sx={{
              width: `${pageUrl === "home" ? "200px" : "100%"}`,
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
            type="submit"
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
      </form>
    </Box>
  );
};

export default MessageBox;
