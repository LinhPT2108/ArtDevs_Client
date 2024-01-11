import React from "react";
import { Button, Input, Box, InputLabel } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import { Translate } from "@mui/icons-material";
const MessageBox = (pros: any) => {
  const { handleContent, handelPreview } = pros;
  const [formData, setFormData] = React.useState<MessageContent>({
    content: "",
    image: null,
    from: "",
    to: "",
  });
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
        name === "image" && fileInput.type === "file" ? fileInput.files : value,
    }));

    const selected = fileInput.files;

    if (selected || (selected == undefined && selectedFiles != undefined)) {
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
    formData.image = selectedFiles;
    event.preventDefault();
    handleContent(formData);
    handleClearAll();
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setPreviewURLs([]);
    setFormData({
      content: "",
      image: null,
      from: "",
      to: "",
    });
    handelPreview(false);
  };
  React.useEffect(() => {}, [selectedFiles]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "1px solid gray",
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
          }}
        >
          {previewURLs.map((url, index) => (
            <Box sx={{ position: "relative" }} key={index}>
              <img src={url} alt={`Preview ${index}`} width="68" height="68" />
              <Button
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  minWidth: "40px",
                  transform: "Translate(50%, -20%)",
                  color: "#7b7b7b",
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
            width: "fit-content",
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
              name="image"
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
