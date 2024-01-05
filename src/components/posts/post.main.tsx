import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";
interface IPros {
  messsages: MessageExample[];
}

const Post = (pros: IPros) => {
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
              <IconButton aria-label="settings">
                <MoreVertIcon />
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
        </Card>
      ))}
    </>
  );
};

export default Post;
