import { Box } from "@mui/material";
import React from "react";
import MenuAccept from "./right-menu/menu.accept";
import MenuMentor from "./right-menu/menu.mentor";
import UserAccept from "./right-menu/menu.accept";
import MentorAccept from "./right-menu/menu.mentoraccept";
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
      {session.user.role.id === 3 ? (
        <MentorAccept session={session} />
      ) : (
        <MenuMentor session={session} />
      )}
    </Box>
  );
};

export default RightPost;
