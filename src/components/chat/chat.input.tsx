import React from "react";
import { Button, Input, Box, FormControl, InputLabel } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
const MessageBox = (pros: any) => {
  const { handleContent } = pros;
  const [formData, setFormData] = React.useState<MessageContent>({
    content: "",
    image: null,
    from: "",
    to: "",
  });

  // lấy dữ liệu với 1 file
  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.target;

  //   const fileInput = event.target as HTMLInputElement;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]:
  //       name === "image" && fileInput.type === "file"
  //         ? fileInput.files
  //           ? fileInput.files[0]
  //           : null
  //         : value,
  //   }));
  // };

  // lấy dữ liệu với n file
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    const fileInput = event.target as HTMLInputElement;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "image" && fileInput.type === "file" ? fileInput.files : value,
    }));
  };

  const handleClickSendMess = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    handleContent(formData);
    console.log("Dữ liệu form đã được submit:", formData);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        borderTop: "1px solid gray",
      }}
    >
      <form onSubmit={handleClickSendMess}>
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
              width: "25px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
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
              name="image"
              onChange={handleChange}
            />
          </Box>
          <Input
            placeholder="Nhập nội dung ..."
            type="text"
            onChange={handleChange}
            name="content"
            value={formData.content}
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
            type="submit"
            id="sendButton"
            // onClick={handleClickSendMess}
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
