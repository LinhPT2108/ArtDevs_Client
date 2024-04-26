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
  DialogContentText,
  IconButton,
  makeStyles,
  styled,
} from "@mui/material";
import { checkUrl, isImage } from "./utils";
import CloseIcon from "@mui/icons-material/Close";

import ClearIcon from "@mui/icons-material/Clear";
import "../../style/loading.css";
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
  index: number;
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
      <PreviewImage
        index={index}
        url={_imageUrl}
        handleRemoveImage={handleRemoveImage}
      />
    </div>
  );
};

interface PreviewImageReplyProps {
  url: any;
  handleRemoveImageReply: (index: any) => void;
  index: number;
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
      <PreviewImageReply
        index={index}
        url={_imageUrl}
        handleRemoveImageReply={handleRemoveImageReply}
      />
    </div>
  );
};

import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import {
  GLOBAL_BG_BLUE_300,
  GLOBAL_BG_BLUE_900,
  GLOBAL_BOXSHADOW,
  GLOBAL_COLOR_WHITE,
} from "./veriable.global";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface IpDialog {
  openDialog: boolean;
  resPost: ResPost;
}

export const CustomizedDialogs: React.FC<IpDialog> = ({
  openDialog,
  resPost,
}) => {
  console.log(openDialog);
  console.log(resPost);

  const [open, setOpen] = React.useState(openDialog);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Modal title
      </DialogTitle>
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
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </Typography>
        <Typography gutterBottom>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </Typography>
        <Typography gutterBottom>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export const Loader = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="loading-wave">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    </Box>
  );
};

interface MyProcessingLoading {
  open: boolean;
  textContent?: string;
}

export const ProcessingLoading = ({
  open,
  textContent,
}: MyProcessingLoading) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
        },
      }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Loader />
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "12px ",
            }}
          >
            {textContent}
          </Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
