import {
  Avatar,
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
interface IPros {
  messsages: MessageExample[];
}

const Post = (pros: IPros) => {
  return (
    <>
      <CssBaseline />

      <List sx={{ paddingTop: 0 }}>
        {pros?.messsages?.map(({ primary, secondary, person }, index) => (
          <ListItem
            key={index + person}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#8b8e95",
              margin: "0 0 24px 0",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 2px 4px",
              color: "white",
              "& p": {
                color: "white",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={person} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Post;
