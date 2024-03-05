interface CubeSpanProps {
  index: number;
}

export const CubeSpan: React.FC<CubeSpanProps> = ({ index }) => {
  const spanStyle: React.CSSProperties = {
    ["--i" as any]: index,
  };

  return <span style={spanStyle} className="cube-span"></span>;
};

import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  styled,
} from "@mui/material";
import { checkUrl, isImage } from "./utils";
import CloseIcon from "@mui/icons-material/Close";

import ClearIcon from "@mui/icons-material/Clear";

const FadeInImage = styled("img")({
  animation: "fadeIn 0.5s ease-in-out",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  objectFit: "cover",
  width: `120px`,
  mx: "5px",
  borderRadius: "15px",
});

const RemoveButton = styled(Button)({
  position: "absolute",
  top: 0,
  right: 0,
  minWidth: "10px",
  transform: "translate(30%, -30%)",
  color: "#7b7b7b",
  borderRadius: "15px",
  backgroundColor: "#30363d",
  padding: "0px !important",
});
// TypeScript interface for props
interface PreviewImageProps {
  url: any;
  handleRemoveImage: (index: any) => void;
  index:number;
}
const PreviewImage: React.FC<PreviewImageProps> = ({
  index,
  url,
  handleRemoveImage,
}) => {
  const imageUrl = checkUrl(url);
  
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        mx: "5px",
      }}
    >
      <FadeInImage src={imageUrl} alt={`Preview ${imageUrl}`} />

      <RemoveButton onClick={() => handleRemoveImage(index)}>
        <ClearIcon />
      </RemoveButton>
    </Box>
  );
};

export const ImageViewer = (_imageUrl: any) => {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleOpen = () => {
    setOpenBackdrop(true);
  };

  const handleClose = () => {
    setOpenBackdrop(false);
  };

  return (
    <div>
      <CardMedia
        component={
          isImage(_imageUrl.imageUrl) === "image"
            ? "img"
            : isImage(_imageUrl.imageUrl) === "video"
            ? "video"
            : "div"
        }
        // autoPlay={isImage(_imageUrl.imageUrl.imageUrl) === "video"}
        controls={isImage(_imageUrl.imageUrl) === "video"}
        image={_imageUrl.imageUrl}
        alt={_imageUrl.imageUrl}
        sx={{
          objectFit: "cover",
          width: `120px`,
          mx: "5px",
          borderRadius: "15px",
        }}
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      />
      <Dialog
        open={openBackdrop}
        onClose={handleClose}
        fullScreen
        sx={{
          ".MuiPaper-root.MuiDialog-paper": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {" "}
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
          onClick={handleClose}
        >
          <img
            src={_imageUrl.imageUrl}
            alt="imageUrl"
            style={{ overflow: "hidden" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ImageViewerEditProps {
  handleRemoveImage: (nameFile: any) => void;
  index: number;
  _imageUrl: any;
}

export const ImageViewerEdit: React.FC<ImageViewerEditProps> = ({
  index,
  handleRemoveImage,
  _imageUrl,
}) => {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleOpen = () => {
    setOpenBackdrop(true);
  };

  const handleClose = () => {
    setOpenBackdrop(false);
  };

  return (
    <div>
      {/* <CardMedia
        component={
          isImage(_imageUrl.imageUrl) === "image"
            ? "img"
            : isImage(_imageUrl.imageUrl) === "video"
            ? "video"
            : "div"
        }
        // autoPlay={isImage(_imageUrl.imageUrl.imageUrl) === "video"}
        controls={isImage(_imageUrl.imageUrl) === "video"}
        image={_imageUrl.imageUrl}
        alt={_imageUrl.imageUrl}
        sx={{
          objectFit: "cover",
          width: `120px`,
          mx: "5px",
          borderRadius: "15px",
        }}
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      /> */}
      <PreviewImage index={index} url={_imageUrl} handleRemoveImage={handleRemoveImage} />
    </div>
  );
};



interface PreviewImageReplyProps {
  url: any;
  handleRemoveImageReply: (index: any) => void;
  index:number;
}
const PreviewImageReply: React.FC<PreviewImageReplyProps> = ({
  index,
  url,
  handleRemoveImageReply,
}) => {
  const imageUrl = checkUrl(url);
  
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        mr: "8px",
      }}
    >
      <FadeInImage src={imageUrl} alt={`Preview ${imageUrl}`} />

      <RemoveButton onClick={() => handleRemoveImageReply(index)}>
        <ClearIcon />
      </RemoveButton>
    </Box>
  );
};

interface ImageReplyViewerEditProps {
  handleRemoveImageReply: (nameFile: any) => void;
  index: number;
  _imageUrl: any;
}

export const ImageReplyViewerEdit: React.FC<ImageReplyViewerEditProps> = ({
  index,
  handleRemoveImageReply,
  _imageUrl,
}) => {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleOpen = () => {
    setOpenBackdrop(true);
  };

  const handleClose = () => {
    setOpenBackdrop(false);
  };

  return (
    <div>
      <PreviewImageReply index={index} url={_imageUrl} handleRemoveImageReply={handleRemoveImageReply} />
    </div>
  );
};
