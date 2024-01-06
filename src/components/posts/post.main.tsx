import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { red } from "@mui/material/colors";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import React from "react";
interface IPros {
  messsages: MessageExample[];
}

const Post = (pros: IPros) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {pros?.messsages?.map(({ primary, secondary, person }, index) => (
        <Card
          sx={{
            borderRadius: "12px",
            backgroundColor: "#bdc0c7",
            margin: "0 0 24px 0",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 2px 4px",
            color: "white",
            "& p": {
              color: "white",
            },
          }}
          key={index + person}
        >
          <CardHeader
            sx={{
              color: "#000000",
            }}
            avatar={
              <Avatar
                sx={{ bgcolor: red[500] }}
                aria-label="recipe"
                alt="Profile Picture"
                src={person}
              ></Avatar>
            }
            action={
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <MoreVertIcon />
                </Avatar>
              </IconButton>
            }
            title="Thầy Vinh"
            subheader="December 31, 2024"
          />

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {primary}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            height="194"
            image="/logo.png"
            alt="Paella dish"
          />

          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <CommentIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                // filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <ReportGmailerrorredOutlinedIcon sx={{ marginRight: "6px" }} />
              Báo cáo bài viết
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <FlagOutlinedIcon sx={{ marginRight: "6px" }} />
              Báo cáo vi phạm
            </MenuItem>
          </Menu>
        </Card>
      ))}
    </>
  );
};

export default Post;
