import { Box } from "@mui/material";
import React from "react";
import MenuAccept from "./right-menu/menu.accept";
import MenuMentor from "./right-menu/menu.mentor";
import MentorAccept from "./right-menu/menu.mentoraccept";
import UserAccept from "./right-menu/menu.accept";
interface IPros {
  session: User;
}
const RightPost = ({ session }: IPros) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 220,
      }}
    >
      <UserAccept session={session} />
      <MenuMentor />
    </Box>
  );
};

export default RightPost;
