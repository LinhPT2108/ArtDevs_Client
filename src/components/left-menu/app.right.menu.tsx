import { Box } from "@mui/material";
import MenuAccept from "./right-menu/menu.accept";
import MenuMentor from "./right-menu/menu.mentor";
import MenuSuggestFriend from "./right-menu/menu.suggest.friend";

const RightPost = ({session}: {session:User}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 220,
      }}
    >
      <MenuAccept />
      <MenuSuggestFriend session={session}/>
      <MenuMentor />
    </Box>
  );
};

export default RightPost;
